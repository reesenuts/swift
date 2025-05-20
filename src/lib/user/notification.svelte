<script>
  import Modal from "$lib/general/modal.svelte";

  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<div class="">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="p-4 border border-[#EBEBE8] rounded-lg mb-4 flex justify-between items-center cursor-pointer"
    on:click={openModal}
  >
    <div>
      <h2 class="text-lg font-semibold text-[#443C68]">
        Payment Confirmation
      </h2>
      <p class="text-sm text-[#818181]">Your payment of $250 has been successfully processed.</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <span class="text-xs text-[#07404B] bg-[#07404B]/10 px-2 py-1 rounded-lg">Payment</span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-xs text-[#6C9B7D] font-medium p-4 px-8 text-center rounded-lg bg-[#DBEDDB]/50">
        Done
      </p>
    </div>
  </div>
</div>

<Modal isOpen={isModalOpen} title="Payment Confirmation" on:close={closeModal}>
  <div>
        <p class="flex justify-between items-center text-xs text-[#818181]">
            May 04, 2025 11:26 AM
            <span class="text-center text-xs p-2 px-8 text-[#6C9B7D] bg-[#DBEDDB]/50 rounded-lg">Sent</span>
        </p>
        <div class="flex items-center gap-2 mt-8">
            <p class="text-xs text-[#818181]">Tag: <span class="text-xs p-2 text-[#07404B] bg-[#07404B]/10 rounded-lg">Payment</span></p>
        </div>
        <div>
            <p class="text-xs text-[#818181] mt-8">Message</p>
            <div class="text-xs text-[#443C68] font-medium p-3 mt-2 rounded-lg bg-[#ebebe8]/50">
                Reminder. You have a meeting with the client at 3:00 PM. Please be on time. 
            </div>
        </div>
        <div class="flex flex-col gap-2 mt-10">
            <p class="text-xs text-[#818181]">Recipient/s</p>
            <div class="flex flex-row gap-2">
                <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">+639123456789</p>
                <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">+639123456789</p>
                <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">+639123456789</p>
                <p class="text-xs text-[#443C68] bg-[#ebebe8]/50 p-2 rounded-lg font-medium">+639123456789</p>
            </div>
        </div>
    </div>
  <div class="flex justify-between items-center gap-2">
    <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out">   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E16F64" viewBox="0 0 256 256">
            <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
        </svg>
        <p>Delete Notification</p>
    </button>
    <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out">   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6C9B7D" viewBox="0 0 256 256">
            <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
        </svg>
        <p>Use Template</p>
    </button>
  </div>
</Modal>