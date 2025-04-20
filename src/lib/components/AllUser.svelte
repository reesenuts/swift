<script>
    import { onMount } from 'svelte';
    import UserTable from './UserTable.svelte';
  
    let users = [];
  
    onMount(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/all');
        const data = await res.json();
        if (data.success) {
          users = data.users.map(user => ({
            ...user,
            selected: false,
            status: 'Active', // You can update this to match real data if available
            dateCreated: new Date(user.created_at).toLocaleDateString(),
            initial: user.username[0].toUpperCase()
          }));
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    });
  </script>
  
  <UserTable {users} />
  