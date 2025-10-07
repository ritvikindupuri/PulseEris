
import React, { useState } from 'react';
import { Schedule, Team, Day, DaySchedule } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';

interface SchedulingToolProps {
    schedule: Schedule;
    teams: Team[];
    onSave: (updatedSchedule: Schedule) => void;
    onCancel: () => void;
}

const SchedulingTool: React.FC<SchedulingToolProps> = ({ schedule, teams, onSave, onCancel }) => {
    const [localSchedule, setLocalSchedule] = useState<Schedule>(JSON.parse(JSON.stringify(schedule)));

    const handleShiftChange = (day: Day, shiftType: 'dayShift' | 'nightShift', teamId: string | null) => {
        const newSchedule = localSchedule.map(d => {
            if (d.day === day) {
                return {
                    ...d,
                    shifts: {
                        ...d.shifts,
                        [shiftType]: { teamId: teamId ? parseInt(teamId) : null }
                    }
                };
            }
            return d;
        });
        setLocalSchedule(newSchedule);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-5xl">
                <div className="flex items-center gap-3 mb-4">
                    <CalendarIcon className="h-6 w-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Weekly Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700/50">
                                <th className="p-2 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300">Shift</th>
                                {localSchedule.map(({ day }) => (
                                    <th key={day} className="p-2 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {['dayShift', 'nightShift'].map(shiftType => (
                                <tr key={shiftType} className="text-center">
                                    <td className="p-2 border border-gray-200 dark:border-gray-600 font-semibold text-sm capitalize text-gray-700 dark:text-gray-200">{shiftType.replace('Shift', ' Shift')}</td>
                                    {localSchedule.map(({ day, shifts }) => (
                                        <td key={`${day}-${shiftType}`} className="p-1 border border-gray-200 dark:border-gray-600">
                                            <select 
                                                value={shifts[shiftType as 'dayShift' | 'nightShift'].teamId || ''}
                                                onChange={(e) => handleShiftChange(day, shiftType as 'dayShift' | 'nightShift', e.target.value)}
                                                className="w-full p-1.5 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md text-xs focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Unassigned</option>
                                                {teams.map(team => (
                                                    <option key={team.id} value={team.id}>{team.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onCancel} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold rounded-md transition">Cancel</button>
                    <button onClick={() => onSave(localSchedule)} className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md transition">Save Schedule</button>
                </div>
            </div>
        </div>
    );
};

export default SchedulingTool;
