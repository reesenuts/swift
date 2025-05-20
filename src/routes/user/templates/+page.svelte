<script lang="ts">
  import Modal from "$lib/general/modal.svelte";
  import { api } from "$lib/services/api.js";
  import { onMount } from "svelte";
  import AddMessage from "$lib/user/add-message.svelte";

  // Template interface
  interface Template {
    id: number;
    name: string;
    content: string;
    created_at?: string;
    updated_at?: string;
  }

  // Component state
  let templates: Template[] = [];
  let loading = true;
  let error: string | null = null;
  let success: string | null = null;

  // Modal states
  let isTemplateModalOpen = false;
  let isMessageModalOpen = false;
  let editingTemplate: Template | null = null;
  let selectedTemplateForMessage: Template | null = null;

  // Form data for new/edit template
  let templateForm = {
    name: "",
    content: ""
  };

  // Fetch data on component mount
  onMount(async () => {
    await fetchTemplates();
  });

  // Fetch templates from API
  async function fetchTemplates() {
    try {
      const response = await api.templates.getAll();
      console.log(response)
      templates = response.data || [];
      loading = false;
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      error = err.message || 'Failed to load templates';
      loading = false;
    }
  }

  // Template Modal Functions
  function openTemplateModal(template: Template | null = null) {
    success = null;
    error = null;
    
    if (template) {
      editingTemplate = template;
      templateForm = {
        name: template.name,
        content: template.content
      };
    } else {
      editingTemplate = null;
      resetTemplateForm();
    }
    
    isTemplateModalOpen = true;
  }

  function closeTemplateModal() {
    isTemplateModalOpen = false;
    resetTemplateForm();
  }

  function resetTemplateForm() {
    templateForm = {
      name: "",
      content: ""
    };
  }

  // Save template function
  async function saveTemplate() {
    if (!templateForm.name || !templateForm.content) {
      error = "Template name and content are required";
      return;
    }

    try {
      const templateData = {
        name: templateForm.name,
        content: templateForm.content
      };

      if (editingTemplate) {
        // Update existing template
        await api.templates.update(editingTemplate.id, templateData);
        success = "Template updated successfully";
      } else {
        // Create new template
        await api.templates.create(templateData);
        success = "Template created successfully";
      }
      
      // Refresh templates data
      await fetchTemplates();
      closeTemplateModal();
    } catch (err: any) {
      console.error('Error saving template:', err);
      error = err.message || 'Failed to save template';
    }
  }

  // Delete template function
  async function deleteTemplate(templateId: number) {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      await api.templates.delete(templateId);
      success = "Template deleted successfully";
      templates = templates.filter(t => t.id !== templateId);
    } catch (err: any) {
      console.error('Error deleting template:', err);
      error = err.message || 'Failed to delete template';
    }
  }

  function openMessageModal(template: Template) {
    selectedTemplateForMessage = template;
    isMessageModalOpen = true;
  }

  function closeMessageModal() {
    isMessageModalOpen = false;
    selectedTemplateForMessage = null;
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
      <h1 class="text-sm text-[#443C68] font-medium">Templates</h1>
    </div>

    <!-- Headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Templates</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Save and reuse your standard SMS messages.
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

    <!-- Add Template Button -->
    <div class="flex justify-end">
      <button 
        class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-2xl cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200"
        on:click={() => openTemplateModal()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#443C68" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
        </svg>
        <p class="text-xs text-[#443C68] font-semibold">Template</p>
      </button>
    </div>
  </div>

  <!-- Loading state -->
  {#if loading}
    <div class="p-6 text-center">
      <p>Loading templates...</p>
    </div>
  {:else}
    <!-- Templates List -->
    <div class="p-6 flex flex-col gap-6">
      {#if templates.length === 0}
        <div class="text-center p-4 border border-[#EBEBE8] rounded-lg">
          <p class="text-sm text-[#818181]">No templates found. Create a new template to get started.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each templates as template (template.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div 
              class="border border-[#EBEBE8] p-6 rounded-2xl flex justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors duration-200"
              on:click={() => openMessageModal(template)}
            >
              <div class="flex flex-col gap-2 justify-between w-3/4">
                <h1 class="text-lg font-semibold mb-2 text-[#443C68]">{template.name}</h1>
                <p class="text-sm text-[#818181] line-clamp-4">{template.content}</p>
              </div>
              <div class="flex flex-col gap-2">
                <button 
                  class="w-10 h-10 flex items-center justify-center bg-[#D7813A]/20 rounded-lg" 
                  aria-label="edit button"
                  on:click|stopPropagation={() => openTemplateModal(template)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D7813A" viewBox="0 0 256 256">
                    <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                  </svg>
                </button>
                <button 
                  class="w-10 h-10 flex items-center justify-center bg-[#E16F64]/20 rounded-lg"
                  aria-label="delete button"
                  on:click|stopPropagation={() => deleteTemplate(template.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#E16F64" viewBox="0 0 256 256">
                    <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Template Modal Form -->
<Modal isOpen={isTemplateModalOpen} title={editingTemplate ? 'Edit Template' : 'Create Template'} on:close={closeTemplateModal}>
  <form class="flex flex-col gap-4" on:submit|preventDefault={saveTemplate}>
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
    
    <!-- Template Name -->
    <div>
      <p class="block text-xs text-[#818181]">Template Name *</p>
      <input 
        type="text" 
        bind:value={templateForm.name} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" 
        placeholder="Enter template name" 
        required
      />
    </div>

    <!-- Template Content -->
    <div>
      <p class="block text-xs text-[#818181]">Message Content *</p>
      <textarea 
        bind:value={templateForm.content} 
        class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm h-40" 
        placeholder="Enter message content"
        required
      ></textarea>
      <p class="text-xs text-[#818181] mt-1">
        You can use variables like {'{first_name}'}, {'{last_name}'}, etc. which will be replaced with contact information when sending.
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center gap-2">
      <button 
        type="button"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out" 
        on:click={closeTemplateModal}
      >   
        Cancel
      </button>
      <button 
        type="submit"
        class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out"
      >   
        {editingTemplate ? 'Update Template' : 'Create Template'}
      </button>
    </div>
  </form>
</Modal>

<AddMessage 
  isOpen={isMessageModalOpen} 
  on:close={closeMessageModal} 
  defaultTemplateId={selectedTemplateForMessage?.id.toString()}
  defaultContent={selectedTemplateForMessage?.content}
/>