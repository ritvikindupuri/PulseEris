import React, { useMemo } from 'react';
import { EmergencyCall, CallStatus, User, Team, TeamStatus, EmtStatus } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import ShiftSummaryCharts from './ShiftSummaryCharts';

interface EmtDashboardProps {
  user: User;
  calls: EmergencyCall[];
  teams: Team[];
  onFilePCR: (call: EmergencyCall) => void;
  // FIX: Replaced onUpdateTeamStatus with onUpdateCallStatus for better logic flow and to align with changes in App.tsx.
  onUpdateCallStatus: (callId: number, status: CallStatus, teamId: number) => void;
  onUpdateUserStatus: (userId: number, status: EmtStatus) => void;
  isDarkMode: boolean;
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

// FIX: Destructured onUpdateCallStatus instead of onUpdateTeamStatus.
const EmtDashboard: React.FC<EmtDashboardProps> = ({ user, calls, teams, onFilePCR, onUpdateCallStatus, onUpdateUserStatus, isDarkMode }) => {
  
  const myTeam = useMemo(() => teams.find(t => t.id === user.teamId), [teams, user.teamId]);
  
  const assignedCall = useMemo(() => {
    if (!myTeam) return null;
    return calls.find(call => call.assignedTeamId === myTeam.id && call.status !== CallStatus.COMPLETED && call.status !== CallStatus.CANCELLED);
  }, [calls, myTeam]);

  const completedCallsToday = useMemo(() => {
    if(!myTeam) return [];
    const today = new Date();
    today.setHours(0,0,0,0);
    return calls.filter(c => c.assignedTeamId === myTeam.id && c.status === CallStatus.COMPLETED && c.timestamp >= today);
  }, [calls, myTeam]);

  const priorityClass = assignedCall ? getPriorityClass(assignedCall.priority) : getPriorityClass(0);

  const handleClockIn = () => onUpdateUserStatus(user.id, EmtStatus.ON_DUTY);
  const handleClockOut = () => onUpdateUserStatus(user.id, EmtStatus.OFF_DUTY);

  if (user.status === EmtStatus.OFF_DUTY) {
    return (
        <div className="container mx-auto p-8 text-center">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Clocked Out</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">You are currently off duty. Clock in to see your assignments.</p>
                <button 
                    onClick={handleClockIn}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out text-lg"
                >
                    Clock In
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {myTeam ? `${myTeam.name} Dashboard` : 'EMT Dashboard'}
            </h1>
            <button 
                onClick={handleClockOut}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
                Clock Out
            </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Current Assignment */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Current Assignment</h2>
                {assignedCall && myTeam ? (
                    <div className={`bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border-l-8 ${priorityClass.border}`}>
                        <div className={`p-6 ${priorityClass.bg}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-2xl font-bold ${priorityClass.text}`}>{assignedCall.location}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4" />
                                        {assignedCall.callerName} - {assignedCall.phone}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg px-3 py-1 rounded-full ${priorityClass.bg} ${priorityClass.text}`}>Priority {assignedCall.priority}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{assignedCall.timestamp.toLocaleString()}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300">{assignedCall.description}</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-800">
                             <p className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">Update Status: <span className="text-blue-500">{assignedCall.status}</span></p>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* FIX: Updated onClick to call onUpdateCallStatus with required parameters (callId, status, teamId). */}
                                <button onClick={() => onUpdateCallStatus(assignedCall.id, CallStatus.ON_SCENE, myTeam.id)} disabled={assignedCall.status !== CallStatus.DISPATCHED} className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition">On Scene</button>
                                <button onClick={() => onUpdateCallStatus(assignedCall.id, CallStatus.TRANSPORTING, myTeam.id)} disabled={assignedCall.status !== CallStatus.ON_SCENE} className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition">Transporting</button>
                                <button onClick={() => onUpdateCallStatus(assignedCall.id, CallStatus.COMPLETED, myTeam.id)} disabled={assignedCall.status !== CallStatus.ON_SCENE && assignedCall.status !== CallStatus.TRANSPORTING} className="p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition">Complete Call</button>
                                {assignedCall.pcrId ? (
                                     <div className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-center font-semibold rounded-lg">PCR Filed</div>
                                ) : (
                                    <button onClick={() => onFilePCR(assignedCall)} disabled={assignedCall.status !== CallStatus.COMPLETED} className="p-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
                                        <FileTextIcon className="h-5 w-5"/> File PCR
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl h-full flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No active assignment</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                           Your team is available for dispatch.
                        </p>
                    </div>
                )}
            </div>

             {/* Shift Summary */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2"><ChartBarIcon/> Shift Summary</h2>
                <ShiftSummaryCharts completedCalls={completedCallsToday} isDarkMode={isDarkMode}/>
            </div>
        </div>
    </div>
  );
};

// Dummy ShiftSummaryCharts component
const ShiftSummaryCharts: React.FC<{completedCalls: EmergencyCall[], isDarkMode: boolean}> = ({completedCalls, isDarkMode}) => {
    const chartRef = React.useRef<HTMLCanvasElement>(null);
    const chartInstance = React.useRef<any>(null);

    React.useEffect(() => {
        if (!chartRef.current) return;
        
        const priorityCounts = completedCalls.reduce((acc, call) => {
            acc[call.priority-1] = (acc[call.priority-1] || 0) + 1;
            return acc;
        }, [] as number[]);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        
        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Priority 1', 'Priority 2', 'Priority 3', 'Priority 4'],
                datasets: [{
                    label: 'Calls by Priority',
                    data: priorityCounts,
                    backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
                    borderColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderWidth: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDarkMode ? '#D1D5DB' : '#4B5563',
                            boxWidth: 12,
                            padding: 20,
                        }
                    },
                    title: {
                        display: true,
                        text: 'Completed Calls by Priority',
                        color: isDarkMode ? '#F9FAFB' : '#1F2937',
                        font: { size: 16 }
                    }
                },
                cutout: '60%'
            }
        });

    }, [completedCalls, isDarkMode]);

    return (
        <div className="h-64 relative">
             {completedCalls.length > 0 ? (
                <canvas ref={chartRef}></canvas>
             ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                    <p>No completed calls in this shift yet.</p>
                </div>
             )}
        </div>
    );
};


export default EmtDashboard;