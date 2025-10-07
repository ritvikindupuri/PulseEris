
import React, { useState, useMemo } from 'react';
import { EmergencyCall, Team, CallStatus, TeamStatus } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import LiveMapPanel from './LiveMapPanel';
import EODReportModal from './EODReportModal';
import { ReportIcon } from './icons/ReportIcon';

interface DispatcherDashboardProps {
  calls: EmergencyCall[];
  teams: Team[];
  onAssignTeam: (callId: number, teamId: number) => void;
  onUpdateCallStatus: (callId: number, status: CallStatus) => void;
  onLogNewCall: () => void;
}

const getPriorityClass = (priority: number) => {
    switch (priority) {
      case 1: return { border: 'border-red-500', bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' };
      case 2: return { border: 'border-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200' };
      case 3: return { border: 'border-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' };
      case 4: return { border: 'border-green-500', bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200' };
      default: return { border: 'border-gray-500', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' };
    }
};

const DispatcherDashboard: React.FC<DispatcherDashboardProps> = ({ calls, teams, onAssignTeam, onUpdateCallStatus, onLogNewCall }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null);
    const [showEODReport, setShowEODReport] = useState(false);

    const pendingCalls = useMemo(() => 
        calls.filter(c => c.status === CallStatus.PENDING && (c.location.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())))
        .sort((a,b) => a.priority - b.priority)
    , [calls, searchTerm]);
    
    const activeCalls = useMemo(() => 
        calls.filter(c => c.status !== CallStatus.PENDING && c.status !== CallStatus.COMPLETED && c.status !== CallStatus.CANCELLED)
        .sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    , [calls]);

    const availableTeams = useMemo(() => teams.filter(t => t.status === TeamStatus.AVAILABLE), [teams]);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dispatcher Dashboard</h1>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowEODReport(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                       <ReportIcon /> Generate EOD Report
                    </button>
                    <button onClick={onLogNewCall} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                        <PlusIcon /> Log New Call
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Pending Calls Column */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Pending Incidents ({pendingCalls.length})</h2>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search location or description..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-y-auto h-[65vh]">
                        {pendingCalls.length > 0 ? (
                            pendingCalls.map(call => (
                                <div key={call.id} onClick={() => setSelectedCall(call)} className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedCall?.id === call.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${getPriorityClass(call.priority).border}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{call.location}</p>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityClass(call.priority).bg} ${getPriorityClass(call.priority).text}`}>
                                            P{call.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{call.description}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{call.timestamp.toLocaleTimeString()}</p>
                                </div>
                            ))
                        ) : (
                             <div className="text-center py-16 px-6 h-full flex flex-col items-center justify-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No pending incidents</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                   All calls have been dispatched.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map & Team Assignment */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg h-full p-4 flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Incident Details & Assignment</h2>
                        {selectedCall ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <div className="flex flex-col">
                                    <LiveMapPanel location={selectedCall.location} />
                                    <div className={`p-4 mt-4 rounded-lg ${getPriorityClass(selectedCall.priority).bg}`}>
                                        <h3 className={`font-bold text-lg ${getPriorityClass(selectedCall.priority).text}`}>{selectedCall.location}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCall.callerName} - {selectedCall.phone}</p>
                                        <p className="mt-2 text-gray-700 dark:text-gray-300">{selectedCall.description}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Available Teams ({availableTeams.length})</h3>
                                    <div className="space-y-2">
                                        {availableTeams.map(team => (
                                            <div key={team.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-gray-100">{team.name} <span className="text-xs font-normal text-gray-500">({team.grade})</span></p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{team.members.map(m => m.username).join(', ')}</p>
                                                </div>
                                                <button onClick={() => { onAssignTeam(selectedCall.id, team.id); setSelectedCall(null); }} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition text-sm">
                                                    Assign
                                                </button>
                                            </div>
                                        ))}
                                        {availableTeams.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No teams are currently available.</p>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                                <p>Select a pending incident to view details and assign a team.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showEODReport && <EODReportModal calls={calls} onClose={() => setShowEODReport(false)} />}
        </div>
    );
};

export default DispatcherDashboard;