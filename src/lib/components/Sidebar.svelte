<script>

import LogoImage from '$lib/assets/swift_logo.png';

    const navItems = [
      { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
      { id: 'notifications', icon: 'bell', label: 'Notifications' },
      { id: 'user-management', icon: 'user', label: 'User Management', active: true },
      { id: 'reports', icon: 'bar-chart', label: 'Reports' },
      { id: 'gateway', icon: 'settings', label: 'Gateway' },
    ];
    
    function getIcon(name) {
      switch (name) {
        case 'grid':
          return '⊞';
        case 'bell':
          return '🔔';
        case 'user':
          return '👤';
        case 'bar-chart':
          return '📊';
        case 'settings':
          return '⚙️';
        default:
          return '●';
      }
    }
  </script>
  
  <aside class="sidebar">
    <div class="logo">
        <img src={LogoImage} alt="Logo" class="logo-icon" />
    </div>
    
    <nav>
      <div class="nav-section">
        <span class="nav-category">General</span>
        
        <ul class="nav-items">
          {#each navItems as item}
            <li class="nav-item {item.active ? 'active' : ''}">
              <a href="#{item.id}">
                <span class="icon">{getIcon(item.icon)}</span>
                <span class="label">{item.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </nav>
  </aside>
  
  <style>
    .sidebar {
      width: 260px;
      background-color: white;
      border-right: 1px solid #EBEBE8;
      padding: 20px;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
    }
  
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding-left: 10px;
    }
  
    .logo-icon {
        width: 90px;
        height: 90px;
        object-fit: contain;
        margin-right: 5px;
    }
  
  
    .nav-section {
      margin-bottom: 20px;
    }
  
    .nav-category {
      font-size: 14px;
      color: #A5A4A1;
      margin-bottom: 10px;
      display: block;
      padding-left: 10px;
    }
  
    .nav-items {
      list-style: none;
    }
  
    .nav-item {
      margin-bottom: 5px;
    }
  
    .nav-item a {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 6px;
      text-decoration: none;
      color: #07404B;
      transition: background-color 0.2s;
    }
  
    .nav-item a:hover {
      background-color: rgba(7, 64, 75, 0.05);
    }
  
    .nav-item.active a {
      background-color: rgba(7, 64, 75, 0.1);
    }
  
    .nav-item .icon {
      margin-right: 10px;
      color: #B8BCBC;
      width: 20px;
      text-align: center;
    }
  </style>