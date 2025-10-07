
import React from 'react';
import { AuditLogEntry } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface AdminDashboardProps {
    logs: AuditLogEntry[];
    onBackup: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ logs, onBackup }) => {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
                <button 
                    onClick={onBackup}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                    <ShieldCheckIcon /> Perform System Backup
                </button>
            </header>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">System Audit Log</h2>
                <div className="overflow-y-auto h-[65vh]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Timestamp</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">User</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Action</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.timestamp.toLocaleString()}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{log.user}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{log.action}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.details || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {logs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">No audit events recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
