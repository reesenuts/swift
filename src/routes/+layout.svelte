<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import UserManagement from "$lib/components/UserManagement.svelte";
	
	let { children, path } = $props();
</script>

<div class="app-container">
	<Sidebar />
	
	<main class="content">
	  {#if path === "/user-management" || path === "/"}
		<UserManagement />
	  {:else}
		{@render children()}
	  {/if}
	</main>
</div>

<style>
	.app-container {
	  display: flex;
	  min-height: 100vh;
	}
	
	.content {
	  flex: 1;
	  margin-left: 260px; /* Same width as sidebar */
	  padding: 20px 30px;
	}
</style>