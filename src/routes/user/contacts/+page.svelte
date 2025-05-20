<script lang="ts">
  import Modal from "$lib/general/modal.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount, createEventDispatcher } from "svelte";
  import AddMessage from "$lib/user/add-message.svelte";

  // Interfaces for type safety
  interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string;
    tags?: Tag[];
  }

  interface Group {
    id: number;
    name: string;
    description?: string;
    contacts?: Contact[];
    tags?: Tag[];
  }

  interface Tag {
    id: number;
    name: string;
    user_id?: number;
  }

  // Component state
  let groups: Group[] = [];
  let contacts: Contact[] = [];
  let tags: Tag[] = [];
  let loading = true;
  let error: string | null = null;
  let success: string | null = null;

  // Modal states
  let isGroupModalOpen = false;
  let isContactModalOpen = false;
  let editingGroup: Group | null = null;
  let editingContact: Contact | null = null;

  // Form data for new/edit group
  let groupForm = {
    name: "",
    description: "",
    contactIds: [] as number[],
    tags: [] as string[]
  };

  // Form data for new/edit contact
  let contactForm = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    tags: ""
  };

  // Available tags for selection
  let availableTags: Tag[] = [];
  let contactSelectedTags: string[] = [];
  let newTagInput = "";
  let contactNewTagInput = "";

  // Update contactForm.tags when contactSelectedTags changes
  $: contactForm.tags = contactSelectedTags.join(',');

  // Add message modal state
  let isMessageModalOpen = false;
  let selectedContactForMessage: Contact | null = null;
  let selectedGroupForMessage: Group | null = null;

  // Function to add a new tag to group
  function addTagToGroup() {
    if (newTagInput.trim()) {
      if (!groupForm.tags.includes(newTagInput.trim())) {
        groupForm.tags = [...groupForm.tags, newTagInput.trim()];
      }
      newTagInput = "";
    }
  }

  // Function to remove tag from group
  function removeTagFromGroup(tagToRemove: string) {
    groupForm.tags = groupForm.tags.filter(tag => tag !== tagToRemove);
  }
  
  // Function to add a new tag to contact
  function addTagToContact() {
    if (contactNewTagInput.trim()) {
      if (!contactSelectedTags.includes(contactNewTagInput.trim())) {
        contactSelectedTags = [...contactSelectedTags, contactNewTagInput.trim()];
      }
      contactNewTagInput = "";
    }
  }

  // Function to remove tag from contact
  function removeTagFromContact(tagToRemove: string) {
    contactSelectedTags = contactSelectedTags.filter(tag => tag !== tagToRemove);
  }

  // Handle checkbox change with proper typing
  function handleContactCheckboxChange(e: Event, id: number) {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      groupForm.contactIds = [...groupForm.contactIds, id];
      console.log('Added contact to selection:', id, 'Current contactIds:', groupForm.contactIds);
    } else {
      groupForm.contactIds = groupForm.contactIds.filter(contactId => contactId !== id);
      console.log('Removed contact from selection:', id, 'Current contactIds:', groupForm.contactIds);
    }
  }

  // Fetch data on component mount
  onMount(async () => {
    await fetchContacts();
    await fetchGroups();
    await fetchTags();
  });

  // Fetch contacts from API
  async function fetchContacts() {
    try {
      const response = await api.contacts.getAll();
      console.log("contacts:");
      console.log(response);
      
      // Fetch tags for each contact
      const contactsWithTags = await Promise.all(
        (response.data || []).map(async (contact: any) => {
          try {
            const contactTags = await api.tags.getContactTags(contact.id);
            return {
              ...contact,
              tags: contactTags.data || []
            };
          } catch (e) {
            console.error(`Error fetching tags for contact ${contact.id}:`, e);
            return {
              ...contact,
              tags: []
            };
          }
        })
      );
      
      contacts = contactsWithTags;
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
      error = err.message || 'Failed to load contacts';
    }
  }

  // Fetch groups from API
  async function fetchGroups() {
    try {
      const response = await api.groups.getAll();
      console.log("groups:");
      console.log(response);
      
      // Get basic group data
      const groupsData = response.data || [];
      
      // Fetch contacts and tags for each group
      const groupsWithData = await Promise.all(
        groupsData.map(async (group: any) => {
          try {
            // Get contacts for this group
            const contactsResponse = await api.groups.getContacts(group.id);
            // Get tags for this group
            const tagsResponse = await api.tags.getGroupTags(group.id);
            
            return {
              ...group,
              contacts: contactsResponse.data || [],
              tags: tagsResponse.data || []
            };
          } catch (e) {
            console.error(`Error fetching data for group ${group.id}:`, e);
            return {
              ...group,
              contacts: [],
              tags: []
            };
          }
        })
      );
      
      groups = groupsWithData;
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      error = err.message || 'Failed to load groups';
    } finally {
      loading = false;
    }
  }

  // Fetch tags from API
  async function fetchTags() {
    try {
      const response = await api.tags.getAll();
      tags = response.data || [];
      availableTags = tags;
      console.log("Fetched tags:", tags);
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      error = err.message || 'Failed to load tags';
    }
  }

  // Create a new tag
  async function createTag(name: string) {
    try {
      const response = await api.tags.create(name);
      tags = [...tags, response.data];
      return response.data;
    } catch (err: any) {
      console.error('Error creating tag:', err);
      error = err.message || 'Failed to create tag';
      return null;
    }
  }

  // Fetch contact's tags
  async function fetchContactTags(contactId: number) {
    try {
      const response = await api.tags.getContactTags(contactId);
      return response.data || [];
    } catch (err: any) {
      console.error(`Error fetching tags for contact ${contactId}:`, err);
      return [];
    }
  }

  // Fetch group's tags
  async function fetchGroupTags(groupId: number) {
    try {
      const response = await api.tags.getGroupTags(groupId);
      return response.data || [];
    } catch (err: any) {
      console.error(`Error fetching tags for group ${groupId}:`, err);
      return [];
    }
  }

  // Process tag input (for both contacts and groups)
  async function processTagInput(input: string | string[]): Promise<Tag[]> {
    let tagNames: string[];
    
    if (Array.isArray(input)) {
      tagNames = input;
    } else if (typeof input === 'string') {
      if (!input.trim()) return [];
      tagNames = input.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      return [];
    }
    
    console.log('Processing tag names:', tagNames);
    
    // Check for existing tags
    const existingTags = tags.filter(t => tagNames.includes(t.name));
    const newTagNames = tagNames.filter(name => !tags.some(t => t.name === name));
    
    console.log('Existing tags:', existingTags.map(t => t.name));
    console.log('New tag names to create:', newTagNames);
    
    // Create new tags
    const newTags: Tag[] = [];
    for (const name of newTagNames) {
      const tag = await createTag(name);
      if (tag) {
        newTags.push(tag);
        // Add to the global tags array to make it available immediately
        tags = [...tags, tag];
      }
    }
    
    console.log('Created new tags:', newTags.map(t => t.name));
    console.log('Returning all processed tags:', [...existingTags, ...newTags].map(t => t.name));
    
    return [...existingTags, ...newTags];
  }

  // Group Modal Functions
  function openGroupModal(group: Group | null = null) {
    success = null;
    error = null;
    
    if (group) {
      editingGroup = group;
      groupForm = {
        name: group.name,
        description: group.description || "",
        contactIds: group.contacts?.map(c => c.id) || [],
        tags: group.tags?.map(t => t.name) || []
      };
    } else {
      editingGroup = null;
      resetGroupForm();
    }
    
    isGroupModalOpen = true;
  }

  function closeGroupModal() {
    isGroupModalOpen = false;
    resetGroupForm();
  }

  function resetGroupForm() {
    groupForm = {
      name: "",
      description: "",
      contactIds: [],
      tags: []
    };
  }

  // Contact Modal Functions
  function openContactModal(contact: Contact | null = null) {
    success = null;
    error = null;
    
    if (contact) {
      editingContact = contact;
      contactForm = {
        first_name: contact.first_name,
        last_name: contact.last_name,
        phone_number: contact.phone_number,
        email: contact.email || "",
        tags: contact.tags?.map(t => t.name).join(", ") || ""
      };
      contactSelectedTags = contact.tags?.map(t => t.name) || [];
    } else {
      editingContact = null;
      resetContactForm();
      contactSelectedTags = [];
    }
    
    isContactModalOpen = true;
  }

  function closeContactModal() {
    isContactModalOpen = false;
    resetContactForm();
  }

  function resetContactForm() {
    contactForm = {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      tags: ""
    };
    contactSelectedTags = [];
  }

  // Save contact function
  async function saveContact() {
    if (!contactForm.first_name || !contactForm.last_name || !contactForm.phone_number) {
      error = "First name, last name, and phone number are required";
      return;
    }

    try {
      const contactData = {
        first_name: contactForm.first_name,
        last_name: contactForm.last_name,
        phone_number: contactForm.phone_number,
        email: contactForm.email
      };

      let contactId: number;

      if (editingContact) {
        // Update existing contact
        await api.contacts.update(editingContact.id, contactData);
        contactId = editingContact.id;
        success = "Contact updated successfully";
        
        // Get current tags for the contact to identify which ones need to be removed
        const currentTags = editingContact.tags || [];
        const currentTagNames = currentTags.map(tag => tag.name);
        
        // Find tags that were removed
        const tagsToRemove = currentTags.filter(tag => !contactSelectedTags.includes(tag.name));
        
        // Remove tags that have been deleted from the selection
        for (const tag of tagsToRemove) {
          try {
            await api.tags.removeFromContact(contactId, tag.id);
            console.log('Removed tag from contact:', tag.name);
          } catch (removeErr: any) {
            console.error('Error removing tag from contact:', removeErr);
          }
        }
      } else {
        // Create new contact
        const result = await api.contacts.create(contactData);
        contactId = result.data.id;
        success = "Contact created successfully";
      }
      
      // Process tags (for both new and existing contacts)
      if (contactSelectedTags.length > 0) {
        console.log('Processing contact tags:', contactSelectedTags);
        const processedTags = await processTagInput(contactSelectedTags);
        const tagIds = processedTags.map(t => t.id);
        
        if (tagIds.length > 0) {
          try {
            // First clear existing tags if updating
            if (editingContact) {
              console.log('Replacing tags for existing contact');
            } else {
              console.log('Adding tags to new contact');
            }
            
            await api.tags.addToContact(contactId, tagIds);
            console.log('Tags added to contact successfully:', tagIds);
          } catch (tagErr: any) {
            console.error('Error adding tags to contact:', tagErr);
            success += " (Some tags may not have been added successfully)";
          }
        }
      }
      
      // Refresh contacts data
      await fetchContacts();
      closeContactModal();
    } catch (err: any) {
      console.error('Error saving contact:', err);
      error = err.message || 'Failed to save contact';
    }
  }

  // Save group function with contact management
  async function saveGroup() {
    if (!groupForm.name) {
      error = "Group name is required";
      return;
    }

    try {
      let groupId: number;
      let selectedContactIds = [...groupForm.contactIds]; // Make a copy to ensure it's not modified
      
      console.log('Before group operation, contactIds:', selectedContactIds);
      console.log('Group tags before saving:', groupForm.tags);

      if (editingGroup) {
        // Update existing group
        await api.groups.update(editingGroup.id, {
          name: groupForm.name,
          description: groupForm.description
        });
        
        groupId = editingGroup.id;
        success = "Group updated successfully";
        
        // Get current contacts in the group
        const contactsResponse = await api.groups.getContacts(groupId);
        const currentContacts = contactsResponse.data || [];
        const currentContactIds = currentContacts.map((c: any) => c.id);
        
        // Calculate which contacts to add and remove
        const contactsToAdd = selectedContactIds.filter(id => !currentContactIds.includes(id));
        const contactsToRemove = currentContactIds.filter((id:any) => !selectedContactIds.includes(id));
        
        // Process additions
        if (contactsToAdd.length > 0) {
          try {
            console.log('Adding contacts to existing group:', contactsToAdd);
            await api.groups.addContacts(groupId, contactsToAdd);
          } catch (addErr: any) {
            console.error('Error adding contacts to group:', addErr);
            success += " (Some contacts may not have been added successfully)";
          }
        }
        
        // Process removals (still one by one as the API requires)
        for (const contactId of contactsToRemove) {
          try {
            console.log('Removing contact from group:', contactId);
            await api.groups.removeContact(groupId, contactId);
          } catch (removeErr: any) {
            console.error('Error removing contact from group:', removeErr);
          }
        }
        
        // Handle tags for existing group
        // Get current tags for the group to identify which ones need to be removed
        const currentTags = editingGroup.tags || [];
        const currentTagNames = currentTags.map(tag => tag.name);
        
        // Find tags that were removed
        const tagsToRemove = currentTags.filter(tag => !groupForm.tags.includes(tag.name));
        
        // Remove tags that have been deleted from the selection
        for (const tag of tagsToRemove) {
          try {
            await api.tags.removeFromGroup(groupId, tag.id);
            console.log('Removed tag from group:', tag.name);
          } catch (removeErr: any) {
            console.error('Error removing tag from group:', removeErr);
          }
        }
      } else {
        // Create new group
        console.log('Creating new group with name:', groupForm.name);
        try {
          const result = await api.groups.create({
            name: groupForm.name,
            description: groupForm.description
          });
          
          groupId = result.data.id;
          console.log('New group created with ID:', groupId);
          success = "Group created successfully";
          
          // For a new group, add all selected contacts in bulk
          if (selectedContactIds.length > 0) {
            console.log('Adding contacts to new group:', selectedContactIds);
            try {
              await api.groups.addContacts(groupId, selectedContactIds);
              console.log('Contacts added successfully to new group!');
            } catch (contactErr: any) {
              console.error('Error adding contacts to new group:', contactErr);
              success += " (Some contacts may not have been added successfully)";
            }
          } else {
            console.log('No contacts selected for new group');
          }
        } catch (createErr: any) {
          console.error('Error creating group:', createErr);
          error = createErr.message || 'Failed to create group';
          return;
        }
      }
      
      // Process tags for the group (for both new and existing groups)
      if (groupForm.tags && groupForm.tags.length > 0) {
        console.log('Processing group tags:', groupForm.tags);
        const processedTags = await processTagInput(groupForm.tags);
        console.log('Processed tags for group:', processedTags);
        const tagIds = processedTags.map(t => t.id);
        
        if (tagIds.length > 0) {
          try {
            // First clear existing tags if updating
            if (editingGroup) {
              console.log('Replacing tags for existing group');
            } else {
              console.log('Adding tags to new group');
            }
            
            await api.tags.addToGroup(groupId, tagIds);
            console.log('Tags added to group successfully:', tagIds);
          } catch (tagErr: any) {
            console.error('Error adding tags to group:', tagErr);
            success += " (Some tags may not have been added successfully)";
          }
        }
      }
      
      // Refresh data and close modal
      await fetchGroups();
      closeGroupModal();
    } catch (err: any) {
      console.error('Error in saveGroup:', err);
      error = err.message || 'Failed to save group';
    }
  }

  // Delete group function
  async function deleteGroup(groupId: number) {
    if (!confirm("Are you sure you want to delete this group?")) return;
    
    try {
      await api.groups.delete(groupId);
      success = "Group deleted successfully";
      groups = groups.filter(g => g.id !== groupId);
    } catch (err: any) {
      console.error('Error deleting group:', err);
      error = err.message || 'Failed to delete group';
    }
  }

  // Delete contact function
  async function deleteContact(contactId: number) {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      await api.contacts.delete(contactId);
      success = "Contact deleted successfully";
      contacts = contacts.filter(c => c.id !== contactId);
    } catch (err: any) {
      console.error('Error deleting contact:', err);
      error = err.message || 'Failed to delete contact';
    }
  }

  // Function to open message modal with a contact
  function openMessageModal(contact: Contact) {
    selectedContactForMessage = contact;
    selectedGroupForMessage = null;
    isMessageModalOpen = true;
  }

  // Function to open message modal with a group
  function openGroupMessageModal(group: Group) {
    console.log('Opening group message modal with group:', group);
    selectedGroupForMessage = group;
    selectedContactForMessage = null;
    isMessageModalOpen = true;
    console.log('Selected group for message:', selectedGroupForMessage);
  }

  // Function to close message modal
  function closeMessageModal() {
    isMessageModalOpen = false;
    selectedContactForMessage = null;
    selectedGroupForMessage = null;
  }

  // Handle message added event
  function handleMessageAdded() {
    success = "Message sent successfully!";
    closeMessageModal();
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
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#B8BCBC]">General</h1>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128L90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#443C68] font-medium">Contacts</h1>
    </div>

    <!-- Headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Contacts</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Group and tag recipients for targeted messaging.
      </h1>
    </div>

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

    <!-- Add Buttons -->
    <div class="flex justify-end gap-4">
      <button class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-2xl cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200"
        on:click={() => openContactModal()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#443C68" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
        </svg>
        <p class="text-xs text-[#443C68] font-semibold">Contact</p>
      </button>
      
      <button class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-2xl cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200"
        on:click={() => openGroupModal()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#443C68" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
        </svg>
        <p class="text-xs text-[#443C68] font-semibold">Group</p>
      </button>
    </div>
  </div>

  <!-- Loading state -->
  {#if loading}
    <div class="p-6 text-center">
      <p>Loading contacts and groups...</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <!-- Individual Contacts Column (now first) -->
      <div class="flex flex-col gap-6">
        <h2 class="text-lg font-semibold text-[#443C68]">Individual Contacts</h2>
        
        {#if contacts.length === 0}
          <div class="text-center p-4 border border-[#EBEBE8] rounded-lg">
            <p class="text-sm text-[#818181]">No contacts found. Add a new contact to get started.</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-240px)]">
            {#each contacts as contact (contact.id)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div 
                class="border border-[#EBEBE8] p-4 rounded-xl bg-white hover:shadow-sm transition-all duration-200 cursor-pointer relative"
                on:click={() => openMessageModal(contact)}
              >
                <div class="flex justify-between items-start">
                  <!-- Contact Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-[#07404B]/10 flex items-center justify-center text-[#07404B] font-medium text-xs">
                        {contact.first_name[0]}{contact.last_name[0]}
                      </div>
                      <div class="truncate">
                        <h3 class="font-semibold text-[#443C68] truncate text-sm">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <p class="text-xs text-[#818181]">{contact.phone_number}</p>
                      </div>
                    </div>
                    {#if contact.email}
                      <p class="text-xs text-[#818181] mt-1.5 truncate pl-10">{contact.email}</p>
                    {/if}
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 ml-2 shrink-0">
                    <button 
                      class="w-7 h-7 flex items-center justify-center bg-[#D7813A]/20 rounded-lg hover:bg-[#D7813A]/30 transition-colors"
                      aria-label="edit contact"
                      on:click|stopPropagation={() => openContactModal(contact)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#D7813A" viewBox="0 0 256 256">
                        <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                      </svg>
                    </button>
                    <button 
                      class="w-7 h-7 flex items-center justify-center bg-[#E16F64]/20 rounded-lg hover:bg-[#E16F64]/30 transition-colors"
                      aria-label="delete contact"
                      on:click|stopPropagation={() => deleteContact(contact.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#E16F64" viewBox="0 0 256 256">
                        <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Tags -->
                {#if contact.tags && contact.tags.length > 0}
                  <div class="flex flex-wrap gap-1.5 mt-3">
                    {#each contact.tags as tag}
                      <span class="text-xs px-2 py-1 bg-[#07404B]/10 text-[#07404B] rounded-lg">
                        {tag.name}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Groups List Column (now second) -->
      <div class="flex flex-col gap-6">
        <h2 class="text-lg font-semibold text-[#443C68]">Groups</h2>
        
        {#if groups.length === 0}
          <div class="text-center p-4 border border-[#EBEBE8] rounded-lg">
            <p class="text-sm text-[#818181]">No groups found. Create a new group to get started.</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100vh-240px)]">
            {#each groups as group (group.id)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="border border-[#EBEBE8] p-4 rounded-xl bg-white hover:shadow-sm transition-all duration-200 relative cursor-pointer"
                  on:click={() => openGroupMessageModal(group)}>
               
                <!-- Group Header -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1 min-w-0 pr-4">
                    <h3 class="text-base font-semibold text-[#443C68] truncate">{group.name}</h3>
                    {#if group.description}
                      <p class="text-xs text-[#818181] mt-0.5 truncate">{group.description}</p>
                    {/if}
                  </div>
                  <div class="flex gap-2 shrink-0">
                    <button 
                      class="w-8 h-8 flex items-center justify-center bg-[#D7813A]/20 rounded-lg hover:bg-[#D7813A]/30 transition-colors" 
                      aria-label="edit group"
                      on:click|stopPropagation={() => openGroupModal(group)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#D7813A" viewBox="0 0 256 256">
                        <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                      </svg>
                    </button>
                    <button 
                      class="w-8 h-8 flex items-center justify-center bg-[#E16F64]/20 rounded-lg hover:bg-[#E16F64]/30 transition-colors" 
                      aria-label="delete group"
                      on:click|stopPropagation={() => deleteGroup(group.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#E16F64" viewBox="0 0 256 256">
                        <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <!-- Recipients Section -->
                  <div>
                    <h4 class="text-xs font-medium text-[#818181] mb-1.5">Recipients</h4>
                    <div class="flex flex-wrap gap-1.5">
                      {#if group.contacts && group.contacts.length > 0}
                        {#each group.contacts as contact}
                          <span class="text-xs px-2 py-1 bg-[#818181]/10 text-[#443C68] rounded-lg whitespace-nowrap">
                            {contact.phone_number}
                          </span>
                        {/each}
                      {:else}
                        <p class="text-xs text-[#818181]">No contacts in this group</p>
                      {/if}
                    </div>
                  </div>

                  <!-- Tags Section -->
                  {#if group.tags && group.tags.length > 0}
                    <div>
                      <h4 class="text-xs font-medium text-[#818181] mb-1.5">Tags</h4>
                      <div class="flex flex-wrap gap-1.5">
                        {#each group.tags as tag}
                          <span class="text-xs px-2 py-1 bg-[#07404B]/10 text-[#07404B] rounded-lg whitespace-nowrap">
                            {tag.name}
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<!-- Group Modal Form -->
<Modal isOpen={isGroupModalOpen} title={editingGroup ? 'Edit Group' : 'Create Group'} on:close={closeGroupModal}>
  <form class="flex flex-col gap-4" on:submit|preventDefault={saveGroup}>
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
    
    <!-- Group Name -->
    <div>
      <p class="block text-xs text-[#818181]">Group Name *</p>
      <input 
        type="text" 
        bind:value={groupForm.name} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter group name" 
        required
      />
    </div>

    <!-- Description -->
    <div>
      <p class="block text-xs text-[#818181]">Description (optional)</p>
      <textarea 
        bind:value={groupForm.description} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter group description"
      ></textarea>
    </div>

    <!-- Contacts selection -->
    <div>
      <p class="block text-xs text-[#818181]">Select Contacts</p>
      {#if contacts.length > 0}
        <div class="mt-2 max-h-40 overflow-y-auto p-2 border border-[#EBEBE8] rounded-lg">
          {#each contacts as contact}
            <div class="flex items-center gap-2 p-1">
              <input 
                type="checkbox" 
                id={`contact-${contact.id}`} 
                value={contact.id} 
                checked={groupForm.contactIds.includes(contact.id)}
                on:change={(e) => handleContactCheckboxChange(e, contact.id)} 
              />
              <label for={`contact-${contact.id}`} class="text-sm text-[#443C68]">
                {contact.first_name} {contact.last_name} ({contact.phone_number})
              </label>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center p-2 text-sm text-[#818181]">
          No contacts available. Please add contacts first.
        </div>
      {/if}
    </div>

    <!-- Tags -->
    <div>
      <p class="block text-xs text-[#818181]">Tags</p>
      <div class="flex flex-wrap gap-2 mt-1 mb-2">
        {#each groupForm.tags as tag}
          <div class="flex items-center gap-1 text-xs p-2 bg-[#07404B]/10 text-[#07404B] rounded-lg">
            {tag}
            <button type="button" on:click={() => removeTagFromGroup(tag)} class="ml-1 text-[#07404B] hover:text-[#E16F64]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        {/each}
      </div>
      <div class="flex gap-2">
        <input 
          type="text" 
          class="w-full p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
          placeholder="Enter a tag name" 
          bind:value={newTagInput}
          on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToGroup())}
        />
        <button 
          type="button"
          class="p-3 bg-[#07404B]/10 text-[#07404B] rounded-lg"
          on:click={addTagToGroup}
        >
          Add
        </button>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center gap-2">
      <button 
        type="button"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out" 
        on:click={closeGroupModal}
      >   
        Cancel
      </button>
      <button 
        type="submit"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out"
      >   
        {editingGroup ? 'Update Group' : 'Create Group'}
      </button>
    </div>
  </form>
</Modal>

<!-- Contact Modal Form -->
<Modal isOpen={isContactModalOpen} title={editingContact ? 'Edit Contact' : 'Add Contact'} on:close={closeContactModal}>
  <form class="flex flex-col gap-4" on:submit|preventDefault={saveContact}>
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
    
    <!-- First Name -->
    <div>
      <p class="block text-xs text-[#818181]">First Name *</p>
      <input 
        type="text" 
        bind:value={contactForm.first_name} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter first name" 
        required
      />
    </div>

    <!-- Last Name -->
    <div>
      <p class="block text-xs text-[#818181]">Last Name *</p>
      <input 
        type="text" 
        bind:value={contactForm.last_name} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter last name" 
        required
      />
    </div>

    <!-- Phone Number -->
    <div>
      <p class="block text-xs text-[#818181]">Phone Number *</p>
      <input 
        type="text" 
        bind:value={contactForm.phone_number} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter phone number" 
        required
      />
    </div>

    <!-- Email -->
    <div>
      <p class="block text-xs text-[#818181]">Email (optional)</p>
      <input 
        type="email" 
        bind:value={contactForm.email} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter email address" 
      />
    </div>

    <!-- Tags -->
    <div>
      <p class="block text-xs text-[#818181]">Tags</p>
      <div class="flex flex-wrap gap-2 mt-1 mb-2">
        {#each contactSelectedTags as tag}
          <div class="flex items-center gap-1 text-xs p-2 bg-[#07404B]/10 text-[#07404B] rounded-lg">
            {tag}
            <button type="button" on:click={() => removeTagFromContact(tag)} class="ml-1 text-[#07404B] hover:text-[#E16F64]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        {/each}
      </div>
      <div class="flex gap-2">
        <input 
          type="text" 
          class="w-full p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
          placeholder="Enter a tag name" 
          bind:value={contactNewTagInput}
          on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToContact())}
        />
        <button 
          type="button"
          class="p-3 bg-[#07404B]/10 text-[#07404B] rounded-lg"
          on:click={addTagToContact}
        >
          Add
        </button>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center gap-2">
      <button 
        type="button"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out" 
        on:click={closeContactModal}
      >   
            Cancel
        </button>
      <button 
        type="submit"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out"
      >   
        {editingContact ? 'Update Contact' : 'Add Contact'}
        </button>
    </div>
  </form>
</Modal>

<!-- AddMessage component -->
<AddMessage 
  isOpen={isMessageModalOpen} 
  on:close={closeMessageModal}
  on:messageAdded={handleMessageAdded}
  defaultPhoneNumber={selectedContactForMessage?.phone_number}
  defaultSelectedGroup={selectedGroupForMessage ? selectedGroupForMessage.id.toString() : undefined}
/>

