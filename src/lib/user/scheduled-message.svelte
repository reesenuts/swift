<script lang="ts">
  import Modal from "$lib/general/modal.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount } from "svelte";

  interface ScheduledMessage {
    id: number;
    message_text: string;
    scheduled_time: string;
    recipient_type: 'single' | 'group';
    recipient_id: string | number;
    status?: string;
    recipient_details?: any;
  }

  interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  }

  interface Group {
    id: number;
    name: string;
  }

  let isModalOpen = false;
  let selectedMessage: ScheduledMessage | null = null;
  let scheduledMessages: ScheduledMessage[] = [];
  let contacts: Contact[] = [];
  let groups: Group[] = [];
  let loading = true;
  let error: string | null = null;

  // Make fetchScheduledMessages publicly accessible
  export async function fetchScheduledMessages() {
    loading = true;
    error = null;
    try {
      // Fetch scheduled messages
      const response = await api.schedule.getAll();
      scheduledMessages = response.messages || [];
      
      // Fetch contacts and groups for recipient info
      await fetchContacts();
      await fetchGroups();
    } catch (err: any) {
      console.error('Error fetching scheduled messages:', err);
      error = err.message || 'An error occurred';
    } finally {
      loading = false;
    }
  }

  // Fetch contacts for recipient details
  async function fetchContacts() {
    try {
      const response = await api.contacts.getAll();
      contacts = response.data || [];
      console.log('Fetched contacts:', contacts);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
    }
  }

  // Fetch groups for recipient details
  async function fetchGroups() {
    try {
      const response = await api.groups.getAll();
      groups = response.data || [];
      console.log('Fetched groups:', groups);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
    }
  }

  onMount(async () => {
    await fetchScheduledMessages();
  });

  function openModal(message: ScheduledMessage) {
    selectedMessage = message;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedMessage = null;
  }

  async function deleteScheduledMessage() {
    if (!selectedMessage) return;
    
    try {
      await api.schedule.delete(selectedMessage.id);
      scheduledMessages = scheduledMessages.filter(msg => msg.id !== selectedMessage?.id);
      closeModal();
    } catch (err: any) {
      console.error('Error deleting scheduled message:', err);
      // Show error message to user
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function getRecipientName(message: ScheduledMessage): string {
    if (message.recipient_type === 'group') {
      // Find group by ID
      const group = groups.find(g => g.id === Number(message.recipient_id));
      return group ? group.name : `Group #${message.recipient_id}`;
    } else {
      // Find contact by ID
      const contact = contacts.find(c => c.id === Number(message.recipient_id));
      if (contact) {
        return `${contact.first_name} ${contact.last_name} (${contact.phone_number})`;
      }
      return `Contact #${message.recipient_id}`;
    }
  }

  // Helper to determine status class
  function getStatusClass(status?: string): string {
    if (!status) return 'text-[#818181] bg-[#F0F0F0]/50';
    
    switch (status.toLowerCase()) {
      case 'sent':
        return 'text-[#4285F4] bg-[#E8F0FE]/50';
      case 'failed':
        return 'text-[#E16F64] bg-[#FFE2DD]/50';
      case 'pending':
        return 'text-[#F4B400] bg-[#FEF7E0]/50';
      case 'scheduled':
        return 'text-[#4285F4] bg-[#E8F0FE]/50';
      default:
        return 'text-[#818181] bg-[#F0F0F0]/50';
    }
  }
</script>

<div class="">
  {#if loading}
    <div class="p-4 text-center">
      <p>Loading scheduled messages...</p>
    </div>
  {:else if error}
    <div class="p-4 text-center text-[#E16F64]">
      <p>Error: {error}</p>
    </div>
  {:else if scheduledMessages.length === 0}
    <div class="p-4 text-center">
      <p>No scheduled messages found. Create a new scheduled message to get started.</p>
    </div>
  {:else}
    {#each scheduledMessages as message (message.id)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="p-4 border border-[#EBEBE8] rounded-lg mb-4 flex justify-between items-center cursor-pointer"
        on:click={() => openModal(message)}
      >
        <div>
          <h2 class="text-lg font-semibold text-[#443C68]">
            {getRecipientName(message)}
          </h2>
          <p class="text-sm text-[#818181]">{message.message_text}</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <span class="text-xs text-[#07404B] bg-[#07404B]/10 px-2 py-1 rounded-lg">
              {message.recipient_type === 'group' ? 'Group' : 'Individual'}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <p class="text-xs text-[#818181] font-medium p-4 ">
            {formatDate(message.scheduled_time)}
          </p>
          <p class="text-xs font-medium p-4 px-8 text-center rounded-lg {getStatusClass(message.status || 'scheduled')}">
            {message.status || 'Scheduled'}
          </p>
        </div>
      </div>
    {/each}
  {/if}
</div>

{#if selectedMessage && isModalOpen}
  <Modal isOpen={isModalOpen} title="Scheduled Message" on:close={closeModal}>
    <div>
      <p class="flex justify-between items-center text-xs text-[#818181]">
        Scheduled for: {formatDate(selectedMessage.scheduled_time)}
        <span class="text-center text-xs p-2 px-8 {getStatusClass(selectedMessage.status || 'scheduled')} rounded-lg">
          {selectedMessage.status || 'Scheduled'}
        </span>
      </p>
      <div>
        <p class="text-xs text-[#818181] mt-8">Message</p>
        <div class="text-xs text-[#443C68] font-medium p-3 mt-2 rounded-lg bg-[#ebebe8]/50">
          {selectedMessage.message_text}
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-10">
        <p class="text-xs text-[#818181]">Recipient</p>
        <div class="flex flex-wrap gap-2">
            <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">
              {getRecipientName(selectedMessage)}
            </p>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center gap-2 mt-8">
      <button 
        on:click={deleteScheduledMessage} 
        class="flex items-center gap-2 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out"
      >   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E16F64" viewBox="0 0 256 256">
          <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
        </svg>
        <p>Delete Scheduled Message</p>
      </button>
    </div>
  </Modal>
{/if} 