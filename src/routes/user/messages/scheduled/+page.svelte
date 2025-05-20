<script lang="ts">
  import ScheduledMessage from "$lib/user/scheduled-message.svelte";
  import AddScheduledMessage from "$lib/user/add-scheduled-message.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let isAddModalOpen = false;
  let scheduledMessageComponent: any;
  let defaultContent = "";
  let defaultSelectedContact = "";
  let defaultSelectedGroup = "";

  function openAddModal() {
    isAddModalOpen = true;
  }

  function closeAddModal() {
    isAddModalOpen = false;
    // Reset default values
    defaultContent = "";
    defaultSelectedContact = "";
    defaultSelectedGroup = "";
  }

  // Navigate back to main messages page
  function navigateToMessages() {
    goto("/user/messages");
  }

  // Handle messageAdded event from AddScheduledMessage component
  function handleMessageAdded() {
    console.log("Message added event received, refreshing scheduled messages");
    if (scheduledMessageComponent) {
      scheduledMessageComponent.fetchScheduledMessages();
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
          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
        </svg>
        <h1 class="text-sm text-[#B8BCBC]">General</h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
        </svg>
        <button class="text-sm text-[#B8BCBC] hover:underline cursor-pointer" on:click={navigateToMessages} >Notifications</button>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
          <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
        </svg>
        <h1 class="text-sm text-[#443C68] font-medium">Schedule Notification</h1>
      </div>
  
      <!-- headline -->
      <div>
        <h1 class="text-2xl font-bold text-[#443C68]">Schedule Notification</h1>
        <h1 class="text-sm text-[#A5A4A1]">
            View and manage all your scheduled notifications in one place.
        </h1>
      </div>
    </div>

    <!-- notifications -->
    <div class="p-6 w-full">
      <div class="flex gap-2 justify-end items-center mb-4">
        <button on:click={navigateToMessages} class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-lg cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200 mr-2" >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#443C68" viewBox="0 0 256 256">
          <path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path>
        </svg>
          <p class="text-xs text-[#443C68] font-semibold">All Notification</p>
        </button>
        <button on:click={openAddModal} class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-lg cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200" >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#443C68" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
          </svg>
          <p class="text-xs text-[#443C68] font-semibold">Notification</p>
        </button>
      </div>
    </div>

    <div class="h-[580px] overflow-y-auto px-6">
      <!-- messages -->
      <ScheduledMessage bind:this={scheduledMessageComponent} />
    </div>

</div>

<AddScheduledMessage 
  isOpen={isAddModalOpen} 
  defaultContent={defaultContent}
  defaultSelectedContact={defaultSelectedContact}
  defaultSelectedGroup={defaultSelectedGroup}
  on:close={closeAddModal} 
  on:messageAdded={handleMessageAdded} 
/> 