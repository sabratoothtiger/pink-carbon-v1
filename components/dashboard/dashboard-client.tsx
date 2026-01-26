'use client';

import { useState } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';

interface DashboardData {
  totalItems: number;
  activeItems: number;
  completedItems: number;
  averageProcessingTime: number;
  statusDistribution: Array<{ statusName: string; count: number; color: string }>;
  dailyVolume: Array<{ date: string; received: number; completed: number }>;
  yearlyVolume: Array<{ year: number; count: number }>;
  recentActivity: Array<{
    id: string;
    identifier: string;
    action: string;
    timestamp: Date;
  }>;
  queueMetrics: {
    totalInQueue: number;
    oldestItem: number; // days
    receivedPercentage: number; // percentage of active items that are received
  };
}

interface DashboardClientProps {
  initialData: DashboardData;
  allYears: number[];
  accountId: string;
}

export default function DashboardClient({ initialData, allYears, accountId }: DashboardClientProps) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const yearOptions = [
    { label: 'All Years', value: undefined },
    ...allYears.map(year => ({ label: year.toString(), value: year }))
  ];

  const handleYearChange = async (value: number | undefined) => {
    setSelectedYear(value);
    setLoading(true);
    try {
      // Make API call to filter data by year
      const response = await fetch(`/api/dashboard/${accountId}?year=${value || ''}`);
      if (response.ok) {
        const filteredData = await response.json();
        setData(filteredData);
      }
    } catch (error) {
      console.error('Error filtering data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const pieChartData = {
    labels: data.statusDistribution.map(s => s.statusName),
    datasets: [{
      data: data.statusDistribution.map(s => s.count),
      backgroundColor: data.statusDistribution.map(s => s.color),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const lineChartData = {
    labels: data.dailyVolume.map(d => d.date),
    datasets: [
      {
        label: 'Received',
        data: data.dailyVolume.map(d => d.received),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Completed',
        data: data.dailyVolume.map(d => d.completed),
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const barChartData = {
    labels: data.yearlyVolume.map(y => y.year.toString()),
    datasets: [{
      label: 'Items by Return Year',
      data: data.yearlyVolume.map(y => y.count),
      backgroundColor: '#96CEB4',
      borderColor: '#7BA97A',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: 'normal' as const
          },
          padding: 20
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: 'normal' as const
          },
          padding: 20
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
            weight: 'normal' as const
          },
          padding: 20
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          align: 'center' as const
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filter Controls */}
      <div className="mb-6">
        <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="flex items-center gap-4 p-4">
            <label htmlFor="year-filter" className="font-medium text-primary">
              Filter by Return Year:
            </label>
            <Dropdown
              id="year-filter"
              value={selectedYear}
              options={yearOptions}
              onChange={(e) => handleYearChange(e.value)}
              placeholder="Select Year"
              className="w-48"
              disabled={loading}
            />
            {loading && (
              <div className="text-sm text-text-secondary">Loading...</div>
            )}
          </div>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="text-3xl font-bold text-primary mb-2">{data.totalItems}</div>
          <div className="text-sm text-text-secondary">Total Items</div>
        </Card>
        
        <Card className="text-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="text-3xl font-bold text-blue-500 mb-2">{data.activeItems}</div>
          <div className="text-sm text-text-secondary">Active Items</div>
        </Card>
        
        <Card className="text-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="text-3xl font-bold text-green-500 mb-2">{data.completedItems}</div>
          <div className="text-sm text-text-secondary">Completed Items</div>
        </Card>
        
        <Card className="text-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="text-3xl font-bold text-orange-500 mb-2">{data.averageProcessingTime}</div>
          <div className="text-sm text-text-secondary">Avg. Processing Days</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="card-header mb-4">
            <h3 className="text-xl font-semibold text-primary">Status Distribution</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Chart type="pie" data={pieChartData} options={pieChartOptions} />
          </div>
        </Card>

        {/* Daily Volume Trend */}
        <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="card-header mb-4">
            <h3 className="text-xl font-semibold text-primary">Daily Volume (Last 30 Days)</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Chart type="line" data={lineChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Return Year Distribution */}
        <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="card-header mb-4">
            <h3 className="text-xl font-semibold text-primary">Volume by Return Year</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Chart type="bar" data={barChartData} options={barChartOptions} />
          </div>
        </Card>

        {/* Queue Metrics */}
        <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
          <div className="card-header mb-4">
            <h3 className="text-xl font-semibold text-primary">Queue Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="font-medium">Items in Queue</span>
              <Badge value={data.queueMetrics.totalInQueue} severity="info" size="large" />
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="font-medium">Oldest Item (Days)</span>
              <Badge value={data.queueMetrics.oldestItem} severity="danger" size="large" />
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="font-medium">Received Items (%)</span>
              <Badge value={`${data.queueMetrics.receivedPercentage}%`} severity="success" size="large" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/20 shadow-lg">
        <div className="card-header mb-4">
          <h3 className="text-xl font-semibold text-primary">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="flex justify-between items-center p-3 bg-white/5 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div>
                <div className="font-medium text-primary">{activity.identifier}</div>
                <div className="text-sm text-text-secondary">{activity.action}</div>
              </div>
              <div className="text-sm text-text-secondary">
                {format(activity.timestamp, 'MMM dd, yyyy HH:mm')} {
                  activity.timestamp.toLocaleString('en-US', { 
                    timeZoneName: 'short' 
                  }).split(' ').pop()
                }
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}