
import React, { useMemo, useState } from 'react';
import { EmergencyCall, CallStatus, User, UserRole, Team, TeamGrade, TeamStatus, BaseStation, Schedule } from '../types';
import { ReportIcon } from './icons/ReportIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import SchedulingTool from './SchedulingTool';
import ExceptionReportModal from './ExceptionReportModal';

interface SupervisorDashboardProps {
  calls: EmergencyCall[];
  users: User[];
  teams: Team[];
  schedule: Schedule;
  onUpdateTeam: (team: Team) => void;
  onUpdateSchedule: (schedule: Schedule) => void;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ calls, users, teams, schedule, onUpdateTeam, onUpdateSchedule }) => {
  const [gradeFilter, setGradeFilter] = useState<TeamGrade | 'all'>('all');
  const [baseStationFilter, setBaseStationFilter] = useState<BaseStation | 'all'>('all');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showExceptionReport, setShowExceptionReport] = useState(false);

  const stats = useMemo(() => ({
    totalCalls: calls.length,
    openIncidents: calls.filter(c => c.status !== CallStatus.COMPLETED && c.status !== CallStatus.CANCELLED).length,
    pcrFiled: calls.filter(c => c.pcrId).length,
    totalPersonnel: users.filter(u => u.role === UserRole.EMT).length,
    teamsOnDuty: teams.length,
  }), [calls, users, teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter(team => 
      (gradeFilter === 'all' || team.grade === gradeFilter) &&
      (baseStationFilter === 'all' || team.baseStation === baseStationFilter)
    );
  }, [teams, gradeFilter, baseStationFilter]);

  const openIncidents = useMemo(() => {
    return calls.filter(c => c.status !== CallStatus.COMPLETED && c.status !== CallStatus.CANCELLED);
  }, [calls]);

  const handleExport = () => {
    const headers = "ID,Timestamp,Location,Priority,Status,AssignedTeam\n";
    const csvData = openIncidents.map(call => 
        [
            call.id,
            call.timestamp.toISOString(),
            `"${call.location.replace(/"/g, '""')}"`,
            call.priority,
            call.status,
            teams.find(t => t.id === call.assignedTeamId)?.name || 'Unassigned'
        ].join(',')
    ).join('\n');
    
    const blob = new Blob([headers + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pulsepoint_open_incidents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleEditTeam = (team: Team) => {
    setEditingTeam({ ...team });
  };
  
  const handleSaveTeam = () => {
    if (editingTeam) {
        onUpdateTeam(editingTeam);
        setEditingTeam(null);
    }
  };
  
  const handleMemberChange = (userId: number, isChecked: boolean) => {
    if (!editingTeam) return;
    let newMembers;
    if (isChecked) {
        const userToAdd = users.find(u => u.id === userId);
        if (userToAdd) {
            newMembers = [...editingTeam.members, userToAdd];
        } else {
            newMembers = editingTeam.members;
        }
    } else {
        newMembers = editingTeam.members.filter(m => m.id !== userId);
    }
    setEditingTeam({ ...editingTeam, members: newMembers });
  };
  
  const handleSaveSchedule = (updatedSchedule: Schedule) => {
    onUpdateSchedule(updatedSchedule);
    setShowScheduler(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Supervisor Dashboard</h1>
         <button onClick={() => setShowScheduler(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
            <CalendarIcon /> Manage Schedule
        </button>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Calls" value={stats.totalCalls} />
          <StatCard title="Open Incidents" value={stats.openIncidents} />
          <StatCard title="PCRs Filed" value={stats.pcrFiled} />
          <StatCard title="Total Personnel" value={stats.totalPersonnel} />
          <StatCard title="Teams on Duty" value={stats.teamsOnDuty} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Management */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"><UsersIcon/> Team Roster & Status</h2>
                <div className="flex gap-2">
                    <select onChange={(e) => setBaseStationFilter(e.target.value as BaseStation | 'all')} value={baseStationFilter} className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md py-1">
                        <option value="all">All Stations</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                    <select onChange={(e) => setGradeFilter(e.target.value as TeamGrade | 'all')} value={gradeFilter} className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md py-1">
                        <option value="all">All Grades</option>
                        <option value={TeamGrade.ALS}>ALS</option>
                        <option value={TeamGrade.BLS}>BLS</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Team</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Members</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">Status</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTeams.map(team => (
                        <tr key={team.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{team.name} ({team.grade} / {team.baseStation})</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{team.members.map(m => m.username).join(', ')}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${team.status === TeamStatus.AVAILABLE ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>{team.status}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                <button onClick={() => handleEditTeam(team)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        {/* Shift Handover */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"><ReportIcon/> Shift Handover</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Generate report for open incidents.</p>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-md">
                <p className="font-bold text-gray-800 dark:text-gray-100">{openIncidents.length} Open Incidents</p>
                <ul className="text-xs text-gray-600 dark:text-gray-300 mt-2 list-disc list-inside">
                    {openIncidents.slice(0, 3).map(c => <li key={c.id}>{c.location} - P{c.priority}</li>)}
                    {openIncidents.length > 3 && <li>...and {openIncidents.length - 3} more.</li>}
                </ul>
            </div>
            <button onClick={() => setShowExceptionReport(true)} className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                <DownloadIcon/> Generate Exception Report
            </button>
        </div>
      </div>
      
      {/* Edit Team Modal */}
      {editingTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Team: {editingTeam.name}</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Name</label>
                          <input type="text" value={editingTeam.name} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Grade</label>
                          <select value={editingTeam.grade} onChange={e => setEditingTeam({...editingTeam, grade: e.target.value as TeamGrade})} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                              <option value={TeamGrade.ALS}>ALS</option>
                              <option value={TeamGrade.BLS}>BLS</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Members</label>
                          <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                            {users.filter(u => u.role === UserRole.EMT && (u.teamId === undefined || u.teamId === editingTeam.id)).map(user => (
                                <label key={user.id} className="flex items-center space-x-2 text-sm">
                                    <input type="checkbox" checked={editingTeam.members.some(m => m.id === user.id)} onChange={e => handleMemberChange(user.id, e.target.checked)} />
                                    <span>{user.username}</span>
                                </label>
                            ))}
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setEditingTeam(null)} className="py-2 px-4 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                      <button onClick={handleSaveTeam} className="py-2 px-4 bg-blue-600 text-white rounded-md">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
        
      {showScheduler && <SchedulingTool schedule={schedule} teams={teams} onSave={handleSaveSchedule} onCancel={() => setShowScheduler(false)} />}
      {showExceptionReport && <ExceptionReportModal openIncidents={openIncidents} teams={teams} onClose={() => setShowExceptionReport(false)} onExport={handleExport} />}
    </div>
  );
};

const StatCard: React.FC<{title: string; value: string | number}> = ({title, value}) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
);

export default SupervisorDashboard;
