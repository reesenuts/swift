<script>
  import { onMount } from 'svelte';
  import UsersTable from './UsersTable.svelte';

  let users = [];

  onMount(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/users/all');
    const data = await res.json();
    console.log('Fetched data:', data); // Log the fetched data to inspect its structure

    // Now, the response should have a 'users' array
    if (data.success && Array.isArray(data.users)) {
      users = data.users.map(user => ({
        ...user,
        status: 'Active', // Or whatever logic you need
        dateCreated: new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        initial: user.username[0].toUpperCase()
      }));
    } else {
      console.error('Expected an array of users, but received:', data);
    }
  } catch (err) {
    console.error('Failed to load users:', err);
  }
});

</script>

<div class="user-management">
  <div class="breadcrumb">
    <div class="icon">⚡</div>
    <span>General</span>
    <span class="separator">›</span>
    <span class="current">User Management</span>
  </div>
  
  <div class="page-header">
    <h1>User Management</h1>
    <p>Manage your swift users and their account permissions here.</p>
  </div>
  
  <UsersTable {users} />
</div>

<style>
  .user-management {
    padding: 20px 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #A5A4A1;
    font-size: 14px;
  }

  .breadcrumb .icon {
    font-size: 18px;
    margin-right: 10px;
    color: #B8BCBC;
  }

  .breadcrumb .separator {
    margin: 0 10px;
  }

  .breadcrumb .current {
    color: #07404B;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .page-header h1 {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 500;
    color: #07404B;
  }

  .page-header p {
    color: #A5A4A1;
  }
</style>