<script lang="ts">
  interface Message {
    id: number;
    message_text: string;
    phone_number?: string;
    status?: string;
    created_at: string;
    group_id?: number;
  }
  
  export let messages: Message[] = [];
  
  // Function to format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // Function to get display status text
  function getDisplayStatus(status: string | undefined): string {
    if (!status) return 'Unknown';
    return status.toLowerCase() === 'submitted' ? 'sent' : status;
  }
  
  // Function to determine status class
  function getStatusClass(status: string | undefined): string {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'sent':
      case 'submitted':
      return 'text-[#4285F4] bg-[#E8F0FE]/50';
      case 'success':
        return 'text-[#6C9B7D] bg-[#DBEDDB]/50';
      case 'failed':
      case 'error':
        return 'text-[#E16F64] bg-[#FFE2DD]/50';
      case 'pending':
      case 'scheduled':
        return 'text-[#D7813A] bg-[#FFF4EB]/50';
      default:
        return 'text-[#818181] bg-[#F0F0F0]/50';
    }
  }
</script>

{#if messages.length === 0}
  <div class="text-center p-4 text-[#818181]">
    No recent messages found.
  </div>
{:else}
  {#each messages as message (message.id)}
    <div class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
      <!-- Recipients -->
      <div class="text-xs pl-2 justify-center bg-[#ebebe8]/50 p-3 rounded-lg w-[25%] flex items-center gap-4 text-[#443C68] font-medium">
        {message.group_id ? 'Group' : '1'} {message.phone_number ? `(${message.phone_number})` : ''}
      </div>
      
      <!-- Message text -->
      <div class="text-xs text-[#443C68] w-[40%] font-medium p-3 rounded-lg bg-[#ebebe8]/50 truncate">
        {message.message_text}
      </div>
      
      <!-- Schedule/date -->
      <p class="text-xs text-[#818181] w-[20%] pl-10">
        {formatDate(message.created_at)}
      </p>
      
      <!-- Status -->
      <div class="text-xs font-medium w-[15%] p-3 text-center rounded-lg {getStatusClass(message.status)}">
        {getDisplayStatus(message.status)}
      </div>
    </div>
  {/each}
{/if}
  
  