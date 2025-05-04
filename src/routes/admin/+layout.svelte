<script>
    import Sidebar from "$lib/admin/sidebar.svelte";
</script>

<div class="flex flex-row h-screen w-full">
    <Sidebar />
    <slot />
</div>