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
        <h1 class="text-sm text-[#443C68] font-medium">Gateway</h1>
      </div>
  
      <!-- headline -->
      <div>
        <h1 class="text-2xl font-bold text-[#443C68]">Gateway</h1>
        <h1 class="text-sm text-[#A5A4A1]">
            Manage your primary SMS provider and monitor system status.
        </h1>
      </div>
    </div>

    <!--  -->
    <div class="p-6"> 
      <!-- table head -->
      <div class="w-full flex justify-between items-center bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <p class="text-sm text-[#818181] font-medium pl-2 w-[25%]">Provider</p>
        <p class="text-sm text-[#818181] font-medium w-[20%]">Status</p>
        <p class="text-sm text-[#818181] font-medium w-[15%] ml-10">Last Checked</p>
        <p class="text-sm text-[#818181] font-medium w-[15%]">Health</p>
        <p class="text-sm text-[#818181] font-medium w-[20%] ml-10">Actions</p>
      </div>
      <!-- table head -->
      <div class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <!-- username -->
        <div  class="text-sm text-[#818181] font-medium pl-2 w-[25%] flex items-center gap-4">
            <p class="text-[#443C68] font-semibold">Semaphore SMS Philippines</p>
        </div>
        <!-- message -->
        <div class="text-sm text-[#6C9B7D] font-medium w-[20%] rounded-2xl bg-[#DBEDDB] p-3 text-center">
            Connected
        </div>
        <!-- status -->
        <div class="text-sm text-[#818181] font-medium w-[15%] ml-10">
            May 06, 2025 2:56 PM
        </div>
        <!-- date sent -->
        <div class="text-sm text-[#6C9B7D] font-medium w-[15%] rounded-2xl bg-[#DBEDDB] p-3 text-center">
          Operational
        </div>
        <!-- recipeint -->
        <button class="text-sm w-[20%] text-[#818181] border-1 ml-10 border-[#EBEBE8] font-medium p-3 rounded-lg flex items-center gap-2 justify-center cursor-pointer hover:bg-[#dcdcdc3f] transition duration-200 ease-in-out">
          Refresh Status
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- headline -->
      <h1 class="text-2xl font-medium text-[#A5A4A1] mb-4">
        Gateway Configuration
      </h1>
      <!-- table head -->
      <div class="w-full flex justify-between items-center bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <p class="text-sm text-[#818181] font-medium pl-2 w-[20%]">API Key</p>
        <p class="text-sm text-[#818181] font-medium w-[10%]">Sender ID</p>
        <p class="text-sm text-[#818181] font-medium w-[15%] ml-10">Semaphore Region</p>
        <p class="text-sm text-[#818181] font-medium w-[25%]">Message Quota</p>
        <p class="text-sm text-[#818181] font-medium w-[20%] ml-10">Actions</p>
      </div>
       <!-- table head -->
       <div class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <!-- username -->
        <div  class="text-sm text-[#818181] font-medium pl-2 w-[20%] flex items-center gap-4">
            <p class="text-[#443C68] font-semibold">Hashed API Key here</p>
        </div>
        <!-- message -->
        <p class="text-sm text-[#443C68] font-semibold w-[10%]">
            Swift Project
        </p>
        <!-- status -->
        <div class="text-sm text-[#818181] font-medium w-[15%] ml-10">
            Zambales, Philippines
        </div>
        <!-- date sent -->
        <div class="text-sm flex gap-2 font-medium w-[25%] text-center">
          <div class="text-[#E16F64] bg-[#FFE2DD] p-3 rounded-2xl w-full">Used: 100</div>
          <div class="text-[#6C9B7D] bg-[#DBEDDB] p-3 rounded-2xl w-full">Remaining: 1098</div>
        </div>
        <!-- recipeint -->
        <button class="text-sm w-[20%] text-[#818181] border-1 ml-10 border-[#EBEBE8] font-medium p-3 rounded-lg flex items-center gap-2 justify-center cursor-pointer hover:bg-[#dcdcdc3f] transition duration-200 ease-in-out">
          Edit Gateway
        </button>
      </div>
    </div>
</div>