<script lang="ts">
  import Message from "$lib/user/message.svelte";
  import AddMessage from "$lib/user/add-message.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let isAddModalOpen = false;
  let messageComponent:any;

  function openAddModal() {
    isAddModalOpen = true;
  }

  function closeAddModal() {
    isAddModalOpen = false;
  }

  // Handle messageAdded event from AddMessage component
  function handleMessageAdded() {
    console.log("Message added event received, refreshing messages");
    if (messageComponent) {
      messageComponent.fetchMessages();
    }
  }

  function navigateToScheduled() {
    goto("/user/messages/scheduled");
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
        <h1 class="text-sm text-[#443C68] font-medium">Notifications</h1>
      </div>
  
      <!-- headline -->
      <div>
        <h1 class="text-2xl font-bold text-[#443C68]">Notifications</h1>
        <h1 class="text-sm text-[#A5A4A1]">
            Create, schedule, and manage your SMS messages all in one place.
        </h1>
      </div>
    </div>

    <!-- notifications -->
    <div class="p-6 w-full">
      <div class="flex gap-2 justify-end items-center mb-4">
        <button on:click={navigateToScheduled} class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-lg cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200 mr-2" >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#443C68" viewBox="0 0 256 256" >
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-48-64a8,8,0,0,1-8,8H128v32a8,8,0,0,1-16,0V152H96a8,8,0,0,1,0-16h16V120a8,8,0,0,1,16,0v16h24A8,8,0,0,1,160,144Z"></path>
          </svg>
          <p class="text-xs text-[#443C68] font-semibold">Schedule Notification</p>
        </button>
        <button on:click={openAddModal} class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-lg cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200" >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#443C68" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
          </svg>
          <p class="text-xs text-[#443C68] font-semibold">Notification</p>
        </button>
      </div>
    </div>

    <div class="h-[580px] overflow-y-auto px-6 scroll-smooth">
      <!-- messages -->
      <Message bind:this={messageComponent} />
    </div>

</div>


<AddMessage isOpen={isAddModalOpen} on:close={closeAddModal} on:messageAdded={handleMessageAdded} /> 