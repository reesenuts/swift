<script>
  import NotificationItem from "$lib/admin/notification-item.svelte";

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
            View, manage, and track all SMS alerts sent through swift.
        </h1>
      </div>
    </div>

    <!-- notifications -->
    <div class="p-6 w-full">
    <!-- table head -->
    <div class="w-full flex justify-between items-center bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
      <p class="text-sm text-[#818181] font-medium pl-2 w-[5%]">ID</p>
      <p class="text-sm text-[#818181] font-medium pl-2 w-[25%]">Username</p>
      <p class="text-sm text-[#818181] font-medium w-[25%]">Message</p>
      <p class="text-sm text-[#818181] font-medium w-[15%] ml-10">Status</p>
      <p class="text-sm text-[#818181] font-medium w-[20%] pl-10">Schedule</p>
      <p class="text-sm text-[#818181] font-medium w-[10%]">Actions</p>
    </div>
    <!-- notification items -->
    <NotificationItem />    
  </div>
</div>
