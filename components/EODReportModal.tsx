
import React, { useMemo } from 'react';
import { EmergencyCall } from '../types';
import { ReportIcon } from './icons/ReportIcon';

interface EODReportModalProps {
    calls: EmergencyCall[];
    onClose: () => void;
}

const EODReportModal: React.FC<EODReportModalProps> = ({ calls, onClose }) => {
    
    const reportStats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysCalls = calls.filter(c => c.timestamp >= today);
        const dispatchedToday = todaysCalls.filter(c => c.dispatchTimestamp);

        const priorityCounts = todaysCalls.reduce((acc, call) => {
            acc[call.priority] = (acc[call.priority] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        let totalDispatchSec = 0;
        dispatchedToday.forEach(call => {
            totalDispatchSec += (call.dispatchTimestamp!.getTime() - call.timestamp.getTime()) / 1000;
        });

        const avgDispatchMin = dispatchedToday.length > 0 ? (totalDispatchSec / dispatchedToday.length / 60).toFixed(1) : '0.0';

        return {
            totalCalls: todaysCalls.length,
            priorityCounts,
            avgDispatchMin,
        };
    }, [calls]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center gap-3 mb-4 border-b dark:border-gray-700 pb-3">
                    <ReportIcon className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">End of Day Report</h3>
                </div>
                
                <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                        <span className="font-semibold">Total Calls Today:</span>
                        <span className="text-2xl font-bold">{reportStats.totalCalls}</span>
                    </div>
                     <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                        <h4 className="font-semibold mb-2">Calls by Priority:</h4>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-xl font-bold text-red-500">{reportStats.priorityCounts[1] || 0}</p>
                                <p className="text-xs">P1</p>
                            </div>
                             <div>
                                <p className="text-xl font-bold text-yellow-500">{reportStats.priorityCounts[2] || 0}</p>
                                <p className="text-xs">P2</p>
                            </div>
                             <div>
                                <p className="text-xl font-bold text-blue-500">{reportStats.priorityCounts[3] || 0}</p>
                                <p className="text-xs">P3</p>
                            </div>
                             <div>
                                <p className="text-xl font-bold text-green-500">{reportStats.priorityCounts[4] || 0}</p>
                                <p className="text-xs">P4</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                        <span className="font-semibold">Avg. Dispatch Time:</span>
                        <span className="text-xl font-bold">{reportStats.avgDispatchMin} min</span>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">Close</button>
                </div>
            </div>
        </div>
    );
};

export default EODReportModal;
