<script>
    export let user;



  user.status = user.status || 'Active'; // default status if not from DB
  user.selected = user.selected || false;
  user.initial = user.username ? user.username[0].toUpperCase() : '?';
  user.dateCreated = user.dateCreated || new Date().toLocaleDateString(); // fallback for display

  
    
    function toggleSelected() {
      dispatch('select', {
        userId: user.id,
        selected: !user.selected
      });
    }
    
    function toggleStatus() {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      dispatch('statusChange', {
        userId: user.id,
        status: newStatus
      });
    }
    
    function changeRole() {
      const newRole = user.role === 'Admin' ? 'User' : 'Admin';
      dispatch('roleChange', {
        userId: user.id,
        role: newRole
      });
    }
    
    function deleteUser() {
      dispatch('delete', {
        userId: user.id
      });
    }
  </script>
  
  <tr>
    <td>
      <label class="checkbox-container">
        <input type="checkbox" checked={user.selected} on:change={toggleSelected} />
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
      <div class="role-badge {user.role.toLowerCase()}" on:click={changeRole}>
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
      <button class="btn {user.status === 'Active' ? 'disable' : 'enable'}" on:click={toggleStatus}>
        {user.status === 'Active' ? 'Disable' : 'Enable'}
      </button>
      <button class="btn delete" on:click={deleteUser}>
        <span class="trash-icon">🗑️</span>
      </button>
    </td>
  </tr>
  
  <style>
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