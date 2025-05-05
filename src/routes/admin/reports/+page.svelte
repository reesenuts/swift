<script>
  import ReportItem from "$lib/admin/report-item.svelte";

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
        <h1 class="text-sm text-[#443C68] font-medium">Reports</h1>
      </div>
  
      <!-- headline -->
      <div>
        <h1 class="text-2xl font-bold text-[#443C68]">Reports</h1>
        <h1 class="text-sm text-[#A5A4A1]">
            View and analyze sent notifications with detailed filters by user, date, and status.
        </h1>
      </div>
    </div>
  
    <div class="p-6">
      <!-- overview -->
      <div class="flex gap-4">
        <!-- total users -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <h1 class="text-sm text-[#818181]">All Users</h1>
            <h1 class="text-5xl font-bold text-[#443C68]">02</h1>
          </div>
        </div>
        <!-- notifications -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <h1 class="text-sm text-[#818181]">All Notifications</h1>
            <h1 class="text-5xl font-bold text-[#443C68]">01</h1>
          </div>
        </div>
        <!-- sent -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <h1 class="text-sm text-[#818181]">Total Sent</h1>
            </div>
            <h1 class="text-5xl font-bold text-[#443C68]">01</h1>
          </div>
        </div>
        <!-- scheduled -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <h1 class="text-sm text-[#818181]">Total Scheduled</h1>
            </div>
            <h1 class="text-5xl font-bold text-[#443C68]">00</h1>
          </div>
        </div>
        <!-- failed -->
        <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
          <div class="p-4 flex flex-col justify-between h-full">
            <div class="flex items-center gap-2">
              <h1 class="text-sm text-[#818181]">Total Failed</h1>
            </div>
            <h1 class="text-5xl font-bold text-[#443C68]">00</h1>
          </div>
        </div>
      </div>
    </div>
  
    <!--  -->
    <div class="p-6">
        <!-- searchbar -->
        <div class="flex gap-2 justify-end mb-4">
            <div class="relative w-96 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="#818181" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
                <input class="w-full h-12 pl-10 text-sm pr-4 rounded-full bg-[#f9f9f9] focus:outline-none focus:border-[#E8E8E6] focus:ring-1 focus:ring-[#E8E8E6]"
                  type="text"
                  placeholder="Search"/>
              </div>
            <!-- filter -->
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="p-3 bg-[#f9f9f9] rounded-2xl cursor-pointer hover:bg-[#eeeeee] transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#818181" viewBox="0 0 256 256">
                    <path d="M136,120v96a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm64,72a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V200A8,8,0,0,0,200,192Zm24-32H208V40a8,8,0,0,0-16,0V160H176a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16ZM56,160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168A8,8,0,0,0,56,160Zm24-32H64V40a8,8,0,0,0-16,0v88H32a8,8,0,0,0,0,16H80a8,8,0,0,0,0-16Zm72-48H136V40a8,8,0,0,0-16,0V80H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z"></path>
                </svg>
            </button>
            <!-- sort -->
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="p-3 bg-[#f9f9f9] rounded-2xl cursor-pointer hover:bg-[#eeeeee] transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#818181" viewBox="0 0 256 256">
                    <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96H80a8,8,0,0,1,0,16H56v96H200V112H176a8,8,0,0,1,0-16h24A16,16,0,0,1,216,112ZM93.66,69.66,120,43.31V136a8,8,0,0,0,16,0V43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,69.66Z"></path>
                </svg>
            </button>
        </div>
        <!-- table head -->
        <div class="w-full flex justify-between items-center bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
            <p class="text-sm text-[#818181] font-medium pl-2 w-[25%]">Username</p>
            <p class="text-sm text-[#818181] font-medium w-[30%]">Message</p>
            <p class="text-sm text-[#818181] font-medium w-[15%] ml-10">Status</p>
            <p class="text-sm text-[#818181] font-medium w-[15%] pl-10">Date Sent</p>
            <p class="text-sm text-[#818181] font-medium w-[15%]">Recipients</p>
        </div>
        <!-- lib/admin/report-item.svelte -->
        <ReportItem />
    </div>

  </div>
  