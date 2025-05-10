<script>
  import Modal from "$lib/general/modal.svelte";
  export let isOpen = false;

  // Dispatch the "close" event to notify the parent component
  function closeModal() {
    const event = new CustomEvent("close");
    dispatchEvent(event);
  }
</script>

<Modal isOpen={isOpen} title="Add Notification" on:close={closeModal}>
  <form class="flex flex-col gap-4">
    <!-- Title -->
    <div>
      <p class="block text-xs text-[#818181]">Title</p>
      <input
        type="text"
        class="w-full mt-1 p-2 border text-sm border-[#EBEBE8] rounded-lg focus:outline-none"
        placeholder="Enter notification title"
      />
    </div>

    <!-- Message -->
    <div>
      <p class="block text-xs text-[#818181]">Message</p>
      <textarea
        class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm"
        placeholder="Enter notification message"
      ></textarea>
    </div>

    <!-- Tags -->
    <div>
      <p class="block text-xs text-[#818181]">Tags</p>
      <input
        type="text"
        class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm"
        placeholder="Enter tags (comma-separated)"
      />
    </div>

    <!-- Schedule -->
    <div class="flex gap-4">
      <div class="flex-1">
        <p class="block text-xs text-[#818181]">Date</p>
        <input
          type="date"
          class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm text-[#443C68]"
        />
      </div>
      <div class="flex-1">
        <p class="block text-xs text-[#818181]">Time</p>
        <input
          type="time"
          class="w-full mt-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm text-[#443C68]"
        />
      </div>
    </div>

    <!-- Recipients -->
    <div>
      <p class="block text-xs text-[#818181]">Recipient</p>
      <div class="flex flex-col gap-3 mt-2">
        
          <div class="flex items-center gap-2">
            <input
              type="text"
              class="flex-1 p-2 border border-[#EBEBE8] rounded-lg focus:outline-none text-sm"
              placeholder="Enter recipient number"
            />

          </div>
     
        <button
          type="button"
          class="text-xs text-[#6C9B7D] px-4 py-3 rounded-lg border border-[#6C9B7D] bg-[#6C9B7D]/10 hover:bg-[#6C9B7D]/10 cursor-pointer transition duration-200 ease-in-out"
        >
          Add Recipient
        </button>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-between items-center gap-2">
        <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out">   
            Cancel
        </button>
        <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out">   
            Create Notification
        </button>
    </div>
  </form>
</Modal>