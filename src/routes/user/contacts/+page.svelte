<script lang="ts">
  import Modal from "$lib/general/modal.svelte";

  let isModalOpen = false;

  let newGroup = {
    name: "",
    recipients: [""],
    tags: [""],
  };

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    resetForm();
  }

  function resetForm() {
    newGroup = {
      name: "",
      recipients: [""],
      tags: [""],
    };
  }

  function saveGroup() {
    console.log("Group Saved:", newGroup);
    closeModal();
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
      <h1 class="text-sm text-[#443C68] font-medium">Contacts</h1>
    </div>

    <!-- Headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Contacts</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Group and tag recipients for targeted messaging.
      </h1>
    </div>

    <!-- Add Group Button -->
    <div class="flex justify-end">
      <button class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-2xl cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200"
        on:click={openModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#443C68" viewBox="0 0 256 256">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
        </svg>
        <p class="text-xs text-[#443C68] font-semibold">Group</p>
      </button>
    </div>
  </div>
  <div class="p-6">
    <div class="border border-[#EBEBE8] p-6 rounded-2xl flex justify-between">
      <div class="flex flex-col gap-2 justify-between">
        <!-- group name -->
        <h1 class="text-lg font-semibold mb-3 text-[#443C68]">Software Engineering 2 | BSCS 3B</h1>
        <!-- recipients -->
        <p class="text-xs text-[#818181]">Recipients</p>
        <div class="flex gap-2">
          <p class="text-xs p-2 bg-[#818181]/10 text-[#443C68] rounded-lg">+639811879457</p>
          <p class="text-xs p-2 bg-[#818181]/10 text-[#443C68] rounded-lg">+639811879457</p>
          <p class="text-xs p-2 bg-[#818181]/10 text-[#443C68] rounded-lg">+639811879457</p>
        </div>
        <!-- tags -->
        <p class="text-xs text-[#818181] mt-3">Tags</p>
        <div class="flex gap-2">
          <p class="text-xs p-2 bg-[#07404B]/10 text-[#07404B] rounded-lg">BSCS 3B</p>
          <p class="text-xs p-2 bg-[#07404B]/10 text-[#07404B] rounded-lg">CSP322A/L</p>
          <p class="text-xs p-2 bg-[#07404B]/10 text-[#07404B] rounded-lg">40325/40326</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <button class="w-14 h-10 flex items-center justify-center bg-[#D7813A]/20 rounded-lg" aria-label="edit button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#D7813A" viewBox="0 0 256 256">
            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
          </svg>
        </button>
        <button class="w-14 h-10 flex items-center justify-center bg-[#E16F64]/20 rounded-lg" aria-label="delete button">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="20" fill="#E16F64" viewBox="0 0 256 256">
            <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Form -->
<Modal isOpen={isModalOpen} title="Create Group" on:close={closeModal}>
  <form class="flex flex-col gap-4">
    <!-- Group Name -->
    <div>
      <p class="block text-xs text-[#818181]">Group Name</p>
      <input type="text" class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" placeholder="Enter group name" />
    </div>

    <!-- Recipients -->
    <div>
      <p class="block text-xs text-[#818181]">Recipients</p>
      <input type="text" class="w-full mt-1 p-3 border text-[#443C68] border-[#EBEBE8] rounded-lg focus:outline-none text-sm" placeholder="Enter recipient number (comma-separated)" />
    </div>

    <!-- Tags -->
    <div>
      <p class="block text-xs text-[#818181]">Tags</p>
      <input type="text" class="w-full mt-1 text-[#443C68] p-3 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm" placeholder="Enter tags (comma-separated)" />
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center gap-2">
        <button class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out" on:click={closeModal}>   
            Cancel
        </button>
        <button class="flex items-center gap-2 mt-10 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out" on:click={saveGroup}>   
            Create Group
        </button>
    </div>
  </form>
</Modal>

