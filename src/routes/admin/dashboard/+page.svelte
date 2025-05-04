<script>
  import Dashnotif from "$lib/admin/dashnotif.svelte";
import NotificationItem from "$lib/admin/dashnotif.svelte";
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
      <h1 class="text-sm text-[#443C68] font-medium">Dashboard</h1>
    </div>

    <!-- headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Dashboard</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Quickly view system stats, track notifications, and manage user
        activity.
      </h1>
    </div>
  </div>

  <div class="p-6">
    <!-- overview -->
    <div class="flex gap-4">
      <!-- total users -->
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <h1 class="text-sm text-[#818181]">Total Users</h1>
          <h1 class="text-5xl font-bold text-right text-[#443C68]">02</h1>
        </div>
      </div>
      <!-- notifications -->
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <h1 class="text-sm text-[#818181]">Active Notifications</h1>
          <h1 class="text-5xl font-bold text-right text-[#443C68]">01</h1>
        </div>
      </div>
      <!-- sent -->
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-[#6C9B7D]"></div>
            <h1 class="text-sm text-[#818181]">Sent</h1>
          </div>
          <h1 class="text-5xl font-bold text-right text-[#443C68]">01</h1>
        </div>
      </div>
      <!-- scheduled -->
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-[#D7813A]"></div>
            <h1 class="text-sm text-[#818181]">Scheduled</h1>
          </div>
          <h1 class="text-5xl font-bold text-right text-[#443C68]">00</h1>
        </div>
      </div>
      <!-- failed -->
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-[#E16F64]"></div>
            <h1 class="text-sm text-[#818181]">Failed</h1>
          </div>
          <h1 class="text-5xl font-bold text-right text-[#443C68]">00</h1>
        </div>
      </div>
    </div>
  </div>

  <!-- notifications -->
  <div class="p-6 w-full">
    <!-- headline -->
    <h1 class="text-2xl font-medium text-[#A5A4A1] mb-4">
      Recent Notifications
    </h1>
    <!-- table head -->
    <div class="w-full flex justify-between bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
      <p class="text-sm text-[#818181] font-medium pl-2 w-[25%]">Username</p>
      <p class="text-sm text-[#818181] font-medium w-[40%]">Message</p>
      <p class="text-sm text-[#818181] font-medium w-[20%] pl-10">Schedule</p>
      <p class="text-sm text-[#818181] font-medium w-[15%]">Status</p>
    </div>
    <!-- lib/admin/notification.svelte -->
    <Dashnotif />
  </div>
</div>
