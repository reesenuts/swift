<script>
    import { onMount } from 'svelte';
    
    let email = '';
    let password = '';
    let showPassword = false;
    let isLoading = false;
    let errorMessage = '';
    let successMessage = '';
    
    
    const logoUrl = '/logo/logo.png';
    
    
    function togglePasswordVisibility() {
      showPassword = !showPassword;
    }
    
    async function handleSubmit() {
      try {
        isLoading = true;
        errorMessage = '';
        successMessage = '';
        
        // Call your userController login endpoint
        const response = await fetch(`http://localhost:3000/server/controllers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include' // Include cookies if using session-based auth
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Handle successful login
        successMessage = 'Login successful!';
        
        // Store the token if your API returns one
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 1000);
        
      } catch (error) {
        // @ts-ignore
        errorMessage = error.message || 'An error occurred during login';
        console.error('Login error:', error);
      } finally {
        isLoading = false;
      }
    }
    
    function handleForgotPassword() {
      // Navigate to forgot password page or open modal
      window.location.href = '/forgot-password';
    }
    
    function handleSignUp() {
      // Navigate to sign up page
      window.location.href = '/createaccount';
    }
  </script>
  
  <div class="container">
    <div class="form-container">
      <div class="logo">
        <img src={logoUrl || "/placeholder.svg"} alt="Company Logo" class="custom-logo" />
      </div>
      
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
      
      {#if successMessage}
        <div class="success-message">
          {successMessage}
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="input-group">
          <input 
            type="email" 
            placeholder="your@email.com" 
            bind:value={email} 
            disabled={isLoading}
            required
          />
        </div>
        
        <div class="input-group password-group">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="password" 
            bind:value={password} 
            disabled={isLoading}
            required
          />
          <button 
            type="button" 
            class="password-toggle" 
            on:click={togglePasswordVisibility}
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              {#if showPassword}
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              {:else}
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              {/if}
            </svg>
          </button>
        </div>
        
        <button type="submit" class="continue-btn" disabled={isLoading}>
          {#if isLoading}
            <span class="loading-spinner"></span>
            Processing...
          {:else}
            Continue
          {/if}
        </button>
        
        <div class="forgot-password">
          <a href="forgot-password" on:click|preventDefault={handleForgotPassword}>Forgot Password?</a>
        </div>
      </form>
      
      <div class="signup-link">
        Don't have an account? <a href="/createaccount" on:click|preventDefault={handleSignUp}>Sign Up</a>
      </div>
    </div>
  </div>
  
  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .form-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 3rem;
    }
    
    .custom-logo {
      height: 32px;
      width: auto;
    }
    
    
    .error-message {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      background-color: #FEE2E2;
      color: #B91C1C;
      font-size: 0.875rem;
      text-align: center;
    }
    
    .success-message {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      background-color: #D1FAE5;
      color: #065F46;
      font-size: 0.875rem;
      text-align: center;
    }
    
    form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .input-group {
      width: 100%;
      position: relative;
    }
    
    .password-group {
      display: flex;
      align-items: center;
    }
    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 2rem;
      font-size: 1rem;
      outline: none;
    }
    
    input:focus {
      border-color: #a3d0c3;
      box-shadow: 0 0 0 3px rgba(163, 208, 195, 0.2);
    }
    
    input:disabled {
      background-color: #f9fafb;
      cursor: not-allowed;
    }
    
    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #a0aec0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    
    .password-toggle:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .continue-btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 2rem;
      font-size: 1rem;
      font-weight: 500;
      color: #4a5568;
      background: linear-gradient(to right, #7ba7d0, #a3d0c3);
      cursor: pointer;
      transition: opacity 0.2s;
      margin-top: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .continue-btn:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    .continue-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }
    
    .forgot-password a {
      color: #718096;
      font-size: 0.875rem;
      text-decoration: none;
    }
    
    .forgot-password a:hover {
      text-decoration: underline;
    }
    
    .signup-link {
      margin-top: 3rem;
      color: #718096;
      font-size: 0.875rem;
    }
    
    .signup-link a {
      color: #4a5568;
      font-weight: 500;
      text-decoration: none;
    }
    
    .signup-link a:hover {
      text-decoration: underline;
    }
  </style>