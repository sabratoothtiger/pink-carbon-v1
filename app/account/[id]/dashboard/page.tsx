import { createClient } from "@/lib/supabase/server";
import AuthenticatedShell from "@/components/navigation_shell/authenticated-shell";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { format, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';

interface DashboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface WorkqueueItemWithStatus {
  id: string;
  identifier: string | null;
  status_id: number;
  statuses: {
    name_internal: string;
  } | null;
  received_at: string;
  last_updated_at: string;
  position: number | null;
  return_year: number;
}

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
    averagePosition: number;
    oldestItem: number; // days
    receivedPercentage: number; // percentage of active items that are received
  };
}

async function getDashboardData(accountId: string, selectedYear?: number): Promise<DashboardData> {
  const supabase = await createClient();
  
  // Get all workqueue items for this account
  let query = supabase
    .from('workqueue')
    .select(`
      id,
      identifier,
      status_id,
      statuses ( name_internal ),
      received_at,
      last_updated_at,
      position,
      return_year
    `)
    .eq('account_id', accountId);

  // Apply year filter if provided
  if (selectedYear) {
    query = query.eq('return_year', selectedYear);
  }

  const { data: workqueueItems, error: workqueueError } = await query as { data: WorkqueueItemWithStatus[] | null; error: any };

  
  // Log the first item to see the structure
  if (workqueueItems && workqueueItems.length > 0) {
  }

  if (workqueueError) {
    throw new Error(`Failed to fetch workqueue data: ${workqueueError.message}`);
  }
  
  if (!workqueueItems) {
    // Return empty dashboard data instead of throwing error
    return {
      totalItems: 0,
      activeItems: 0,
      completedItems: 0,
      averageProcessingTime: 0,
      statusDistribution: [],
      dailyVolume: [],
      yearlyVolume: [],
      recentActivity: [],
      queueMetrics: {
        totalInQueue: 0,
        averagePosition: 0,
        oldestItem: 0,
        receivedPercentage: 0
      }
    };
  }

  // Calculate basic metrics
  const totalItems = workqueueItems.length;
  const completedItems = workqueueItems.filter(item => 
    item.statuses?.name_internal?.toLowerCase() === 'completed'
  ).length;
  const activeItems = totalItems - completedItems;

  // Calculate average processing time
  const completedItemsWithDates = workqueueItems.filter(item => 
    item.statuses?.name_internal?.toLowerCase() === 'completed' && 
    item.received_at && 
    item.last_updated_at
  );
  
  const avgProcessingTime = completedItemsWithDates.length > 0
    ? completedItemsWithDates.reduce((sum, item) => {
        const start = new Date(item.received_at);
        const end = new Date(item.last_updated_at);
        return sum + (end.getTime() - start.getTime());
      }, 0) / completedItemsWithDates.length / (1000 * 60 * 60 * 24) // Convert to days
    : 0;

  // Status distribution
  const statusCounts = new Map();
  workqueueItems.forEach(item => {
    const statusName = item.statuses?.name_internal || 'Unknown';
    statusCounts.set(statusName, (statusCounts.get(statusName) || 0) + 1);
  });

  const statusColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  const statusDistribution = Array.from(statusCounts.entries()).map(([status, count], index) => ({
    statusName: status,
    count,
    color: statusColors[index % statusColors.length]
  }));

  // Daily volume for last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, 'MM/dd'),
      received: 0,
      completed: 0
    };
  }).reverse();

  workqueueItems.forEach(item => {
    const receivedDate = new Date(item.received_at);
    const updatedDate = new Date(item.last_updated_at);
    const isCompleted = item.statuses?.name_internal?.toLowerCase() === 'completed';
    
    last30Days.forEach(day => {
      const dayDate = new Date(day.date + '/2024');
      if (format(receivedDate, 'MM/dd') === day.date) {
        day.received++;
      }
      if (isCompleted && format(updatedDate, 'MM/dd') === day.date) {
        day.completed++;
      }
    });
  });

  // Yearly volume
  const yearCounts = new Map();
  workqueueItems.forEach(item => {
    const year = item.return_year;
    yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
  });
  
  const yearlyVolume = Array.from(yearCounts.entries()).map(([year, count]) => ({
    year,
    count
  })).sort((a, b) => a.year - b.year);

  // Recent activity (last 10 items updated)
  const recentActivity = workqueueItems
    .sort((a, b) => new Date(b.last_updated_at).getTime() - new Date(a.last_updated_at).getTime())
    .slice(0, 10)
    .map(item => ({
      id: item.id,
      identifier: item.identifier || 'Unknown',
      action: `Updated to ${item.statuses?.name_internal || 'Unknown'}`,
      timestamp: new Date(item.last_updated_at)
    }));

  // Queue metrics
  const itemsInQueue = workqueueItems.filter(item => item.position !== null);
  const totalInQueue = itemsInQueue.length;
  const averagePosition = totalInQueue > 0 
    ? itemsInQueue.reduce((sum, item) => sum + (item.position || 0), 0) / totalInQueue
    : 0;
  
  const oldestInQueue = itemsInQueue.length > 0
    ? Math.max(...itemsInQueue.map(item => {
        const days = (new Date().getTime() - new Date(item.received_at).getTime()) / (1000 * 60 * 60 * 24);
        return Math.floor(days);
      }))
    : 0;

  // Calculate percentage of received items out of active items
  const receivedItems = workqueueItems.filter(item => 
    item.statuses?.name_internal?.toLowerCase() === 'received'
  ).length;
  const receivedPercentage = activeItems > 0 ? Math.round((receivedItems / activeItems) * 100) : 0;

  return {
    totalItems,
    activeItems,
    completedItems,
    averageProcessingTime: Math.round(avgProcessingTime * 10) / 10,
    statusDistribution,
    dailyVolume: last30Days,
    yearlyVolume,
    recentActivity,
    queueMetrics: {
      totalInQueue,
      averagePosition: Math.round(averagePosition * 10) / 10,
      oldestItem: oldestInQueue,
      receivedPercentage
    }
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
   const { id: accountId } = await params;
    
    const supabase = await createClient();
  
    // Get account details for the page title
    const { data: accountData } = await supabase
      .from('accounts')
      .select('id, display_name')
      .eq('id', accountId)
      .single();

    // Get all available return years for this account
    const { data: yearData } = await supabase
      .from('workqueue')
      .select('return_year')
      .eq('account_id', accountId)
      .order('return_year', { ascending: false });
    
    const allYears = [...new Set(yearData?.map(item => item.return_year) || [])].sort((a, b) => b - a);

    // Get dashboard data
    const dashboardData = await getDashboardData(accountId);
  
    return (
      <AuthenticatedShell 
        accountId={accountId} 
        requireAccountAccess={true}
      >
        <DashboardClient
          initialData={dashboardData} 
          allYears={allYears}
          accountId={accountId}
        />
      </AuthenticatedShell>
    );
  }