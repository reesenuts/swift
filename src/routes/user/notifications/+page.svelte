<script>
  import Notification from "$lib/user/notification.svelte";
  import AddNotification from "$lib/user/add-notification.svelte";

  let isAddModalOpen = false;

  function openAddModal() {
    isAddModalOpen = true;
  }

  function closeAddModal() {
    isAddModalOpen = false;
  }
</script>

<div class="w-full">
  <div class="p-6 flex flex-col justify-between gap-6">
    <!-- Path -->
    <div class="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#443C68"
        viewBox="0 0 256 256"
      >
        <path
          d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#B8BCBC"
        viewBox="0 0 256 256"
      >
        <path
          d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
        ></path>
      </svg>
      <h1 class="text-sm text-[#B8BCBC]">General</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#B8BCBC"
        viewBox="0 0 256 256"
      >
        <path
          d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
        ></path>
      </svg>
      <h1 class="text-sm text-[#443C68] font-medium">Notifications</h1>
    </div>

    <!-- Headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Notifications</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Create, schedule, and manage your SMS notifications all in one place.
      </h1>
    </div>

    <!-- Button to add new notification -->
    <div>
      <!-- searchbar -->
      <div class="flex gap-2 justify-between items-center mb-4">
        <div class="flex items-center gap-2">
          <div class="relative w-72 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="#818181"
              viewBox="0 0 256 256"
            >
              <path
                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
              ></path>
            </svg>
            <input
              class="w-full h-12 pl-10 text-sm pr-4 rounded-full bg-[#f9f9f9] focus:outline-none focus:border-[#E8E8E6] focus:ring-1 focus:ring-[#E8E8E6]"
              type="text"
              placeholder="Search"
            />
          </div>
          <!-- filter -->
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button
            class="p-3 bg-[#f9f9f9] rounded-2xl cursor-pointer hover:bg-[#eeeeee] transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="#818181"
              viewBox="0 0 256 256"
            >
              <path
                d="M136,120v96a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm64,72a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V200A8,8,0,0,0,200,192Zm24-32H208V40a8,8,0,0,0-16,0V160H176a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16ZM56,160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168A8,8,0,0,0,56,160Zm24-32H64V40a8,8,0,0,0-16,0v88H32a8,8,0,0,0,0,16H80a8,8,0,0,0,0-16Zm72-48H136V40a8,8,0,0,0-16,0V80H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z"
              ></path>
            </svg>
          </button>
        </div>
        <!-- sort -->
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button on:click={openAddModal}
          class="p-3 flex items-center gap-2 border-1 border-[#ebebe8] rounded-2xl cursor-pointer hover:bg-[#eeeeee]/50 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="#443C68"
            viewBox="0 0 256 256"
          >
            <path
              d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"
            ></path>
          </svg>
          <p class="text-xs text-[#443C68] font-semibold">Notification</p>
        </button>
      </div>
    </div>
    <!-- Notifications -->
    <Notification />
  </div>
</div>

<AddNotification isOpen={isAddModalOpen} on:close={closeAddModal} />
