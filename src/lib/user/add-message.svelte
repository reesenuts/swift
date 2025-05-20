<script lang="ts">
  import Modal from "$lib/general/modal.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount, createEventDispatcher } from "svelte";
  
  export let isOpen = false;
  export let defaultTemplateId: string | undefined = undefined;
  export let defaultContent: string | undefined = undefined;
  export let defaultPhoneNumber: string | undefined = undefined;
  export let defaultSelectedGroup: string | undefined = undefined;
  export let defaultSelectedContact: string | undefined = undefined;

  // Form data
  let title = "";
  let message = defaultContent || "";
  let recipients = defaultPhoneNumber || "";
  let selectedGroup = "";
  let selectedContact = "";
  let groups: { id: number; name: string }[] = [];
  let contacts: { id: number; first_name: string; last_name: string; phone_number: string }[] = [];
  let templates: { id: number; name: string; content: string }[] = [];
  let selectedTemplate = defaultTemplateId || "";
  let loading = false;
  let error: string | null = null;
  let success: string | null = null;
  let characterCount = 0;
  let showTemplates = false;
  let multipleRecipients = false;

  // Add state for UI flow
  let recipientType: 'individual' | 'group' = 'individual';

  // Initialize selectedGroup and recipientType based on props
  $: {
    if (defaultSelectedGroup) {
      selectedGroup = defaultSelectedGroup;
      recipientType = 'group';
    } else if (defaultPhoneNumber) {
      recipients = defaultPhoneNumber;
      recipientType = 'individual';
    } else if (defaultSelectedContact) {
      selectedContact = defaultSelectedContact;
      recipientType = 'individual';
    }
  }

  const dispatch = createEventDispatcher();

  // Get groups, contacts and templates on mount
  onMount(async () => {
    console.log('AddMessage component mounted with defaultSelectedGroup:', defaultSelectedGroup);
    try {
      // Fetch groups
      const groupResponse = await api.groups.getAll();
      groups = groupResponse.data || [];
      console.log('Fetched groups:', groups);
      
      // Fetch contacts
      const contactResponse = await api.contacts.getAll();
      contacts = contactResponse.data || [];
      console.log('Fetched contacts:', contacts);
      
      // Fetch templates
      const templateResponse = await api.templates.getAll();
      templates = templateResponse.data || [];

      // If a default group is provided, select it
      if (defaultSelectedGroup) {
        console.log('Setting initial group selection:', defaultSelectedGroup);
        selectedGroup = defaultSelectedGroup;
        recipientType = 'group';
      }

      // If a default contact is provided, select it
      if (defaultSelectedContact) {
        selectedContact = defaultSelectedContact;
        recipientType = 'individual';
        multipleRecipients = false;
      }

      // If a default phone number is provided, see if it matches a contact
      if (defaultPhoneNumber) {
        const matchingContact = contacts.find(c => c.phone_number === defaultPhoneNumber);
        if (matchingContact) {
          selectedContact = matchingContact.id.toString();
          multipleRecipients = false;
        } else {
          recipients = defaultPhoneNumber;
          multipleRecipients = true;
        }
        recipientType = 'individual';
      }

      // If a default template is provided, select it and set the message
      if (defaultTemplateId && !defaultContent) {
        selectedTemplate = defaultTemplateId;
        const template = templates.find(t => t.id === parseInt(defaultTemplateId));
        if (template) {
          message = template.content;
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
    }
  });

  // Update character count when message changes
  $: characterCount = message ? message.length : 0;

  // Watch for changes in defaultContent
  $: if (defaultContent) {
    message = defaultContent;
  }

  // Watch for changes in defaultPhoneNumber
  $: if (defaultPhoneNumber) {
    recipients = defaultPhoneNumber;
    recipientType = 'individual';
  }

  // Watch for changes in defaultSelectedGroup
  $: if (defaultSelectedGroup) {
    console.log('defaultSelectedGroup changed:', defaultSelectedGroup);
    selectedGroup = defaultSelectedGroup;
    recipientType = 'group';
    console.log('Updated selectedGroup:', selectedGroup);
    console.log('Updated recipientType:', recipientType);
  }

  // Handle template selection
  function handleTemplateSelect() {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === parseInt(selectedTemplate));
      if (template) {
        message = template.content;
      }
    }
  }

  // Toggle templates panel
  function toggleTemplates() {
    showTemplates = !showTemplates;
  }

  // Toggle between single contact and multiple recipients
  function toggleMultipleRecipients() {
    multipleRecipients = !multipleRecipients;
    if (multipleRecipients) {
      // When switching to multiple recipients, initialize with selected contact's phone if available
      if (selectedContact) {
        const contact = contacts.find(c => c.id.toString() === selectedContact);
        if (contact) {
          recipients = contact.phone_number;
        } else {
          recipients = defaultPhoneNumber || '';
        }
      }
    } else {
      // When switching to single contact, try to match the first phone number
      if (recipients) {
        const firstPhone = recipients.split(',')[0].trim();
        const matchingContact = contacts.find(c => c.phone_number === firstPhone);
        if (matchingContact) {
          selectedContact = matchingContact.id.toString();
        } else {
          selectedContact = "";
        }
      }
    }
  }

  // Clear form with new states
  function clearForm() {
    title = "";
    message = "";
    recipients = defaultPhoneNumber || ""; // Preserve default phone number if it exists
    selectedContact = defaultSelectedContact || "";
    selectedGroup = defaultSelectedGroup || ""; // Preserve default group if it exists
    selectedTemplate = "";
    recipientType = defaultSelectedGroup ? 'group' : (defaultPhoneNumber || defaultSelectedContact ? 'individual' : 'individual');
    error = null;
    success = null;
  }

  // Close modal and reset form
  function closeModal() {
    dispatch("close");
  }

  // Helper to get selected contact phone number
  function getSelectedContactPhone(): string {
    if (!selectedContact) return '';
    const contact = contacts.find(c => c.id.toString() === selectedContact);
    return contact ? contact.phone_number : '';
  }

  // Handle form submission
  async function handleSubmit() {
    // Reset status messages
    error = null;
    success = null;
    
    // Validate form
    if (!message) {
      error = "Message content is required";
      return;
    }

    // Validate message length
    if (message.length > 3200) {
      error = "Message length exceeds 3200 characters";
      return;
    }

    // For individual messages, check recipients
    if (recipientType === 'individual') {
      if (multipleRecipients && !recipients) {
        error = "Please enter recipients for sending";
        return;
      } else if (!multipleRecipients && !selectedContact) {
        error = "Please select a contact";
        return;
      }
    }

    // For group messages, check if group is selected
    if (recipientType === 'group' && !selectedGroup) {
      error = "Please select a group";
      return;
    }

    loading = true;

    try {
      // Send immediately
      if (recipientType === 'group') {
        // Send to the entire group
        console.log(`Sending to group ${selectedGroup}: ${message}`);
        const result = await api.post(`groups/${selectedGroup}/send`, { 
          title, 
          message 
        });
        
        success = `Message sent to group successfully. Sent: ${result.totalSent}, Failed: ${result.totalFailed}`;
      } else {
        // Send to individual recipients - either multiple or single
        let phoneNumbers: string[] = [];
        
        if (multipleRecipients) {
          // Multiple recipients - parse from comma-separated text
          phoneNumbers = recipients.split(',').map(num => num.trim()).filter(Boolean);
        } else {
          // Single contact - get phone number from selected contact
          const contactPhone = getSelectedContactPhone();
          if (contactPhone) {
            phoneNumbers = [contactPhone];
          }
        }
        
        if (!phoneNumbers.length) {
          error = "Please enter at least one valid phone number";
          loading = false;
          return;
        }
        
        console.log(`Sending to ${phoneNumbers.length} recipients: ${message}`);
        const result = await api.sms.sendBulk(phoneNumbers, message);
        
        success = `Message sent successfully. Sent: ${result.totalSent}, Failed: ${result.totalFailed}`;
      }

      // Emit event to refresh messages
      dispatch('messageAdded');

      // Reset form on success
      clearForm();
      
      // Add a small delay before closing the modal to allow the user to see the success message
      setTimeout(() => {
        console.log("Closing modal after success");
        dispatch("close");
      }, 1500);
    } catch (err: any) {
      console.error('Error sending message:', err);
      error = err.message || 'Failed to send message';
    } finally {
      loading = false;
    }
  }
</script>

<Modal isOpen={isOpen} title="Send Message" on:close={closeModal}>
  <form class="flex flex-col gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2" on:submit|preventDefault={handleSubmit}>
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
    <div class="border-b border-[#EBEBE8] pb-4">
      <!-- Title -->
      <div class="mb-4">
        <p class="block text-xs text-[#818181]">Title (optional)</p>
        <input
          type="text"
          bind:value={title}
          class="w-full mt-1 p-2 border text-sm border-[#EBEBE8] rounded-lg focus:outline-none"
          placeholder="Enter message title"
        />
      </div>

      <!-- Templates -->
      {#if templates.length > 0}
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <p class="block text-xs text-[#818181]">Use Template</p>
            <button 
              type="button" 
              class="text-xs text-[#07404B] hover:underline"
              on:click={toggleTemplates}
            >
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </button>
          </div>
          
          {#if showTemplates}
            <div class="mt-1">
              <select 
                bind:value={selectedTemplate}
                on:change={handleTemplateSelect}
                class="w-full text-sm text-[#443C68] p-2 border border-[#EBEBE8] rounded-lg focus:outline-none"
              >
                <option value="">Select a template</option>
                {#each templates as template}
                  <option value={template.id}>{template.name}</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Message -->
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

    <!-- Recipient Type Selection -->
    <div class="flex flex-col gap-2">
      <p class="block text-xs text-[#818181] font-medium">Send To</p>
      <div class="flex gap-4">
        <button
          type="button"
          class="flex-1 p-3 rounded-lg text-sm {recipientType === 'individual' ? 'bg-[#07404B] text-white' : 'bg-[#F5F5F5] text-[#818181]'}"
          on:click={() => {
            recipientType = 'individual';
            selectedGroup = '';
          }}
        >
          Individual Recipients
        </button>
        <button
          type="button"
          class="flex-1 p-3 rounded-lg text-sm {recipientType === 'group' ? 'bg-[#07404B] text-white' : 'bg-[#F5F5F5] text-[#818181]'}"
          on:click={() => {
            recipientType = 'group';
            recipients = '';
            selectedContact = '';
          }}
        >
          Contact Group
        </button>
      </div>
    </div>

    <!-- Recipients Section -->
    <div class="flex flex-col ">
      {#if recipientType === 'individual'}
        <!-- Toggle between contact selection and manual entry -->
        <div class="flex justify-between items-center">
          <p class="block text-xs text-[#818181]">Recipient *</p>
          <button 
            type="button" 
            class="text-xs text-[#07404B] hover:underline"
            on:click={toggleMultipleRecipients}
          >
            {multipleRecipients ? 'Select Single Contact' : 'Enter Multiple Recipients'}
          </button>
        </div>

        {#if multipleRecipients}
          <!-- Manual entry for multiple recipients -->
          <div>
            <input
              type="text"
              bind:value={recipients}
              class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm"
              placeholder="Enter phone numbers (comma-separated)"
            />
          </div>
        {:else}
          <!-- Dropdown for contact selection -->
          <select 
            bind:value={selectedContact}
            class="w-full mt-1 text-sm text-[#443C68] p-2 border border-[#EBEBE8] rounded-lg focus:outline-none"
          >
            <option value="">Select a contact</option>
            {#if contacts && contacts.length > 0}
              {#each contacts as contact}
                <option value={contact.id.toString()} selected={contact.id.toString() === defaultSelectedContact}>
                  {contact.first_name || ''} {contact.last_name || ''} ({contact.phone_number || 'No phone'})
                </option>
              {/each}
            {:else}
              <option value="" disabled>No contacts available</option>
            {/if}
          </select>
        {/if}
      {:else}
        <div>
          <p class="block text-xs text-[#818181]">Select Group *</p>
          <select 
            bind:value={selectedGroup}
            class="w-full mt-1 text-sm text-[#443C68] p-2 border border-[#EBEBE8] rounded-lg focus:outline-none"
          >
            <option value="">Select a group</option>
            {#if groups && groups.length > 0}
              {#each groups as group}
                <option value={group.id.toString()} selected={group.id.toString() === defaultSelectedGroup}>
                  {group.name || 'Unnamed group'}
                </option>
              {/each}
            {:else}
              <option value="" disabled>No groups available</option>
            {/if}
          </select>
        </div>
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
          Sending...
        {:else}
          Send Message
        {/if}
      </button>
    </div>
  </form>
</Modal> 