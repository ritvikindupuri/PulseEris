
import React from 'react';
import { EmergencyCall, Team } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { AlertIcon } from './icons/AlertIcon';

interface ExceptionReportModalProps {
    openIncidents: EmergencyCall[];
    teams: Team[];
    onClose: () => void;
    onExport: () => void;
}

const ExceptionReportModal: React.FC<ExceptionReportModalProps> = ({ openIncidents, teams, onClose, onExport }) => {
    
    const calculateAge = (timestamp: Date): string => {
        const diffMs = new Date().getTime() - timestamp.getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = (diffMins / 60).toFixed(1);
        return `${diffHours}h`;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-4 border-b dark:border-gray-700 pb-3">
                    <AlertIcon className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Shift Handover: Exception Report</h3>
                </div>
                
                <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
                    {openIncidents.length > 0 ? openIncidents.map(call => (
                         <div key={call.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{call.location} <span className="text-xs font-normal text-gray-500">(P{call.priority})</span></p>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Age: {calculateAge(call.timestamp)}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>Status: <span className="font-semibold">{call.status}</span></span>
                                <span className="mx-2">|</span>
                                <span>Team: <span className="font-semibold">{teams.find(t => t.id === call.assignedTeamId)?.name || 'Unassigned'}</span></span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No open incidents to report.</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold rounded-md transition">Close</button>
                    <button onClick={onExport} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition flex items-center gap-2">
                        <DownloadIcon /> Export as CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExceptionReportModal;
