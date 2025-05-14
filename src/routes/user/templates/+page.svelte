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
      <h1 class="text-sm text-[#443C68] font-medium">Templates</h1>
    </div>

    <!-- Headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Templates</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Save and reuse standard message formats.
      </h1>
    </div>
  </div>
  <div class="p-6"> 
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
        Sent
      </p>
    </div>
  </div>
  </div>
</div>

<Modal isOpen={isModalOpen} title="Payment Confirmation" on:close={closeModal}>
  <div>
        <div>
            <p class="text-xs text-[#818181] mt-8">Message</p>
            <div class="text-xs text-[#443C68] font-medium p-3 mt-2 rounded-lg bg-[#ebebe8]/50">
                Reminder. You have a meeting with the client at 3:00 PM. Please be on time. 
            </div>
        </div>
    </div>
  <div class="flex justify-between items-center gap-2">
    <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out">   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E16F64" viewBox="0 0 256 256">
            <path d="M178,40a61.6,61.6,0,0,0-43.84,18.16L128,64.32l-6.16-6.16A62,62,0,0,0,16,102c0,70,103.79,126.67,108.21,129a8,8,0,0,0,7.58,0C136.21,228.67,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102a46,46,0,0,1,78.53-32.53l6.16,6.16L106.34,86a8,8,0,0,0,0,11.31l24.53,24.53-16.53,16.52a8,8,0,0,0,11.32,11.32l22.18-22.19a8,8,0,0,0,0-11.31L123.31,91.63l22.16-22.16A46,46,0,0,1,224,102C224,155.61,146.24,204.15,128,214.8Z"></path>
        </svg>
        <p>Remove Template</p>
    </button>
    <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#6C9B7D] border-1 border-[#6C9B7D]/50 font-medium p-3 rounded-lg bg-[#6C9B7D]/10 cursor-pointer hover:bg-[#6C9B7D]/20 transition duration-200 ease-in-out">   
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6C9B7D" viewBox="0 0 256 256">
            <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
        </svg>
        <p>Use Template</p>
    </button>
  </div>
</Modal>

