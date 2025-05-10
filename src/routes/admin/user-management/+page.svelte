<script lang="ts">
  import { onMount } from 'svelte';
  import UsersItem from "$lib/admin/users-item.svelte";
  
  let users = [];
  
  onMount(async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found. Please try again.');
      }

      console.log('Fetching users from API...');
      const res = await fetch('http://localhost:3000/api/admin/users/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      console.log('API response status:', res.status);
      // Check if response is ok before parsing JSON
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API response data:', data);
      
      if (data.success) {
        users = data.users.map(user => ({
              ...user,
              selected: false,
              status: user.is_active ? 'Active' : 'Inactive',
              dateCreated: new Date(user.created_at).toLocaleDateString(),
              initial: user.username ? user.username[0].toUpperCase() : 'U'
          }));
        console.log('Processed users:', users);
      } else {
        console.error('API returned success: false', data.message);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  });
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
          <h1 class="text-sm text-[#443C68] font-medium">User Management</h1>
        </div>
    
        <!-- headline -->
        <div>
          <h1 class="text-2xl font-bold text-[#443C68]">User Management</h1>
          <h1 class="text-sm text-[#A5A4A1]">
            Manage your swift users and their account permissions here.
          </h1>
        </div>
      </div>
  
      <!-- users table -->
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
      <!-- users items -->
      <UsersItem {users} />
    </div>
  </div>