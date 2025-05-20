<script lang="ts">
  import Modal from "$lib/general/modal.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount } from "svelte";

  interface Message {
    id: number;
    title?: string;
    message_text: string;
    phone_number: string;
    status?: string;
    tag?: string;
    created_at?: string;
    recipients?: Array<string | { phone_number: string }>;
  }

  interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  }

  let isModalOpen = false;
  let selectedMessage: Message | null = null;
  let messages: Message[] = [];
  let contacts: Contact[] = [];
  let loading = true;
  let error: string | null = null;

  // Make fetchMessages publicly accessible
  export async function fetchMessages() {
    loading = true;
    error = null;
    try {
      const response = await api.messages.getAll();
      messages = response.messages || [];
      
      // Fetch contacts for recipient info
      await fetchContacts();
    } catch (err: any) {
      console.error('Error fetching messages:', err);
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

  onMount(async () => {
    await fetchMessages();
  });

  function openModal(message: Message) {
    selectedMessage = message;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedMessage = null;
  }

  async function deleteMessage() {
    if (!selectedMessage) return;
    
    try {
      await api.messages.delete(selectedMessage.id);
      messages = messages.filter(msg => msg.id !== selectedMessage?.id);
      closeModal();
    } catch (err: any) {
      console.error('Error deleting message:', err);
      // Show error message to user
    }
  }

  async function createTemplateFromMessage() {
    if (!selectedMessage) return;
    
    try {
      const templateData = {
        name: `Template from ${getRecipientName(selectedMessage)}`,
        content: selectedMessage.message_text
      };
      
      await api.templates.create(templateData);
      closeModal();
      // Show success notification
      error = null;
    } catch (err: any) {
      console.error('Error creating template:', err);
      error = err.message || 'Failed to create template';
    }
  }

  // Get recipient name from phone number
  function getRecipientName(message: Message): string {
    // Normalize the phone number from the message (E.164 format)
    const normalizedMessagePhone = normalizePhoneNumber(message.phone_number);
    
    // Find contact by comparing normalized phone numbers
    const contact = contacts.find(c => normalizePhoneNumber(c.phone_number) === normalizedMessagePhone);
    
    if (contact) {
      return `${contact.first_name || ''} ${contact.last_name || ''} (${contact.phone_number})`;
    }
    return `${message.phone_number} (Not in contacts)`;
  }

  // Helper to normalize phone numbers for comparison
  function normalizePhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // For Philippine numbers:
    // - If starts with +63, it's already E.164
    // - If starts with 0, convert from local format to E.164 equivalent
    
    // If it's a Philippine number starting with 0 (local format), convert to E.164 equivalent
    if (digits.startsWith('0') && digits.length === 11) {
      // Convert 09XXXXXXXX to 9XXXXXXXX (removing leading 0)
      return digits.substring(1);
    }
    
    // If it's a Philippine number in E.164 format (+63), extract just the significant digits
    if (digits.startsWith('63') && digits.length === 12) {
      // Convert 63XXXXXXXXX to 9XXXXXXXX (removing country code)
      return digits.substring(2);
    }
    
    // Return the digits for other cases
    return digits;
  }

  // Helper function to format phone numbers for display
  function formatPhoneNumbers(phones: Array<string | { phone_number: string }> | undefined): string[] {
    if (!phones || !phones.length) return [];
    return phones.map(p => typeof p === 'string' ? p : p.phone_number);
  }

  // Helper to determine status class
  function getStatusClass(status?: string): string {
    if (!status) return 'text-[#818181] bg-[#F0F0F0]/50';
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-[#6C9B7D] bg-[#DBEDDB]/50';
      case 'failed':
        return 'text-[#E16F64] bg-[#FFE2DD]/50';
      case 'submitted':
        return 'text-[#4285F4] bg-[#E8F0FE]/50';
      case 'pending':
        return 'text-[#F4B400] bg-[#FEF7E0]/50';
      default:
        return 'text-[#818181] bg-[#F0F0F0]/50';
    }
  }
</script>

<div class="">
  {#if loading}
    <div class="p-4 text-center">
      <p>Loading messages...</p>
    </div>
  {:else if error}
    <div class="p-4 text-center text-[#E16F64]">
      <p>Error: {error}</p>
    </div>
  {:else if messages.length === 0}
    <div class="p-4 text-center">
      <p>No messages found. Create a new message to get started.</p>
    </div>
  {:else}
    {#each messages as message (message.id)}
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
            {#if message.tag}
              <span class="text-xs text-[#07404B] bg-[#07404B]/10 px-2 py-1 rounded-lg">{message.tag}</span>
            {/if}
          </div>
        </div>
        <div class="flex gap-2">
          <p class="text-xs text-[#818181] font-medium p-4 ">
            {new Date(message.created_at || Date.now()).toLocaleString()}
          </p>
          <p class="text-xs font-medium p-4 px-8 text-center rounded-lg {getStatusClass(message.status)}">
            {message.status === 'submitted' ? 'sent' : message.status || 'Unknown'}
          </p>
        </div>
      </div>
    {/each}
  {/if}
</div>

{#if selectedMessage && isModalOpen}
  <Modal isOpen={isModalOpen} title={getRecipientName(selectedMessage)} on:close={closeModal}>
    <div>
      <p class="flex justify-between items-center text-xs text-[#818181]">
        {new Date(selectedMessage.created_at || Date.now()).toLocaleString()}
        <span class="text-center text-xs p-2 px-8 {getStatusClass(selectedMessage.status)} rounded-lg">
          {selectedMessage.status === 'submitted' ? 'sent' : selectedMessage.status || 'Unknown'}
        </span>
      </p>
      {#if selectedMessage.tag}
        <div class="flex items-center gap-2 mt-8">
          <p class="text-xs text-[#818181]">Tag: <span class="text-xs p-2 text-[#07404B] bg-[#07404B]/10 rounded-lg">{selectedMessage.tag}</span></p>
        </div>
      {/if}
      <div>
        <p class="text-xs text-[#818181] mt-8">Message</p>
        <div class="text-xs text-[#443C68] font-medium p-3 mt-2 rounded-lg bg-[#ebebe8]/50">
          {selectedMessage.message_text}
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-10">
        <p class="text-xs text-[#818181]">Recipient</p>
        <div class="flex flex-wrap gap-2">
            <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">{getRecipientName(selectedMessage)}</p>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center gap-2 mt-8">
      <button 
        on:click={deleteMessage} 
        class="flex items-center gap-2 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out"
      >   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E16F64" viewBox="0 0 256 256">
          <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
        </svg>
        <p>Delete Message</p>
      </button>
      <button 
        on:click={createTemplateFromMessage}
        class="flex items-center gap-2 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out"
      >   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6C9B7D" viewBox="0 0 256 256">
          <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
        </svg>
        <p>Use Template</p>
      </button>
    </div>
  </Modal>
{/if} 