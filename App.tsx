
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

// localStorage keys
const USERS_STORAGE_KEY = 'pulsepoint_eris_users';
const CALLS_STORAGE_KEY = 'pulsepoint_eris_calls';
const TEAMS_STORAGE_KEY = 'pulsepoint_eris_teams';
const PCRS_STORAGE_KEY = 'pulsepoint_eris_pcrs';
const SCHEDULE_STORAGE_KEY = 'pulsepoint_eris_schedule';
const AUDIT_LOG_STORAGE_KEY = 'pulsepoint_eris_audit_log';
const DARK_MODE_KEY = 'pulsepoint_eris_dark_mode';

const loadStateFromLocalStorage = () => {
    try {
        // Users
        const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        const users: User[] = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;

        // Calls (with date parsing)
        const savedCalls = localStorage.getItem(CALLS_STORAGE_KEY);
        let calls: EmergencyCall[] = INITIAL_CALLS;
        if (savedCalls) {
            const parsedCalls = JSON.parse(savedCalls);
            calls = parsedCalls.map((call: any) => ({
                ...call,
                timestamp: new Date(call.timestamp),
                dispatchTimestamp: call.dispatchTimestamp ? new Date(call.dispatchTimestamp) : undefined,
                onSceneTimestamp: call.onSceneTimestamp ? new Date(call.onSceneTimestamp) : undefined,
                completedTimestamp: call.completedTimestamp ? new Date(call.completedTimestamp) : undefined,
            }));
        }

        // Teams (with hydration using the users we just loaded)
        const savedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
        let teams: Team[] = INITIAL_TEAMS;
        if (savedTeams) {
            const parsedTeams = JSON.parse(savedTeams) as Team[];
            teams = parsedTeams.map(team => ({
                ...team,
                members: team.members.map(member => users.find(u => u.id === member.id)).filter((u): u is User => !!u)
            }));
        }
        
        // PCRs
        const savedPcrs = localStorage.getItem(PCRS_STORAGE_KEY);
        const pcrs: PatientCareRecord[] = savedPcrs ? JSON.parse(savedPcrs) : [];

        // Schedule
        const savedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
        const schedule: Schedule = savedSchedule ? JSON.parse(savedSchedule) : INITIAL_SCHEDULE;

        // Audit Log (with date parsing)
        const savedLogs = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
        let auditLog: AuditLogEntry[] = INITIAL_AUDIT_LOGS;
        if (savedLogs) {
            const parsedLogs = JSON.parse(savedLogs);
            auditLog = parsedLogs.map((log: any) => ({
                ...log,
                timestamp: new Date(log.timestamp),
            }));
        }

        // Dark Mode
        const savedMode = localStorage.getItem(DARK_MODE_KEY);
        const isDarkMode = savedMode ? JSON.parse(savedMode) : false;

        return { users, calls, teams, pcrs, schedule, auditLog, isDarkMode };

    } catch (error) {
        console.error("Could not load state from localStorage. Falling back to initial state.", error);
        return { 
            users: INITIAL_USERS, 
            calls: INITIAL_CALLS, 
            teams: INITIAL_TEAMS, 
            pcrs: [], 
            schedule: INITIAL_SCHEDULE, 
            auditLog: INITIAL_AUDIT_LOGS,
            isDarkMode: false 
        };
    }
};


const App: React.FC = () => {
    const [initialState] = useState(loadStateFromLocalStorage);

    const [view, setView] = useState<AppView>('login');
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    
    const [isDarkMode, setIsDarkMode] = useState<boolean>(initialState.isDarkMode);
    const [users, setUsers] = useState<User[]>(initialState.users);
    const [calls, setCalls] = useState<EmergencyCall[]>(initialState.calls);
    const [teams, setTeams] = useState<Team[]>(initialState.teams);
    const [pcrs, setPcrs] = useState<PatientCareRecord[]>(initialState.pcrs);
    const [schedule, setSchedule] = useState<Schedule>(initialState.schedule);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialState.auditLog);

    const [callToEdit, setCallToEdit] = useState<EmergencyCall | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Effects for saving state to localStorage
    useEffect(() => {
        localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    
    useEffect(() => { localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls)); }, [calls]);
    useEffect(() => { localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams)); }, [teams]);
    useEffect(() => { localStorage.setItem(PCRS_STORAGE_KEY, JSON.stringify(pcrs)); }, [pcrs]);
    useEffect(() => { localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule)); }, [schedule]);
    useEffect(() => { localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(auditLog)); }, [auditLog]);

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
            // FIX: Replaced Math.max with a safer reduce-based method to find the next available ID.
            id: users.map(u => u.id).reduce((maxId, currentId) => Math.max(maxId, currentId), 0) + 1,
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
            // FIX: Replaced Math.max with a safer reduce-based method to find the next available ID.
            id: calls.map(c => c.id).reduce((maxId, currentId) => Math.max(maxId, currentId), 0) + 1,
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
        // FIX: Using a more explicit check for teamId to ensure type safety, which resolves the type error.
        if (teamId !== undefined) {
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
        const newUsers = users.map(u => 
            u.id === userId ? { ...u, status } : u
        );
        setUsers(newUsers);

        if (loggedInUser && loggedInUser.id === userId) {
            const updatedUser = newUsers.find(u => u.id === userId);
            if (updatedUser) {
                setLoggedInUser(updatedUser);
            }
        }
        
        logAuditEvent('User Status Updated', `User ID: ${userId}, New Status: ${status}`);
    };
    
    const handleFilePCRSubmit = (pcrData: Omit<PatientCareRecord, 'id' | 'callId'>) => {
        if (!callToEdit) return;
        const newPcr: PatientCareRecord = {
            // FIX: Replaced Math.max with a safer reduce-based method to find the next available ID.
            id: pcrs.map(p => p.id).reduce((maxId, currentId) => Math.max(maxId, currentId), 0) + 1,
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
        const originalTeam = teams.find(t => t.id === updatedTeam.id)!;
        const originalMemberIds = new Set(originalTeam.members.map(m => m.id));
        const updatedMemberIds = new Set(updatedTeam.members.map(m => m.id));

        const addedUserIds = [...updatedMemberIds].filter(id => !originalMemberIds.has(id));
        const removedUserIds = [...originalMemberIds].filter(id => !updatedMemberIds.has(id));

        // First, update the single source of truth for assignments: the users array.
        const newUsers = users.map(u => {
            if (addedUserIds.includes(u.id)) {
                // This user was added to the team, so assign them. This handles re-assignments.
                return { ...u, teamId: updatedTeam.id };
            }
            if (removedUserIds.includes(u.id)) {
                // This user was removed from the team, so unassign them.
                return { ...u, teamId: undefined };
            }
            return u;
        });
        setUsers(newUsers);

        // Now, resynchronize ALL teams based on the updated users list.
        // This ensures that a user moved from Team A to Team B is removed from Team A's member list.
        const newTeams = teams.map(t => {
            // For the team being edited, use the new data from the modal.
            if (t.id === updatedTeam.id) {
                return {
                    ...updatedTeam,
                    members: newUsers.filter(u => updatedMemberIds.has(u.id))
                };
            }
            // For all other teams, just refilter their members to reflect any changes.
            return {
                ...t,
                members: newUsers.filter(u => u.teamId === t.id)
            };
        });
        setTeams(newTeams);

        logAuditEvent('Team Updated', `Team ID: ${updatedTeam.id}`);
    };

    const handleAssignUserToTeam = (userId: number, teamId: number) => {
        // 1. Update the user's teamId in the master user list. This is the source of truth.
        const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, teamId } : u
        );
        setUsers(updatedUsers);

        // 2. Re-synchronize ALL teams based on the updated users list.
        // This correctly adds the user to the new team and removes them from any old one.
        const updatedTeams = teams.map(team => ({
            ...team,
            members: updatedUsers.filter(u => u.teamId === team.id)
        }));
        setTeams(updatedTeams);

        logAuditEvent('User Assigned to Team', `User ID: ${userId} to Team ID: ${teamId}`);
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
                return <SupervisorDashboard calls={calls} users={users} teams={teams} schedule={schedule} onUpdateTeam={handleUpdateTeam} onUpdateSchedule={handleUpdateSchedule} onAssignUserToTeam={handleAssignUserToTeam} />;
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
