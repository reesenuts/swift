<script>
  export let users = [];
  
  // Log the received users data when it changes
  $: {
    console.log('Users data in component:', users);
  }
  
  let allSelected = false;
  
  function toggleAllSelected() {
    allSelected = !allSelected;
    users = users.map(user => ({ ...user, selected: allSelected }));
  }
  
  function handleUserSelection(userId, selected) {
    users = users.map(user => 
      user.id === userId ? { ...user, selected } : user
    );
    
    // Check if all users are selected
    allSelected = users.every(user => user.selected);
  }
  
  async function handleStatusChange(userId, status) {
  const is_active = status === 'Active';

  try {
    const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ is_active })
    });

    const result = await res.json();
    if (result.success) {
      users = users.map(user =>
        user.id === userId ? { ...user, status } : user
      );
      console.log(`User ${userId} status updated to ${status}`);
    } else {
      alert(`Failed to update status: ${result.message}`);
    }
  } catch (error) {
    console.error('Error updating status:', error);
    alert('An error occurred while updating user status.');
  }
}
  
  function handleRoleChange(userId, role) {
    users = users.map(user => 
      user.id === userId ? { ...user, role } : user
    );
  }
  
  async function handleDeleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const result = await res.json();
    if (result.success) {
      users = users.filter(user => user.id !== userId);
      console.log('User deleted:', userId);
    } else {
      alert(`Failed to delete user: ${result.message}`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('An error occurred while deleting the user.');
  }
}
  </script>
  
  {#if users.length === 0}
    <div class="p-4 text-center text-[#818181] text-sm mt-10">
      <p>No users found. Add users to see them here.</p>
    </div>
  {:else}
    {#each users as user, index}
    <div class="w-full flex justify-between items-center p-4 rounded-lg gap-4 border-1 border-[#EBEBE8] mb-2">
        <p class="text-xs text-[#818181] font-medium pl-2 w-[5%]">{String(user.id).padStart(3, '0')}</p>
        <!-- username -->
        <div class="text-sm text-[#818181] font-medium pl-2 w-[15%] flex items-center gap-4">
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