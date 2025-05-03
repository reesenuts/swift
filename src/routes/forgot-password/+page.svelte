<script>
    import { goto } from '$app/navigation';

    function navigateToLogin() {
        goto('/login');
    }

    let showPassword = false;
    let password = "";
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <!-- swift logo -->
    <img src="assets/logo.svg" alt="logo" class="w-28 h-24 mb-4" />

    <!-- login form -->
    <form action="" class="w-90 mb-10">
        <div class="flex flex-col gap-2 mb-4">
            <p class="text-sm font-medium text-[#1e1e1e]">password verification</p>
            <!-- email -->
            <input class="border-1 border-[#EBEBE8] rounded-2xl p-4 w-full text-[#222831] focus:border-[#c6c6c4] focus:text-[#222831] focus:outline-none"
                type="email"
                placeholder="your@email.com"
                required />
        </div>
        <!-- submit button -->
        <button class="bg-[#443C68] text-[#FFFFFF] font-medium text-center text-sm rounded-4xl p-4 w-full cursor-pointer hover:bg-[#332d4d] transition duration-200 ease-in-out"
            type="submit"
            on:click|preventDefault={() => goto('forgot-password/otp')}>
            Continue
        </button>
    </form>

    <!-- go back to login -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <p class="text-sm text-[#A5A4A1] mt-24">Go back to
        <span class="text-[#443C68] cursor-pointer font-semibold" on:click={navigateToLogin}>Log In</span>
    </p>
</div>