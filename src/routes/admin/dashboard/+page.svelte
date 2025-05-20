<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/services/api.js';
  
  // Gateway status data from gateway page
  type GatewayStatus = {
    status: 'Connected' | 'Disconnected' | 'Pending';
    health: 'Operational' | 'Limited' | 'Down';
    balanceValue: number;
    balanceCurrency: string;
    messagesSent: number;
    messagesRemaining: number;
  };
  
  // User data
  interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    is_active: boolean;
    status?: string;
    created_at: string;
    dateCreated?: string;
    initial?: string;
    selected?: boolean;
  }
  
  // Optional gateway status
  let gatewayStatus: GatewayStatus = {
    status: 'Connected',
    health: 'Operational',
    balanceValue: 5.34814000,
    balanceCurrency: 'EUR',
    messagesSent: 0,
    messagesRemaining: 534
  };
  
  // Users data
  let users: User[] = [];
  let loading = true;
  let error: string | null = null;
  let totalUsers = 0;
  let activeUsers = 0;
  
  // Stats summary
  let stats = {
    totalUsers: 0,
    activeUsers: 0
  };
  
  // For user management
  let showAddUserModal = false;
  let newUser = {
    username: '',
    email: '',
    role: 'user',
    password: ''
  };
  
  // Fetch users function
  function fetchUsers() {
    loading = true;
    error = null;
    
    api.admin.users.getAll()
      .then(response => {
        if (response && response.users) {
          users = response.users.map((user: User) => {
            // Add derived properties
            const nameParts = user.username.split(' ');
            const initial = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
            
            return {
              ...user,
              status: user.is_active ? 'Active' : 'Inactive',
              dateCreated: new Date(user.created_at).toLocaleDateString(),
              initial: initial || user.username.charAt(0).toUpperCase()
            };
          });
          
          // Calculate stats
          totalUsers = users.length;
          activeUsers = users.filter(user => user.is_active).length;
          
          // Update stats object for backward compatibility
          stats.totalUsers = totalUsers;
          stats.activeUsers = activeUsers;
          
          console.log('Users loaded:', users);
        } else {
          error = "Invalid response format";
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        error = `Error fetching users: ${err.message || 'Unknown error'}`;
      })
      .finally(() => {
        loading = false;
      });
  }
  
  function toggleAddUserModal() {
    showAddUserModal = !showAddUserModal;
    if (!showAddUserModal) {
      // Reset form
      newUser = {
        username: '',
        email: '',
        role: 'user',
        password: ''
      };
    }
  }
  
  async function addUser() {
    try {
      const response = await api.post('register', {
        email: newUser.email,
        password: newUser.password
      });
      
      if (response.success) {
        // Refresh user list
        await fetchUsers();
        toggleAddUserModal();
      } else {
        throw new Error(response.message || 'Failed to add user');
      }
    } catch (error: any) {
      console.error('Error adding user:', error);
      error = error.message || 'An error occurred while adding the user';
    }
  }
  
  async function handleStatusChange(userId: number, status: string) {
    const is_active = status === 'Active';

    try {
      await api.admin.users.toggleStatus(userId, is_active);
      users = users.map(user =>
        user.id === userId ? { ...user, status, is_active } : user
      );
      // Update active users count
      activeUsers = users.filter(user => user.status === 'Active').length;
      stats.activeUsers = activeUsers;
      console.log(`User ${userId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating user status.');
    }
  }
  
  async function handleDeleteUser(userId: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.admin.users.delete(userId);
      users = users.filter(user => user.id !== userId);
      // Update counts
      totalUsers = users.length;
      activeUsers = users.filter(user => user.status === 'Active').length;
      stats.totalUsers = totalUsers;
      stats.activeUsers = activeUsers;
      console.log('User deleted:', userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  }
  
  onMount(fetchUsers);
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
        <h1 class="text-sm text-[#443C68] font-medium">Dashboard</h1>
      </div>

    <!-- headline -->
    <div>
      <h1 class="text-2xl font-bold text-[#443C68]">Admin Dashboard</h1>
      <h1 class="text-sm text-[#A5A4A1]">
        Monitor system status and manage users.
      </h1>
    </div>
  </div>

  <!-- Stats Overview -->
  <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <h1 class="text-sm font-medium text-[#443C68]">Total Users</h1>
          <h1 class="text-5xl font-bold text-[#443C68]">{stats.totalUsers}</h1>
        </div>
      </div>

      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <h1 class="text-sm font-medium text-[#443C68]">Active Users</h1>
          <h1 class="text-5xl font-bold text-[#443C68]">{stats.activeUsers}</h1>
        </div>
      </div>

      <div class="w-full h-30 border-1 border-[#EBEBE8] rounded-lg">
        <div class="p-4 flex flex-col justify-between h-full">
          <h1 class="text-sm font-medium text-[#443C68]">Inactive Users</h1>
          <h1 class="text-5xl font-bold text-[#443C68]">{stats.totalUsers - stats.activeUsers}</h1>
        </div>
      </div>
  </div>

  {#if error}
    <div class="mx-6 bg-[#FFE2DD] border border-[#E16F64] text-[#E16F64] px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline"> {error}</span>
    </div>
  {/if}

  <!-- Users Table -->
  <div class="p-6 w-full">
    <!-- table head -->
    <div class="w-full flex justify-between items-center bg-[#FCFCFA] p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
      <p class="text-sm text-[#818181] font-medium pl-2 w-[5%]">ID</p>
      <p class="text-sm text-[#818181] font-medium pl-2 w-[20%]">Username</p>
      <p class="text-sm text-[#818181] font-medium w-[10%]">Role</p>
      <p class="text-sm text-[#818181] font-medium w-[15%] ml-10">Status</p>
      <p class="text-sm text-[#818181] font-medium w-[15%] pl-10">Date Created</p>
      <p class="text-sm text-[#818181] font-medium w-[20%]">Actions</p>
    </div>
    
    {#if loading}
      <div class="p-6 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#443C68]"></div>
        <p class="mt-2 text-[#A5A4A1]">Loading users...</p>
      </div>
    {:else if error}
      <div class="p-4 text-center text-[#E16F64] text-sm">
        <p>{error}</p>
        <button 
          class="mt-2 text-xs text-white bg-[#443C68] p-2 rounded-lg font-medium hover:bg-[#322d4d] transition duration-200 ease-in-out"
          on:click={fetchUsers}
        >
          Try Again
        </button>
      </div>
    {:else if users.length === 0}
      <div class="p-6 text-center">
        <p class="text-[#A5A4A1]">No users found.</p>
      </div>
    {:else}
      {#each users as user}
      <div class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2 hover:bg-[#FCFCFA] transition-colors">
        <p class="text-xs text-[#818181] font-medium pl-2 w-[5%]">{String(user.id).padStart(3, '0')}</p>
        <!-- username -->
        <div class="text-sm text-[#818181] font-medium pl-2 w-[20%] flex items-center gap-4">
          <!-- avatar -->
          <div class="h-10 w-10 border-1 border-[#443c6846] rounded-full text-sm flex items-center justify-center font-medium text-[#443C68] bg-[#443c6836]">
            {user.initial}
          </div>
          <!-- username and email -->
          <div class="text-xs">
            <p class="text-[#443C68] font-medium">{user.username}</p>
            <p class="text-[#A5A4A1]">{user.email}</p>
          </div>
        </div>
        <!-- role -->
        <div class="text-xs {user.role?.toLowerCase() === 'admin' ? 'text-[#443c68] bg-[#EBEBE8]/80' : 'text-[#443C68] bg-[#EBEBE8]/80'} w-[10%] font-medium p-3 rounded-lg text-center">
          {user.role?.toLowerCase() === 'admin' ? 'Admin' : 'User'}
        </div>
        <!-- status -->
        <div class="text-xs {user.status === 'Active' ? 'text-[#6C9B7D] bg-[#DBEDDB]/50' : 'text-[#91918E] bg-[#E3E2E0]/50'} font-medium w-[15%] p-3 text-center rounded-lg ml-10">
          {user.status}
        </div>
        <!-- date created -->
        <p class="text-xs text-[#818181] w-[15%] pl-10">
          {user.dateCreated}
        </p>
        <!-- actions -->
        <div class="flex gap-2 w-[20%]">
          {#if user.status === 'Active'}
          <button 
            class="text-xs text-[#E16F64] border-1 border-[#E16F64] p-3 rounded-lg font-medium bg-[#FFE2DD]/20 cursor-pointer hover:bg-[#e16e643f] transition duration-200 ease-in-out w-full"
            on:click={() => handleStatusChange(user.id, 'Inactive')}
          >
            Disable
          </button>
          {:else}
          <button 
            class="text-xs text-[#6C9B7D] border-1 border-[#6C9B7D] p-3 rounded-lg font-medium bg-[#DBEDDB]/20 cursor-pointer hover:bg-[#6c9b7d53] transition duration-200 ease-in-out w-full"
            on:click={() => handleStatusChange(user.id, 'Active')}
          >
            Enable
          </button>
          {/if}
          <button 
            class="text-xs text-[#818181] border-1 border-[#E16F64] font-medium w-full p-3 rounded-lg flex items-center gap-2 justify-center bg-[#FFE2DD]/20 cursor-pointer hover:bg-[#e16e643f] transition duration-200 ease-in-out"
            on:click={() => handleDeleteUser(user.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#E16F64" viewBox="0 0 256 256">
              <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
            </svg>
            <p class="text-[#E16F64]">Delete</p>
          </button>
        </div>
      </div>
      {/each}
    {/if}
  </div>
</div>

<!-- Add User Modal -->
{#if showAddUserModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-800">Add New User</h3>
        <button on:click={toggleAddUserModal} class="text-gray-400 hover:text-gray-500">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6">
        <form on:submit|preventDefault={addUser}>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              bind:value={newUser.email} 
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="user@example.com"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              bind:value={newUser.password} 
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="Min 8 chars with uppercase, lowercase & number"
            />
            <p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters with uppercase, lowercase & number</p>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              on:click={toggleAddUserModal}
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
