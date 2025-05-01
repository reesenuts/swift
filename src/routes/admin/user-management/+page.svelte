<script>
    import { onMount, createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    let users = [];
    let allSelected = false;
    
    onMount(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/all');
        const data = await res.json();
        
        if (data.success && Array.isArray(data.users)) {
          users = data.users.map(user => ({
            ...user,
            selected: false,
            status: 'Active', // Default status if not provided
            dateCreated: new Date(user.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            initial: user.username[0].toUpperCase(),
            role: user.role || 'User' // Default role if not provided
          }));
        } else {
          console.error('Expected an array of users, but received:', data);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    });
    
    function toggleAllSelected() {
      allSelected = !allSelected;
      users = users.map(user => ({ ...user, selected: allSelected }));
    }
    
    function handleUserSelection(userId) {
      users = users.map(user => 
        user.id === userId ? { ...user, selected: !user.selected } : user
      );
      
      // Check if all users are selected
      allSelected = users.every(user => user.selected);
    }
    
    function handleStatusChange(userId) {
      users = users.map(user => {
        if (user.id === userId) {
          const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
          return { ...user, status: newStatus };
        }
        return user;
      });
    }
    
    function handleRoleChange(userId) {
      users = users.map(user => {
        if (user.id === userId) {
          const newRole = user.role === 'Admin' ? 'User' : 'Admin';
          return { ...user, role: newRole };
        }
        return user;
      });
    }
    
    function handleDeleteUser(userId) {
      users = users.filter(user => user.id !== userId);
    }
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
    
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>
              <label class="checkbox-container">
                <input type="checkbox" checked={allSelected} on:change={toggleAllSelected} />
                <span class="checkmark"></span>
              </label>
            </th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user (user.id)}
            <tr>
              <td>
                <label class="checkbox-container">
                  <input type="checkbox" checked={user.selected} on:change={() => handleUserSelection(user.id)} />
                  <span class="checkmark"></span>
                </label>
              </td>
              <td class="user-cell">
                <div class="user-avatar">{user.initial || user.username[0].toUpperCase()}</div>
                <div class="user-info">
                  <div class="username">{user.username}</div>
                  <div class="email">{user.email}</div>
                </div>
              </td>
              <td>
                <div class="role-badge {user.role.toLowerCase()}" on:click={() => handleRoleChange(user.id)}>
                  {user.role}
                  <span class="dropdown-icon">▼</span>
                </div>
              </td>
              <td>
                <div class="status-badge {user.status.toLowerCase()}">
                  {user.status}
                </div>
              </td>
              <td>{user.dateCreated}</td>
              <td class="actions">
                <button class="btn {user.status === 'Active' ? 'disable' : 'enable'}" on:click={() => handleStatusChange(user.id)}>
                  {user.status === 'Active' ? 'Disable' : 'Enable'}
                </button>
                <button class="btn delete" on:click={() => handleDeleteUser(user.id)}>
                  <span class="trash-icon">🗑️</span>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
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
  
    .users-table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
  
    .users-table {
      width: 100%;
      border-collapse: collapse;
    }
  
    .users-table th {
      text-align: left;
      padding: 15px 20px;
      font-weight: 500;
      color: #A5A4A1;
      border-bottom: 1px solid #EBEBE8;
      font-size: 14px;
    }
  
    td {
      padding: 15px 20px;
      border-bottom: 1px solid #EBEBE8;
      font-size: 14px;
    }
  
    .checkbox-container {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .checkbox-container input {
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
  
    .checkmark {
      height: 20px;
      width: 20px;
      border-radius: 4px;
      border: 1px solid #EBEBE8;
      display: inline-block;
    }
  
    .checkbox-container:hover .checkmark {
      background-color: #f8f9fa;
    }
  
    .user-cell {
      display: flex;
      align-items: center;
    }
  
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: #07404B;
    }
  
    .user-info .username {
      font-weight: 500;
      margin-bottom: 2px;
      color: #07404B;
    }
  
    .user-info .email {
      color: #A5A4A1;
      font-size: 13px;
    }
  
    .role-badge {
      display: inline-flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 4px;
      background-color: rgba(7, 64, 75, 0.1);
      font-size: 13px;
      cursor: pointer;
      user-select: none;
    }
  
    .dropdown-icon {
      font-size: 10px;
      margin-left: 5px;
    }
  
    .role-badge.admin {
      background-color: rgba(7, 64, 75, 0.2);
      color: #07404B;
    }
  
    .role-badge.user {
      background-color: rgba(7, 64, 75, 0.1);
      color: #07404B;
    }
  
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 13px;
    }
  
    .status-badge.active {
      background-color: rgba(75, 181, 67, 0.1);
      color: #4BB543;
    }
  
    .status-badge.inactive {
      background-color: rgba(200, 200, 200, 0.2);
      color: #888;
    }
  
    .actions {
      display: flex;
      gap: 5px;
    }
  
    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 13px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }
  
    .btn.enable {
      background-color: rgba(75, 181, 67, 0.1);
      color: #4BB543;
    }
    
    .btn.disable {
      background-color: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }
  
    .btn.delete {
      background-color: transparent;
      color: #F44336;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
  
    .trash-icon {
      font-size: 16px;
    }
  </style>