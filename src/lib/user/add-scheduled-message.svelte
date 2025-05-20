<script lang="ts">
  import { api } from "$lib/services/api.js";
  import { createEventDispatcher, onMount } from "svelte";
  import Modal from "$lib/general/modal.svelte";

  export let isOpen = false;
  export let defaultContent: string | undefined = undefined;
  export let defaultSelectedContact: string | undefined = undefined;
  export let defaultSelectedGroup: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  interface Group {
    id: number;
    name: string;
  }

  interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
  }

  let message = defaultContent || "";
  let scheduledTime = "";
  let recipientType: "single" | "group" = "single";
  let recipientId = "";
  let loading = false;
  let error = "";
  let success = "";
  let characterCount = 0;
  let groups: Group[] = [];
  let contacts: Contact[] = [];

  // Initialize based on props
  $: {
    if (defaultSelectedGroup) {
      recipientType = 'group';
      recipientId = defaultSelectedGroup;
    } else if (defaultSelectedContact) {
      recipientType = 'single';
      recipientId = defaultSelectedContact;
    }
  }

  // Update character count when message changes
  $: characterCount = message ? message.length : 0;

  // Load data on component mount
  onMount(() => {
    fetchGroups();
    fetchContacts();
  });

  async function fetchGroups() {
    try {
      const response = await api.groups.getAll();
      console.log('Groups response:', response);
      groups = response.data || [];
    } catch (err: any) {
      console.error('Error fetching groups:', err);
    }
  }

  async function fetchContacts() {
    try {
      const response = await api.contacts.getAll();
      console.log('Contacts response:', response);
      contacts = response.data || [];
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
    }
  }

  function closeModal() {
    isOpen = false;
    // Reset form
    message = defaultContent || "";
    scheduledTime = "";
    recipientType = defaultSelectedGroup ? 'group' : 'single';
    recipientId = defaultSelectedGroup || defaultSelectedContact || "";
    error = "";
    success = "";
    dispatch('close');
  }

  async function scheduleMessage() {
    console.log("Scheduling message with:", {
      message,
      scheduledTime,
      recipientType,
      recipientId
    });

    if (!message) {
      error = "Message is required";
      return;
    }

    if (!scheduledTime) {
      error = "Scheduled time is required";
      return;
    }

    if (!recipientId) {
      error = "Recipient is required";
      return;
    }

    // Validate message length
    if (message.length > 3200) {
      error = "Message length exceeds 3200 characters";
      return;
    }

    // Check if scheduled time is in the future
    const scheduledDateTime = new Date(scheduledTime);
    const now = new Date();
    if (scheduledDateTime <= now) {
      error = "Scheduled time must be in the future";
      return;
    }

    loading = true;
    error = "";
    success = "";

    try {
      // Send the raw datetime string instead of converting to ISO
      const data = {
        message,
        scheduled_time: scheduledTime,
        recipient_type: recipientType,
        recipient_id: parseInt(recipientId)
      };

      console.log("Sending data to API:", data);
      await api.schedule.create(data);
      success = "Message scheduled successfully";
      
      // Short delay to show success message
      setTimeout(() => {
        closeModal();
        dispatch('messageAdded');
      }, 1500);
    } catch (err: any) {
      console.error('Error scheduling message:', err);
      error = err.message || "Failed to schedule message";
    } finally {
      loading = false;
    }
  }
</script>

<Modal isOpen={isOpen} title="Schedule New Message" on:close={closeModal}>
  <form class="flex flex-col gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2" on:submit|preventDefault={scheduleMessage}>
    <!-- Status messages -->
    {#if error}
      <div class="p-2 bg-[#FFE2DD]/50 text-[#E16F64] text-xs rounded-lg">
        {error}
      </div>
    {/if}

    {#if success}
      <div class="p-2 bg-[#DBEDDB]/50 text-[#6C9B7D] text-xs rounded-lg">
        {success}
      </div>
    {/if}

    <!-- Message Content Section -->
    <div class="flex flex-col gap-2">
      <div>
        <div class="flex justify-between items-center">
          <p class="block text-xs text-[#818181]">Message *</p>
          <p class="text-xs text-[#818181]">{characterCount}/3200 chars</p>
        </div>
        <textarea
          bind:value={message}
          class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm"
          placeholder="Enter SMS message content"
          rows="4"
        ></textarea>
      </div>
    </div>

    <!-- Schedule Section -->
    <div class="flex flex-col gap-2">
      <p class="block text-xs text-[#818181]">Scheduled Time *</p>
      <input
        bind:value={scheduledTime}
        type="datetime-local"
        class="w-full p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm text-[#443C68]"
      />
    </div>

    <!-- Recipient Type Selection -->
    <div class="flex flex-col gap-2">
      <p class="block text-xs text-[#818181] font-medium">Send To</p>
      <div class="flex gap-4">
        <button
          type="button"
          class="flex-1 p-3 rounded-lg text-sm {recipientType === 'single' ? 'bg-[#07404B] text-white' : 'bg-[#F5F5F5] text-[#818181]'}"
          on:click={() => {
            recipientType = "single";
            recipientId = defaultSelectedContact || "";
          }}
        >
          Individual Contact
        </button>
        <button
          type="button"
          class="flex-1 p-3 rounded-lg text-sm {recipientType === 'group' ? 'bg-[#07404B] text-white' : 'bg-[#F5F5F5] text-[#818181]'}"
          on:click={() => {
            recipientType = "group";
            recipientId = defaultSelectedGroup || "";
          }}
        >
          Contact Group
        </button>
      </div>
    </div>

    <!-- Recipient Selection -->
    <div class="flex flex-col gap-2">
      <p class="block text-xs text-[#818181]">Recipient *</p>
      {#if recipientType === "single"}
        <select
          bind:value={recipientId}
          class="w-full mt-1 text-sm text-[#443C68] p-2 border border-[#EBEBE8] rounded-lg focus:outline-none"
        >
          <option value="">Select a contact</option>
          {#if contacts && contacts.length > 0}
            {#each contacts as contact}
              <option value={contact.id} selected={contact.id.toString() === defaultSelectedContact}>
                {contact.first_name || ''} {contact.last_name || ''} ({contact.phone_number || 'No phone'})
              </option>
            {/each}
          {:else}
            <option value="" disabled>No contacts available</option>
          {/if}
        </select>
      {:else}
        <select
          bind:value={recipientId}
          class="w-full mt-1 text-sm text-[#443C68] p-2 border border-[#EBEBE8] rounded-lg focus:outline-none"
        >
          <option value="">Select a group</option>
          {#if groups && groups.length > 0}
            {#each groups as group}
              <option value={group.id} selected={group.id.toString() === defaultSelectedGroup}>
                {group.name || 'Unnamed group'}
              </option>
            {/each}
          {:else}
            <option value="" disabled>No groups available</option>
          {/if}
        </select>
      {/if}
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center gap-2 border-t border-[#EBEBE8] pt-4 mt-2">
      <button 
        type="button"
        on:click={closeModal}
        class="flex items-center gap-2 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out"
      >   
        Cancel
      </button>
      <button 
        type="submit"
        disabled={loading}
        class="flex items-center gap-2 w-full justify-center text-xs text-white font-medium p-3 rounded-lg bg-[#07404B] hover:bg-[#07404B]/90 transition duration-200 ease-in-out disabled:opacity-50"
      >   
        {#if loading}
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Scheduling...
        {:else}
          Schedule Message
        {/if}
      </button>
    </div>
  </form>
</Modal> 