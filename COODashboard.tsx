import React, { useMemo, useEffect, useRef } from 'react';
import { EmergencyCall, CallStatus } from './types';
import { ClockIcon } from './components/icons/ClockIcon';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';

interface COODashboardProps {
  calls: EmergencyCall[];
  isDarkMode: boolean;
}

const SLAMinutes = 15; // Target response time in minutes

const COODashboard: React.FC<COODashboardProps> = ({ calls, isDarkMode }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    const completedCalls = useMemo(() => {
        return calls.filter(c => 
            c.status === CallStatus.COMPLETED &&
            c.dispatchTimestamp &&
            c.onSceneTimestamp &&
            c.completedTimestamp
        );
    }, [calls]);

    const slaStats = useMemo(() => {
        if (completedCalls.length === 0) {
            return {
                avgDispatchMin: '0.0',
                avgOnSceneMin: '0.0',
                avgTotalResponseMin: '0.0',
                slaCompliance: '0.0',
                totalCompleted: 0,
            };
        }

        let totalDispatchSec = 0;
        let totalOnSceneSec = 0;
        let totalResponseSec = 0;
        let compliantCount = 0;

        completedCalls.forEach(call => {
            const dispatchTime = (call.dispatchTimestamp!.getTime() - call.timestamp.getTime()) / 1000;
            const onSceneTime = (call.onSceneTimestamp!.getTime() - call.dispatchTimestamp!.getTime()) / 1000;
            const totalTime = (call.onSceneTimestamp!.getTime() - call.timestamp.getTime()) / 1000;
            
            totalDispatchSec += dispatchTime;
            totalOnSceneSec += onSceneTime;
            totalResponseSec += totalTime;

            if (totalTime / 60 <= SLAMinutes) {
                compliantCount++;
            }
        });
        
        const total = completedCalls.length;
        return {
            avgDispatchMin: (totalDispatchSec / total / 60).toFixed(1),
            avgOnSceneMin: (totalOnSceneSec / total / 60).toFixed(1),
            avgTotalResponseMin: (totalResponseSec / total / 60).toFixed(1),
            slaCompliance: (compliantCount / total * 100).toFixed(1),
            totalCompleted: total,
        };
    }, [completedCalls]);

    useEffect(() => {
        if (!chartRef.current) return;
        
        const nonCompliantCount = completedCalls.length - (parseFloat(slaStats.slaCompliance) / 100 * completedCalls.length);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        
        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['SLA Performance'],
                datasets: [
                    {
                        label: `Met SLA (< ${SLAMinutes} min)`,
                        data: [parseFloat(slaStats.slaCompliance)],
                        backgroundColor: '#10B981',
                        borderRadius: 4,
                    },
                    {
                        label: 'Missed SLA',
                        data: [100 - parseFloat(slaStats.slaCompliance)],
                        backgroundColor: '#EF4444',
                        borderRadius: 4,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        max: 100,
                        ticks: {
                            color: isDarkMode ? '#9CA3AF' : '#6B7280',
                            callback: (value) => `${value}%`
                        },
                        grid: {
                            color: isDarkMode ? '#374151' : '#E5E7EB',
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: { color: isDarkMode ? '#9CA3AF' : '#6B7280' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDarkMode ? '#D1D5DB' : '#4B5563',
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
                        }
                    }
                }
            }
        });

    }, [slaStats, isDarkMode, completedCalls.length]);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">COO Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Service Level Agreement (SLA) Performance Overview</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<ClockIcon />} title="Avg. Dispatch Time" value={`${slaStats.avgDispatchMin} min`} />
                <StatCard icon={<ClockIcon />} title="Avg. On-Scene Time" value={`${slaStats.avgOnSceneMin} min`} />
                <StatCard icon={<ClockIcon />} title="Avg. Total Response" value={`${slaStats.avgTotalResponseMin} min`} />
                <StatCard icon={<CheckCircleIcon />} title="SLA Compliance" value={`${slaStats.slaCompliance}%`} />
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Response Time SLA Compliance ({SLAMinutes} min target)</h2>
                <div className="h-40 relative">
                     {completedCalls.length > 0 ? (
                        <canvas ref={chartRef}></canvas>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                            <p>No completed calls with full timestamps available for analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{icon: React.ReactNode; title: string; value: string | number}> = ({icon, title, value}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-500">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

export default COODashboard;