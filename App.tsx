
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import NavBar from './components/NavBar';
import DispatcherDashboard from './components/DispatcherDashboard';
import EmtDashboard from './components/EmtDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import COODashboard from './COODashboard';
import AdminDashboard from './components/AdminDashboard';
import LogCallForm from './components/LogCallForm';
import PatientCareRecordForm from './components/PatientCareRecordForm';
import ConfirmationPage from './components/ConfirmationPage';
import { User, EmergencyCall, Team, PatientCareRecord, UserRole, CallStatus, TeamStatus, TeamGrade, EmtStatus, Priority, Schedule, AuditLogEntry } from './types';
import { INITIAL_USERS, INITIAL_TEAMS, INITIAL_CALLS, INITIAL_SCHEDULE, INITIAL_AUDIT_LOGS } from './constants';

type AppView = 'login' | 'signup' | 'dashboard' | 'logCall' | 'filePCR' | 'confirmation';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('login');
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // App state
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [calls, setCalls] = useState<EmergencyCall[]>(INITIAL_CALLS);
    const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
    const [pcrs, setPcrs] = useState<PatientCareRecord[]>([]);
    const [schedule, setSchedule] = useState<Schedule>(INITIAL_SCHEDULE);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

    const [callToEdit, setCallToEdit] = useState<EmergencyCall | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    const logAuditEvent = (action: string, details?: string) => {
        const newLogEntry: AuditLogEntry = {
            id: auditLog.length + 1,
            timestamp: new Date(),
            user: loggedInUser?.username || 'System',
            action,
            details
        };
        setAuditLog(prev => [newLogEntry, ...prev]);
    };

    const handleLogin = (username: string, password_unused: string): boolean => {
        const user = users.find(u => u.username === username);
        if (user) {
            setLoggedInUser(user);
            setView('dashboard');
            logAuditEvent('User Login');
            return true;
        }
        return false;
    };
    
    const handleSignUp = (userData: Omit<User, 'id' | 'status'>): boolean => {
        if (users.some(u => u.username === userData.username)) {
            return false;
        }
        const newUser: User = { 
            id: users.length + 1, 
            ...userData, 
            status: userData.role === UserRole.EMT ? EmtStatus.OFF_DUTY : null,
        };
        setUsers(prev => [...prev, newUser]);
        setLoggedInUser(newUser);
        setView('dashboard');
        logAuditEvent('User Signed Up', `New user: ${newUser.username}`);
        return true;
    };

    const handleLogout = () => {
        logAuditEvent('User Logout');
        setLoggedInUser(null);
        setView('login');
    };

    const handleLogCallSubmit = (callData: Omit<EmergencyCall, 'id' | 'timestamp' | 'status' | 'pcrId' | 'assignedTeamId'>) => {
        const newCall: EmergencyCall = {
            id: calls.length + 1,
            ...callData,
            timestamp: new Date(),
            status: CallStatus.PENDING,
        };
        setCalls(prev => [newCall, ...prev]);
        setConfirmationMessage('Emergency call logged successfully!');
        setView('confirmation');
        logAuditEvent('Call Logged', `ID: ${newCall.id}, Loc: ${newCall.location}`);
    };
    
    const handleUpdateCallStatus = (callId: number, status: CallStatus, teamId?: number) => {
        setCalls(prevCalls => prevCalls.map(c => {
            if (c.id === callId) {
                const updatedCall = { ...c, status };
                if (status === CallStatus.DISPATCHED) updatedCall.dispatchTimestamp = new Date();
                if (status === CallStatus.ON_SCENE) updatedCall.onSceneTimestamp = new Date();
                if (status === CallStatus.COMPLETED) updatedCall.completedTimestamp = new Date();
                logAuditEvent('Call Status Updated', `ID: ${callId}, New Status: ${status}`);
                return updatedCall;
            }
            return c;
        }));
        if (teamId) {
            let teamStatus: TeamStatus;
            switch(status) {
                case CallStatus.DISPATCHED: teamStatus = TeamStatus.DISPATCHED; break;
                case CallStatus.ON_SCENE: teamStatus = TeamStatus.ON_SCENE; break;
                case CallStatus.TRANSPORTING: teamStatus = TeamStatus.TRANSPORTING; break;
                case CallStatus.COMPLETED: teamStatus = TeamStatus.AVAILABLE; break;
                default: teamStatus = teams.find(t => t.id === teamId)?.status || TeamStatus.AVAILABLE;
            }
            handleUpdateTeamStatus(teamId, teamStatus);
        }
    };
    
    const handleAssignTeam = (callId: number, teamId: number) => {
        setCalls(prev => prev.map(c => c.id === callId ? { ...c, assignedTeamId: teamId, status: CallStatus.DISPATCHED, dispatchTimestamp: new Date() } : c));
        handleUpdateTeamStatus(teamId, TeamStatus.DISPATCHED);
        logAuditEvent('Team Assigned', `Call ID: ${callId} to Team ID: ${teamId}`);
    };

    const handleUpdateTeamStatus = (teamId: number, status: TeamStatus) => {
        setTeams(prev => prev.map(t => t.id === teamId ? {...t, status: status} : t));
        logAuditEvent('Team Status Updated', `Team ID: ${teamId}, New Status: ${status}`);
    };

    const handleUpdateUserStatus = (userId: number, status: EmtStatus) => {
        setUsers(prev => prev.map(u => u.id === userId ? {...u, status} : u));
        logAuditEvent('User Status Updated', `User ID: ${userId}, New Status: ${status}`);
    };
    
    const handleFilePCRSubmit = (pcrData: Omit<PatientCareRecord, 'id' | 'callId'>) => {
        if (!callToEdit) return;
        const newPcr: PatientCareRecord = {
            id: pcrs.length + 1,
            callId: callToEdit.id,
            ...pcrData,
        };
        setPcrs(prev => [...prev, newPcr]);
        setCalls(prev => prev.map(c => c.id === callToEdit.id ? {...c, pcrId: newPcr.id} : c));
        setCallToEdit(null);
        setConfirmationMessage('Patient Care Record filed successfully!');
        setView('confirmation');
        logAuditEvent('PCR Filed', `Call ID: ${callToEdit.id}`);
    };
    
    const handleUpdateTeam = (updatedTeam: Team) => {
        setTeams(prevTeams => prevTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
        
        const originalTeam = teams.find(t => t.id === updatedTeam.id);
        const originalMemberIds = originalTeam ? originalTeam.members.map(m => m.id) : [];
        const newMemberIds = updatedTeam.members.map(m => m.id);

        const addedMembers = newMemberIds.filter(id => !originalMemberIds.includes(id));
        const removedMembers = originalMemberIds.filter(id => !newMemberIds.includes(id));

        setUsers(prevUsers => prevUsers.map(u => {
            if (addedMembers.includes(u.id)) return { ...u, teamId: updatedTeam.id };
            if (removedMembers.includes(u.id)) return { ...u, teamId: undefined };
            return u;
        }));
        logAuditEvent('Team Updated', `Team ID: ${updatedTeam.id}`);
    };

    const handleUpdateSchedule = (updatedSchedule: Schedule) => {
        setSchedule(updatedSchedule);
        logAuditEvent('Schedule Updated');
    };
    
    const renderDashboard = () => {
        if (!loggedInUser) return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
        switch (loggedInUser.role) {
            case UserRole.DISPATCHER:
                return <DispatcherDashboard calls={calls} teams={teams} onAssignTeam={handleAssignTeam} onUpdateCallStatus={handleUpdateCallStatus} onLogNewCall={() => setView('logCall')} />;
            case UserRole.EMT:
                return <EmtDashboard user={loggedInUser} calls={calls} teams={teams} onFilePCR={(call) => { setCallToEdit(call); setView('filePCR'); }} onUpdateCallStatus={handleUpdateCallStatus} onUpdateUserStatus={handleUpdateUserStatus} isDarkMode={isDarkMode} />;
            case UserRole.SUPERVISOR:
                return <SupervisorDashboard calls={calls} users={users} teams={teams} schedule={schedule} onUpdateTeam={handleUpdateTeam} onUpdateSchedule={handleUpdateSchedule} />;
            case UserRole.COO:
                return <COODashboard calls={calls} isDarkMode={isDarkMode} />;
            case UserRole.ADMIN:
                return <AdminDashboard logs={auditLog} onBackup={() => { logAuditEvent("Manual System Backup Triggered"); alert("System backup completed successfully.");}} />;
            default:
                return <div>Dashboard not available for this role.</div>;
        }
    };
    
    const renderContent = () => {
        switch (view) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
            case 'signup':
                return <SignUpPage onSignUp={handleSignUp} onNavigateToLogin={() => setView('login')} />;
            case 'logCall':
                return <LogCallForm onSubmit={handleLogCallSubmit} onCancel={() => setView('dashboard')} />;
            case 'filePCR':
                if (callToEdit) {
                    return <PatientCareRecordForm call={callToEdit} onSubmit={handleFilePCRSubmit} onCancel={() => setView('dashboard')} />;
                }
                return renderDashboard(); // fallback
            case 'confirmation':
                return <ConfirmationPage message={confirmationMessage} onBack={() => setView('dashboard')} />;
            case 'dashboard':
            default:
                return renderDashboard();
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} font-sans`}>
            {loggedInUser && <NavBar user={loggedInUser} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}
            <main>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
