<script>
    import UserRow from './UserRow.svelte';
    
    export let users = [];
    
    let allSelected = false;
    
    function toggleAllSelected() {
      allSelected = !allSelected;
      users = users.map(user => ({ ...user, selected: allSelected }));
    }
    
    function handleUserSelection(event) {
      const { userId, selected } = event.detail;
      users = users.map(user => 
        user.id === userId ? { ...user, selected } : user
      );
      
      // Check if all users are selected
      allSelected = users.every(user => user.selected);
    }
    
    function handleStatusChange(event) {
      const { userId, status } = event.detail;
      users = users.map(user => 
        user.id === userId ? { ...user, status } : user
      );
    }
    
    function handleRoleChange(event) {
      const { userId, role } = event.detail;
      users = users.map(user => 
        user.id === userId ? { ...user, role } : user
      );
    }
    
    function handleDeleteUser(event) {
      const { userId } = event.detail;
      users = users.filter(user => user.id !== userId);
    }
  </script>
  
  <div class="users-table-container">
    <table class="users-table">
      <thead>
        <tr>
          <th>
            <label class="checkbox-container">
              <input type="checkbox" bind:checked={allSelected} on:change={toggleAllSelected} />
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
          <UserRow 
            {user} 
            on:select={handleUserSelection}
            on:statusChange={handleStatusChange}
            on:roleChange={handleRoleChange}
            on:delete={handleDeleteUser}
          />
        {/each}
      </tbody>
    </table>
  </div>
  
  <style>
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
  </style>