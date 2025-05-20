<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    let activePath = 'dashboard';
    let currentUser = {
    username: "",
    email: "",
    initial: "",
  };

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

        const response = await fetch('http://localhost:3000/api/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
      });
      const data = await response.json();

      if (response.ok) {
        currentUser = {
          username: data.username,
          email: data.email,
          initial: data.username ? data.username[0].toUpperCase() : "",
        };
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
                {activePath === 'user/dashboard' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('user/dashboard')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'user/dashboard' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M122.34,109.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0,0-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32ZM128,35.31,156.69,64,128,92.69,99.31,64Zm5.66,111a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0,0-11.32ZM128,220.69,99.31,192,128,163.31,156.69,192Zm109.66-98.35-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,237.66,122.34ZM192,156.69,163.31,128,192,99.31,220.69,128Zm-82.34-34.35-40-40a8,8,0,0,0-11.32,0l-40,40a8,8,0,0,0,0,11.32l40,40a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,109.66,122.34ZM64,156.69,35.31,128,64,99.31,92.69,128Z"></path>
                </svg>
                <p class="text-sm {activePath === 'user/dashboard' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Dashboard</p>
            </div>

            <!-- contacts -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'user/contacts' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('user/contacts')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'user/contacts' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M83.19,174.4a8,8,0,0,0,11.21-1.6,52,52,0,0,1,83.2,0,8,8,0,1,0,12.8-9.6A67.88,67.88,0,0,0,163,141.51a40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,81.6,163.2,8,8,0,0,0,83.19,174.4ZM112,112a24,24,0,1,1,24,24A24,24,0,0,1,112,112Zm96-88H64A16,16,0,0,0,48,40V64H32a8,8,0,0,0,0,16H48v40H32a8,8,0,0,0,0,16H48v40H32a8,8,0,0,0,0,16H48v24a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V40A16,16,0,0,0,208,24Zm0,192H64V40H208Z"></path>
                </svg>
                <p class="text-sm {activePath === 'user/contacts' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Contacts</p>
            </div>
            <!-- messages -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'user/messages' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('user/messages')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'user/messages' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,1,1,0-16h64A8,8,0,0,1,168,224Zm53.85-32A15.8,15.8,0,0,1,208,200H48a16,16,0,0,1-13.8-24.06C39.75,166.38,48,139.34,48,104a80,80,0,1,1,160,0c0,35.33,8.26,62.38,13.81,71.94A15.89,15.89,0,0,1,221.84,192ZM208,184c-7.73-13.27-16-43.95-16-80a64,64,0,1,0-128,0c0,36.06-8.28,66.74-16,80Z"></path>
                </svg>
                <p class="text-sm {activePath === 'user/messages' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Notifications</p>
            </div>


            <!-- templates -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="flex items-center gap-5 cursor-pointer hover:bg-[#f9f9f9] p-4 rounded-2xl 
                {activePath === 'user/templates' ? 'bg-[#f9f9f9]' : 'bg-transparent'}"
                on:click={() => handlePathClick('user/templates')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="{activePath === 'user/templates' ? '#443C68' : '#818181'}" viewBox="0 0 256 256">
                    <path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path>
                </svg>
                <p class="text-sm {activePath === 'user/templates' ? 'text-[#443C68] font-medium' : 'text-[#818181]'}">Templates</p>
            </div>
        </div>
    </div>

    <div class="space-y-2 mt-8">
        <!-- user profile -->
        <div class="bg-[#f9f9f9] flex items-center gap-2 p-2 rounded-full">
            <div class="h-10 w-10 rounded-full text-sm flex items-center justify-center font-medium text-[#443C68] bg-[#443c6836]"> {currentUser.initial}</div>
            <div class="text-xs">
                <p class="text-[#443C68] font-medium">{currentUser.username}</p>
                <p class="text-[#A5A4A1]">{currentUser.email}</p>
            </div>
        </div>
        <!-- logout button -->
        <button on:click={handleLogout} class="bg-[#FFE2DD] text-[#E16F64] text-sm p-3 rounded-full w-full cursor-pointer hover:bg-[#F9CFCB] transition duration-200 ease-in-out flex items-center justify-center">
            Log Out
        </button>
    </div>
</div>