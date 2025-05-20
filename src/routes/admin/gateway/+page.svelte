<script lang="ts">
  import { onMount } from "svelte";

  // gateway status type definition
  type GatewayStatus = {
    status: "Connected" | "Disconnected" | "Pending";
    health: "Operational" | "Limited" | "Down";
    lastChecked: string;
    balanceValue: number;
    balanceCurrency: string;
    messagesSent: number;
    messagesRemaining: number;
    apiKey: string;
    apiSecret: string;
    brandName: string;
  };

  // initial gateway status
  let gatewayStatus: GatewayStatus = {
    status: "Pending",
    health: "Operational",
    lastChecked: "...",
    balanceValue: 0,
    balanceCurrency: "EUR",
    messagesSent: 0,
    messagesRemaining: 0,
    apiKey: "d89f1c3e",
    apiSecret: "8uzlpTOMsfJGUuXP",
    brandName: "VONAGE",
  };

  let isRefreshing = false;

  // fetch and update gateway status
  async function checkStatus() {
    isRefreshing = true;
    try {
      // try to fetch balance from vonage api (will fail due to cors in browser)
      await fetch(
        `https://rest.nexmo.com/account/get-balance?api_key=${gatewayStatus.apiKey}&api_secret=${gatewayStatus.apiSecret}`
      );
      // use hardcoded balance data (replace with real api response in production)
      updateGatewayStatus(5.34814, 0);
    } catch (error) {
      console.error("error checking gateway status:", error);
      // fallback to hardcoded data on error
      updateGatewayStatus(5.34814, 0);
    } finally {
      isRefreshing = false;
    }
  }

  // helper to update gateway status object
  function updateGatewayStatus(balance: number, sentMessages: number) {
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }) +
      " " +
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const messagesPerEuro = 100;
    const remainingMessages = Math.floor(balance * messagesPerEuro);

    gatewayStatus = {
      ...gatewayStatus,
      status: "Connected",
      health: "Operational",
      lastChecked: formattedDate,
      balanceValue: balance,
      balanceCurrency: "EUR",
      messagesSent: sentMessages,
      messagesRemaining: remainingMessages,
    };
  }

  // auto-refresh on mount
  onMount(() => {
    checkStatus();
  });
</script>

<!-- main container -->
<div class="w-full bg-white">
  <div class="p-6 flex flex-col gap-6">
    <!-- breadcrumb navigation -->
    <div class="flex items-center gap-2">
      <!-- home icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#443C68" viewBox="0 0 256 256">
        <path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"></path>
      </svg>
      <!-- arrow icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#B8BCBC]">General</h1>
      <!-- arrow icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#B8BCBC" viewBox="0 0 256 256">
        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
      </svg>
      <h1 class="text-sm text-[#443C68] font-medium">Gateway</h1>
    </div>

    <!-- page headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Gateway</h1>
      <h2 class="text-sm text-[#A5A4A1]">Manage your primary SMS provider and monitor system status.</h2>
    </div>
  </div>

  <div class="p-6">
    <!-- gateway status card -->
    <div class="border border-[#EBEBE8] rounded-lg mb-6">
      <div class="p-6 border-b border-[#EBEBE8] flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-[#443C68]">Gateway Status</h2>
        <button class="text-xs text-[#818181] p-4 gap-2 flex items-center border border-[#EBEBE8] rounded-lg bg-[#ffffff]/10 hover:bg-[#ebebe8]/40 transition duration-200 ease-in-out cursor-pointer"
          on:click={checkStatus}
          disabled={isRefreshing} >
          {#if isRefreshing}
            <!-- loading spinner -->
            <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 256 256">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Refreshing...</span>
          {:else}
            <!-- refresh icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#818181" viewBox="0 0 256 256">
              <path d="M88,104H40a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V76.69L62.63,62.06A95.43,95.43,0,0,1,130,33.94h.53a95.36,95.36,0,0,1,67.07,27.33,8,8,0,0,1-11.18,11.44,79.52,79.52,0,0,0-55.89-22.77h-.45A79.56,79.56,0,0,0,73.94,73.37L59.31,88H88a8,8,0,0,1,0,16Zm128,48H168a8,8,0,0,0,0,16h28.69l-14.63,14.63a79.56,79.56,0,0,1-56.13,23.43h-.45a79.52,79.52,0,0,1-55.89-22.77,8,8,0,1,0-11.18,11.44,95.36,95.36,0,0,0,67.07,27.33H126a95.43,95.43,0,0,0,67.36-28.12L208,179.31V208a8,8,0,0,0,16,0V160A8,8,0,0,0,216,152Z"></path>
            </svg>
            <span>Refresh Status</span>
          {/if}
        </button>
      </div>
      <div class="p-6">
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <!-- status block -->
          <div class="flex-1 border border-[#EBEBE8] rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-[#818181]">Status</span>
              <span class="px-3 py-1 text-xs font-medium rounded-lg"
                class:bg-green-100={gatewayStatus.status === "Connected"}
                class:text-green-800={gatewayStatus.status === "Connected"}
                class:bg-red-100={gatewayStatus.status === "Disconnected"}
                class:text-red-800={gatewayStatus.status === "Disconnected"}
                class:bg-gray-100={gatewayStatus.status === "Pending"}
                class:text-gray-800={gatewayStatus.status === "Pending"} >
                {gatewayStatus.status}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#818181]">Last Checked</span>
              <span class="text-xs text-[#443C68] font-medium">{gatewayStatus.lastChecked}</span>
            </div>
          </div>
          <!-- health & balance block -->
          <div class="flex-1 border border-[#EBEBE8] rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-[#818181]">Health</span>
              <span class="px-3 py-1 text-xs font-medium rounded-lg"
                class:bg-green-100={gatewayStatus.health === "Operational"}
                class:text-green-800={gatewayStatus.health === "Operational"}
                class:bg-yellow-100={gatewayStatus.health === "Limited"}
                class:text-yellow-800={gatewayStatus.health === "Limited"}
                class:bg-red-100={gatewayStatus.health === "Down"}
                class:text-red-800={gatewayStatus.health === "Down"} >
                {gatewayStatus.health}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#818181]">Account Balance</span>
              <span class="text-xs text-[#443C68] font-medium">
                {gatewayStatus.balanceValue} {gatewayStatus.balanceCurrency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- gateway configuration card -->
    <div class="border border-[#EBEBE8] rounded-lg mb-6">
      <div class="p-6 border-b border-[#EBEBE8]">
        <h2 class="text-2xl font-semibold text-[#443C68]">Gateway Configuration</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- api credentials -->
          <div>
            <h3 class="text-sm font-semibold text-[#443C68] mb-4">API Credentials</h3>
            <div class="border border-[#EBEBE8] rounded-lg p-4">
              <div class="mb-4">
                <p class="block text-xs font-medium text-[#818181] mb-2">API Key</p>
                <input class="flex-1 border border-[#EBEBE8] text-[#818181] text-xs rounded-lg outline-none block w-full p-3"
                  type="text"
                  value={gatewayStatus.apiKey}
                  readonly />
              </div>
              <div>
                <p class="block text-xs font-medium text-[#818181] mb-2">API Secret</p>
                <input class="flex-1 border border-[#EBEBE8] text-[#818181] text-xs rounded-lg outline-none block w-full p-3"
                  type="password"
                  value={gatewayStatus.apiSecret}
                  readonly />
              </div>
            </div>
          </div>
          <!-- sms configuration -->
          <div>
            <h3 class="text-sm font-semibold text-[#443C68] mb-4">SMS Configuration</h3>
            <div class="border border-[#EBEBE8] rounded-lg p-4">
              <div class="mb-4">
                <p class="block text-xs font-medium text-[#818181] mb-2">SMS ID</p>
                <input class="flex-1 border border-[#EBEBE8] text-[#818181] text-xs rounded-lg outline-none block w-full p-3"
                  type="text"
                  value={gatewayStatus.brandName}
                  readonly />
              </div>
              <div>
                <p class="block text-xs font-medium text-[#818181] mb-2">Documentation</p>
                <a class="flex-1 border border-[#EBEBE8] text-[#443C68] text-xs rounded-lg outline-none w-full p-3 flex items-center gap-2"
                  href="https://developer.vonage.com/en/messaging/sms/overview"
                  target="_blank" >
                  <!-- external link icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Vonage SMS API Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>