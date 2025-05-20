<script lang="ts">
  import DeliveryStatus from "$lib/user/delivery-status.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount } from "svelte";

  interface DashboardStats {
    totalMessages: number;
    activeMessages: number;
    sent: number;
    scheduled: number;
    failed: number;
  }

  interface MessageStat {
    status: string;
    count: number;
    percentage: number;
  }

  interface Message {
    id: number;
    message_text: string;
    phone_number?: string;
    status?: string;
    created_at: string;
    group_id?: number;
  }

  interface ScheduledMessage {
    id: number;
    message_text: string;
    scheduled_time: string;
    recipient_type: 'single' | 'group';
    recipient_id: string | number;
    status?: string;
  }

  interface ApiResponse<T> {
    success: boolean;
    messages?: T[];
    message?: string;
    stats?: MessageStat[];
    error?: string;
    data?: T[] | T;
  }

  // Dashboard statistics
  let stats: DashboardStats = {
    totalMessages: 0,
    activeMessages: 0,
    sent: 0,
    scheduled: 0,
    failed: 0
  };

  // Recent messages for the dashboard
  let recentMessages: Message[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    await fetchDashboardData();
  });

  // Helper function to get display status text
  function getDisplayStatus(status: string | undefined): string {
    if (!status) return 'Unknown';
    return status.toLowerCase() === 'submitted' ? 'sent' : status;
  }

  async function fetchDashboardData(): Promise<void> {
    try {
      loading = true;
      
      // Get message delivery stats
      console.log('Fetching delivery stats...');
      const deliveryStats: ApiResponse<never> = await api.messages.analytics.getDeliveryStats();
      console.log('Delivery stats response:', deliveryStats);
      
      if (deliveryStats.success && deliveryStats.stats) {
        // Process stats
        const statsData: MessageStat[] = deliveryStats.stats;
        console.log('Stats data:', statsData);
        
        // Reset counters
        stats.sent = 0;
        stats.failed = 0;
        
        // Update stats from the response
        statsData.forEach((stat: MessageStat) => {
          const status = stat.status.toLowerCase();
          if (status === 'sent' || status === 'delivered' || status === 'submitted') {
            stats.sent += stat.count;
          } else if (status === 'failed') {
            stats.failed += stat.count;
          }
        });
        
        // Total of all messages from delivery stats
        stats.totalMessages = statsData.reduce((total: number, stat: MessageStat) => total + stat.count, 0);
        console.log('Calculated stats from delivery stats:', { ...stats });
      }
      
      // Get scheduled messages and categorize by status
      console.log('Fetching scheduled messages...');
      try {
        const scheduledMessages: ApiResponse<ScheduledMessage> = await api.schedule.getAll();
        console.log('Scheduled messages response:', scheduledMessages);
        
        let scheduledMessagesList: ScheduledMessage[] = [];
        
        if (scheduledMessages.success) {
          if (scheduledMessages.messages) {
            scheduledMessagesList = scheduledMessages.messages;
          } else if (scheduledMessages.data && Array.isArray(scheduledMessages.data)) {
            scheduledMessagesList = scheduledMessages.data;
          }
          
          // Count only pending/future scheduled messages
          let pendingScheduledCount = 0;
          let sentScheduledCount = 0;
          let failedScheduledCount = 0;
          
          scheduledMessagesList.forEach(message => {
            const status = message.status?.toLowerCase() || 'scheduled';
            
            if (status === 'scheduled' || status === 'pending') {
              // Count only truly scheduled (not yet sent) messages
              pendingScheduledCount++;
            } else if (status === 'sent' || status === 'delivered' || status === 'submitted') {
              // Count sent scheduled messages
              sentScheduledCount++;
            } else if (status === 'failed') {
              // Count failed scheduled messages
              failedScheduledCount++;
            }
          });
          
          console.log('Scheduled message counts:', { 
            pending: pendingScheduledCount, 
            sent: sentScheduledCount, 
            failed: failedScheduledCount 
          });
          
          // Update scheduled count to only include pending messages
          stats.scheduled = pendingScheduledCount;
          
          // Add sent scheduled messages to the total sent count
          stats.sent += sentScheduledCount;
          
          // Add failed scheduled messages to the total failed count
          stats.failed += failedScheduledCount;
          
          // Update total message count to include all scheduled messages
          stats.totalMessages += scheduledMessagesList.length;
        } else {
          console.error('Failed to get scheduled messages:', scheduledMessages.error || 'Unknown error');
          // Continue with dashboard loading instead of failing completely
        }
      } catch (scheduleErr) {
        console.error('Error fetching scheduled messages:', scheduleErr);
        // Don't let this error stop the dashboard from loading
      }
      
      // Recalculate active messages (all messages minus failed ones)
      stats.activeMessages = stats.totalMessages - stats.failed;
      
      // Get recent messages for the dashboard
      console.log('Fetching recent messages...');
      const messagesResponse: ApiResponse<Message> = await api.messages.getAll();
      console.log('Messages response:', messagesResponse);
      if (messagesResponse.success) {
        let messagesList: Message[] = [];
        
        if (messagesResponse.messages) {
          messagesList = messagesResponse.messages;
        } else if (messagesResponse.data) {
          messagesList = Array.isArray(messagesResponse.data) 
            ? messagesResponse.data 
            : [messagesResponse.data as Message];
        }
        
        if (messagesList.length > 0) {
          // Sort by date and take the 5 most recent
          recentMessages = messagesList
            .sort((a: Message, b: Message) => {
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return dateB - dateA;
            })
            .slice(0, 5);
          console.log('Recent messages:', recentMessages);
        }
      }
      
      // Log the final stats
      console.log('Final dashboard stats:', { ...stats });
      
      loading = false;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      // Provide more specific error message if available
      if (err instanceof Error) {
        error = `Error: ${err.message}`;
      } else if (typeof err === 'object' && err !== null && 'error' in err) {
        error = `API Error: ${(err as any).error}`;
      } else {
        error = 'Failed to load dashboard data. Please try again later.';
      }
      
      loading = false;
    }
  }
</script>

<div class="w-full">
  <div class="p-6 flex flex-col justify-between gap-6">
    <!-- path -->
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#443C68" viewBox="0 0 256 256">
        <path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128L90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#B8BCBC]">General</h1>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128L90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#443C68] font-medium">Dashboard</h1>
    </div>

    <!-- headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Dashboard</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Quickly view system stats, track messaging activity, and manage your Swift account.
      </h1>
    </div>
  </div>

  <!-- Loading and error states -->
  {#if loading}
    <div class="p-6 text-center">
      <p class="text-[#818181]">Loading dashboard data...</p>
    </div>
  {:else if error}
    <div class="p-6">
      <div class="p-4 bg-[#FFE2DD]/50 text-[#E16F64] rounded-lg">
        {error}
      </div>
    </div>
  {:else}
    <div class="p-6">
      <!-- overview -->
      <div class="flex gap-4">
        <!-- total messages -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <h1 class="text-sm text-[#818181]">Total Messages</h1>
            <h1 class="text-5xl font-bold text-right text-[#443C68]">{stats.totalMessages.toString().padStart(2, '0')}</h1>
          </div>
        </div>
        <!-- active messages -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <h1 class="text-sm text-[#818181]">Active Messages</h1>
            <h1 class="text-5xl font-bold text-right text-[#443C68]">{stats.activeMessages.toString().padStart(2, '0')}</h1>
          </div>
        </div>
        <!-- sent -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full bg-[#6C9B7D]"></div>
              <h1 class="text-sm text-[#818181]">Sent</h1>
            </div>
            <h1 class="text-5xl font-bold text-right text-[#443C68]">{stats.sent.toString().padStart(2, '0')}</h1>
          </div>
        </div>
        <!-- scheduled -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full bg-[#D7813A]"></div>
              <h1 class="text-sm text-[#818181]">Scheduled</h1>
            </div>
            <h1 class="text-5xl font-bold text-right text-[#443C68]">{stats.scheduled.toString().padStart(2, '0')}</h1>
          </div>
        </div>
        <!-- failed -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-2.5 rounded-full bg-[#E16F64]"></div>
              <h1 class="text-sm text-[#818181]">Failed</h1>
            </div>
            <h1 class="text-5xl font-bold text-right text-[#443C68]">{stats.failed.toString().padStart(2, '0')}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent messages -->
    <div class="p-6 w-full">
      <!-- headline -->
      <div class="flex justify-between items-center mb-4">      
        <h1 class="text-2xl font-medium text-[#443C68]">
        Recent Messages
        </h1>
        <a href="/user/messages" class="p-3 text-xs text-[#443C68] font-medium px-6 border border-[#EBEBE8] hover:bg-[#eeeeee]/50 transition-all duration-200 rounded-lg">
            View All
        </a>
      </div>
      <!-- table head -->
      <div class="w-full flex justify-between bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <p class="text-sm text-[#818181] font-medium pl-2 w-[25%]">Recipients</p>
        <p class="text-sm text-[#818181] font-medium w-[40%]">Message</p>
        <p class="text-sm text-[#818181] font-medium w-[20%] pl-10">Date</p>
        <p class="text-sm text-[#818181] font-medium w-[15%]">Status</p>
      </div>
      <!-- message list component -->
      <DeliveryStatus messages={recentMessages} />
      
    </div>
  {/if}
</div>