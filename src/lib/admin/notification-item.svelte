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
  on:click={openModal}
  class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2 cursor-pointer hover:bg-[#f9f9f9] transition-colors"
>
  <p class="text-xs text-[#818181] font-medium pl-2 w-[5%]">001</p>
  <!-- username -->
  <div
    class="text-sm text-[#818181] font-medium pl-2 w-[25%] flex items-center gap-4"
  >
    <!-- avatar -->
    <div
      class="h-10 w-10 border-1 border-[#443c6846] rounded-full text-sm flex items-center justify-center font-semibold text-[#443C68] bg-[#443c6836]"
    >
      A
    </div>
    <!-- username and email -->
    <div class="text-xs">
      <p class="text-[#443C68] font-semibold">andrei.mayo</p>
      <p class="text-[#A5A4A1]">andrei.mayo@gmail.com</p>
    </div>
  </div>
  <!-- message -->
  <div
    class="text-xs text-[#443C68] w-[25%] font-medium p-3 rounded-lg bg-[#443c681c] truncate"
  >
    Reminder. You have a meeting with the client at 3:00 PM. Please be on time.
  </div>
  <div
    class="text-xs text-[#6C9B7D] font-medium w-[15%] bg-[#DBEDDB] p-3 text-center rounded-2xl ml-10"
  >
    Sent
  </div>
  <p class="text-xs text-[#443C68] font-medium w-[20%] pl-10">
    May 04, 2025 11:26 AM
  </p>
  <button
    class="text-xs text-[#818181] border-1 border-[#E16F64] font-medium w-[10%] p-3 rounded-lg flex items-center gap-2 justify-center bg-[#FFE2DD] cursor-pointer hover:bg-[#e16e643f] transition duration-200 ease-in-out"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#E16F64"
      viewBox="0 0 256 256"
    >
      <path
        d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"
      ></path>
    </svg>
    <p class="text-[#E16F64]">Delete</p>
  </button>
</div>

<Modal bind:isOpen={isModalOpen} title="Notification ID" on:close={closeModal}>
  <!-- headers -->
  <div class="mb-6 flex justify-between items-center">
    <div class="text-sm text-[#443C68] font-medium">
      <p class="text-sm text-[#818181] font-medium">May 9, 2025 11:26 PM</p>
    </div>
    <div
      class="bg-[#DBEDDB] text-[#6C9B7D] text-sm font-semibold rounded-lg px-5 py-1"
    >
      Sent
    </div>
  </div>

  <!-- user -->
  <div class="mb-6 text-sm text-[#443C68] font-medium">
    <p class="text-sm text-[#818181] font-medium">Andrei Mayo</p>
    <p class="text-sm text-[#818181] font-medium">andreimayo@gmail.com</p>
  </div>

  <!-- message label -->
  <div class="flex mb-6 text-sm text-[#443C68] font-medium">
    <div class="bg-[#443c681c] rounded-lg px-10 py-1">
      <p class="text-xs text-[#818181] font-medium">Message</p>
    </div>
  </div>
  <!-- message -->
  <div class="mb-6">
    <p class="text-sm text-[#818181] font-medium">
      Reminder: <br /><br />
      You have a meeting with the client at 3:00 PM. Please be on time. <br />
      Please make sure you arrive on time and bring any necessary documents.<br
      /><br />
      Thank you!
    </p>
  </div>
  <!-- recipient label -->
  <div class="flex mb-4 text-sm text-[#443C68] font-medium">
    <div class="bg-[#443c681c] rounded-lg px-10 py-1">
      <p class="text-xs text-[#818181] font-medium">Recipients</p>
    </div>
  </div>

  <div
    class="flex flex-wrap gap-2 mb-12 text-xs text-[#818181] font-medium opacity-60"
  >
    <div class="bg-[#443c681c] rounded-lg px-3 py-1">
      <p class="">09279456060</p>
    </div>
    <div class="bg-[#443c681c] rounded-lg px-3 py-1">
      <p class="">09279456060</p>
    </div>
    <div class="bg-[#443c681c] rounded-lg px-3 py-1">
      <p class="">09279456060</p>
    </div>
    <div class="bg-[#443c681c] rounded-lg px-3 py-1">
      <p class="">09279456060</p>
    </div>
    <div class="bg-[#443c681c] rounded-lg px-3 py-1">
      <p class="">09279456060</p>
    </div>
  </div>

  <!-- footer -->
  <svelte:fragment slot="footer">
    <div class="mt-6 flex justify-center">
      <button
        class="w-full py-3 bg-red-200 border-red-400 rounded-lg text-red-400 hover:text-gray-800"
        on:click={closeModal}
      >
        Delete Notification
      </button>
    </div>
  </svelte:fragment>
</Modal>
