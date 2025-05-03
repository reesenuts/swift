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
    <img src="/assets/logo.svg" alt="logo" class="w-28 h-24 mb-4" />

    <!-- forgot password -->
    <form action="" class="w-90 mb-10">
        <div class="flex flex-col gap-2 mb-4">
            <p class="text-sm font-medium text-[#1e1e1e] text-center mb-4">we sent a code to your@email.com</p>
            <!-- otp -->
            <div class="flex gap-2 justify-center mb-4">
                <div class="w-full h-14 border-1 border-[#EBEBE8] rounded-2xl"></div>
                <div class="w-full h-14 border-1 border-[#EBEBE8] rounded-2xl"></div>
                <div class="w-full h-14 border-1 border-[#EBEBE8] rounded-2xl"></div>
                <div class="w-full h-14 border-1 border-[#EBEBE8] rounded-2xl"></div>
                <div class="w-full h-14 border-1 border-[#EBEBE8] rounded-2xl"></div>
            </div>
            <p class="text-sm text-[#A5A4A1] text-center">didn't receive the email?
                <span class="text-[#1e1e1e] cursor-pointer font-medium underline">click resend</span>
            </p>
        </div>
        <!-- submit button -->
        <button class="bg-[#443C68] text-[#FFFFFF] font-medium text-center text-sm rounded-4xl p-4 w-full cursor-pointer hover:bg-[#332d4d] transition duration-200 ease-in-out mt-4"
            type="submit">
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