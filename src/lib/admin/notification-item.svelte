<script lang="ts">
  import Modal from "../general/modal.svelte";

  let isModalOpen = false;

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }
</script>

<!-- table head -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2"
>
  <p class="text-xs text-[#818181] pl-2 w-[5%]">001</p>
  <!-- username -->
  <div
    class="text-sm text-[#818181] font-medium pl-2 w-[25%] flex items-center gap-4"
  >
    <!-- avatar -->
    <div
      class="h-10 w-10 border-1 border-[#443c6846] rounded-full text-sm flex items-center justify-center font-medium text-[#443C68] bg-[#443c6836]"
    >
      A
    </div>
    <!-- username and email -->
    <div class="text-xs">
      <p class="text-[#443C68] font-medium">andrei.mayo</p>
      <p class="text-[#A5A4A1]">andrei.mayo@gmail.com</p>
    </div>
  </div>
  <!-- message -->
  <div
    class="text-xs text-[#443C68] w-[25%] font-medium p-3 rounded-lg bg-[#ebebe8]/50 truncate"
  >
    Reminder. You have a meeting with the client at 3:00 PM. Please be on time.
  </div>
  <div
    class="text-xs text-[#6C9B7D] font-medium w-[15%] bg-[#DBEDDB]/50 p-3 text-center rounded-lg ml-10"
  >
    Sent
  </div>
  <h1 class="text-xs text-[#818181] w-[20%] pl-10">
    May 04, 2025 11:26 AM
  </h1>
  <button on:click={openModal}
    class="text-xs text-[#818181] border-1 border-[#ebebe8] font-medium w-[10%] p-3 rounded-lg flex items-center gap-1 justify-center bg-[#ffffff]/10 cursor-pointer hover:bg-[#ebebe8]/40 transition duration-200 ease-in-out"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#818181" viewBox="0 0 256 256">
        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
    </svg>
    <p class="text-[#818181]">View More</p>
  </button>
</div>

<Modal bind:isOpen={isModalOpen} title="Notification ID" on:close={closeModal}>
    <div>
        <p class="flex justify-between items-center text-xs text-[#818181]">
            May 04, 2025 11:26 AM
            <span class="text-center text-xs p-2 px-8 text-[#6C9B7D] bg-[#DBEDDB]/50 rounded-lg">Sent</span>
        </p>
        <div class="flex items-center gap-4 mt-4">
            <div class="h-10 w-10 border-1 border-[#443c6846] rounded-full text-sm flex items-center justify-center font-medium text-[#443C68] bg-[#443c6836]">
                A
            </div>
            <div>
                <p class="text-xs text-[#443C68] font-medium">andrei.mayo</p>
                <p class="text-xs text-[#A5A4A1]">andrei.mayo@gmail.com</p>
            </div>
        </div>
        <div class="flex items-center gap-2 mt-4">
            <p class="text-xs p-2 text-[#07404B] bg-[#07404B]/10 rounded-lg">Appointment</p>
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
            <button class="flex items-center gap-2 mt-15 w-full justify-center text-xs text-[#E16F64] border-1 border-[#E16F64]/50 font-medium p-3 rounded-lg bg-[#E16F64]/10 cursor-pointer hover:bg-[#E16F64]/20 transition duration-200 ease-in-out">   
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E16F64" viewBox="0 0 256 256">
                <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
            </svg>
            <p>Delete Notification</p>
        </button>
</Modal>
