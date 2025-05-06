<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    let activePath = 'dashboard';
    let currentUser = { username: '', email: '' };

    $: {
        const path = $page.url.pathname;
        if (path === '/') {
            activePath = 'dashboard';
        } else {
            const routeName = path.substring(1);
            activePath = routeName;
        }
    }

    function handlePathClick(path: string) {
        goto(`/${path}`);
    }

    onMount(async () => {
    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            console.error('No token found');
            goto('/login');
            return;
        }

        const response = await fetch('http://localhost:3000/api/...', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
      });
      const data = await response.json();

      if (response.ok) {
        currentUser = data;
      } else {
        console.error('Not authenticated');
        goto('/login');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  });

    async function handleLogout(){
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                goto('/login');
            } else {
                alert(data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Something went wrong during logout!');
        }
    }

</script>

<div class="w-80 h-screen flex flex-col justify-between p-6">
    <div class="">
        <img src="/assets/logo.svg" alt="logo" class="w-20 mb-15" />
        <h1 class="text-xs text-[#A5A4A1] mb-4">General</h1>
        <div class="flex flex-col gap-1">
            <!-- dashboard -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl
                {activePath === 'admin/dashboard' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('admin/dashboard')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'admin/dashboard' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M122.34,109.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0,0-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32ZM128,35.31,156.69,64,128,92.69,99.31,64Zm5.66,111a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0,0-11.32ZM128,220.69,99.31,192,128,163.31,156.69,192Zm109.66-98.35-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,237.66,122.34ZM192,156.69,163.31,128,192,99.31,220.69,128Zm-82.34-34.35-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,109.66,122.34ZM64,156.69,35.31,128,64,99.31,92.69,128Z"></path>
                </svg>
                <p class="text-sm {activePath === 'admin/dashboard' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Dashboard</p>
            </div>

            <!-- notifications -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'admin/notifications' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('admin/notifications')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'admin/notifications' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,1,1,0-16h64A8,8,0,0,1,168,224Zm53.85-32A15.8,15.8,0,0,1,208,200H48a16,16,0,0,1-13.8-24.06C39.75,166.38,48,139.34,48,104a80,80,0,1,1,160,0c0,35.33,8.26,62.38,13.81,71.94A15.89,15.89,0,0,1,221.84,192ZM208,184c-7.73-13.27-16-43.95-16-80a64,64,0,1,0-128,0c0,36.06-8.28,66.74-16,80Z"></path>
                </svg>
                <p class="text-sm {activePath === 'admin/notifications' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Notifications</p>
            </div>

            <!-- user management -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'admin/user-management' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('admin/user-management')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'admin/user-management' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                </svg>
                <p class="text-sm {activePath === 'admin/user-management' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">User Management</p>
            </div>

            <!-- reports -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'admin/reports' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('admin/reports')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'admin/reports' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M100,116.43a8,8,0,0,0,4-6.93v-72A8,8,0,0,0,93.34,30,104.06,104.06,0,0,0,25.73,147a8,8,0,0,0,4.52,5.81,7.86,7.86,0,0,0,3.35.74,8,8,0,0,0,4-1.07ZM88,49.62v55.26L40.12,132.51C40,131,40,129.48,40,128A88.12,88.12,0,0,1,88,49.62ZM128,24a8,8,0,0,0-8,8v91.82L41.19,169.73a8,8,0,0,0-2.87,11A104,104,0,1,0,128,24Zm0,192a88.47,88.47,0,0,1-71.49-36.68l75.52-44a8,8,0,0,0,4-6.92V40.36A88,88,0,0,1,128,216Z"></path>
                </svg>
                <p class="text-sm {activePath === 'admin/reports' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Reports</p>
            </div>

            <!-- gateway -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'admin/gateway' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('admin/gateway')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'admin/gateway' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M232,112H136V88h8a16,16,0,0,0,16-16V40a16,16,0,0,0-16-16H112A16,16,0,0,0,96,40V72a16,16,0,0,0,16,16h8v24H24a8,8,0,0,0,0,16H56v32H48a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16H80a16,16,0,0,0,16-16V176a16,16,0,0,0-16-16H72V128H184v32h-8a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V176a16,16,0,0,0-16-16h-8V128h32a8,8,0,0,0,0-16ZM112,40h32V72H112ZM80,208H48V176H80Zm128,0H176V176h32Z"></path>
                </svg>
                <p class="text-sm {activePath === 'admin/gateway' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Gateway</p>
            </div>
        </div>
    </div>

    <div class="space-y-2 mt-8">
        <!-- user profile -->
        <div class="bg-[#f9f9f9] flex items-center gap-2 p-2 rounded-full">
            <div class="h-10 w-10 rounded-full text-sm flex items-center justify-center font-semibold text-[#443C68] bg-[#443c6836]">R</div>
            <div class="text-xs">
                <p class="text-[#443C68] font-semibold">{currentUser.username}</p>
                <p class="text-[#A5A4A1]">{currentUser.email}</p>
            </div>
        </div>
        <!-- logout button -->
        <button on:click={handleLogout} class="bg-[#FFE2DD] text-[#E16F64] text-sm p-3 rounded-full w-full cursor-pointer hover:bg-[#F9CFCB] transition duration-200 ease-in-out flex items-center justify-center">
            Log Out
        </button>
    </div>
</div>