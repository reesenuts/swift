<script lang="ts">
    import { onMount } from 'svelte';
    
    // State management with proper type annotations
    let currentStep = 1;
    let email: string = '';
    let password: string = '';
    let showPassword: boolean = false;
    let isLoading: boolean = false;
    let error: string | null = null;
    let success: boolean = false;
    
    const logoUrl: string = '/logo/logo.png';
    
    // Handle continue button click
    function handleContinue(): void {
      error = null;
      if (email && isValidEmail(email)) {
        currentStep = 2;
      } else if (!isValidEmail(email)) {
        error = "Please enter a valid email address";
      }
    }
    
    // Handle create account button click
    async function handleCreateAccount(): Promise<void> {
      error = null;
      if (password && password.length >= 8) {
        try {
          isLoading = true;
          
          // Send registration data to backend
          const response = await fetch(`http://localhost:3000/server/controllers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }
          
          // Registration successful
          success = true;
          console.log('Account created successfully:', data);
          
          // Optional: Redirect to dashboard or login page after successful registration
          // window.location.href = '/dashboard';
          
        } catch (err: unknown) {
          // Type guard for Error objects
          if (err instanceof Error) {
            error = err.message || 'An error occurred during registration';
          } else {
            error = 'An unknown error occurred during registration';
          }
          console.error('Registration error:', err);
        } finally {
          isLoading = false;
        }
      } else {
        error = "Password must be at least 8 characters long";
      }
    }
    
    // Simple email validation
    function isValidEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Handle form submission
    async function handleSubmit(event: Event): Promise<void> {
      event.preventDefault();
      if (currentStep === 1) {
        handleContinue();
      } else {
        await handleCreateAccount();
      }
    }
    
    // Toggle password visibility
    function togglePasswordVisibility(): void {
      showPassword = !showPassword;
    }
    
    // Handle "Log In" click
    function handleLogIn(): void {
      // Redirect to login page or show login modal
      window.location.href = '/admin/user-management';
    }
</script>
  
<div class="container">
  <div class="form-container">
    <!-- Logo -->
    <div class="logo-container">
      <img src={logoUrl || "/placeholder.svg"} alt="Swift logo" class="logo" />
    </div>
    
    {#if success}
      <!-- Success message -->
      <div class="success-message">
        <h1>Account created successfully!</h1>
        <p>You can now <a href="/login" class="link">log in</a> to your account.</p>
      </div>
    {:else}
      <form on:submit={handleSubmit}>
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        
        {#if currentStep === 1}
          <!-- Step 1: Email Input -->
          <h1>Let's create your swift account</h1>
          
          <div class="input-container">
            <input 
              type="email" 
              bind:value={email} 
              placeholder="your@email.com" 
              required
            />
          </div>
          
          <button type="submit" class="gradient-button" disabled={isLoading}>Continue</button>
        {:else}
          <!-- Step 2: Password Input -->
          <h1>Let's create a password for {email}</h1>
          
          <div class="input-container password-container">
            <input 
              type={showPassword ? 'text' : 'password'} 
              bind:value={password} 
              placeholder="password" 
              required
              minlength="8"
            />
            <button 
              type="button" 
              class="toggle-password" 
              on:click={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon">
                {#if showPassword}
                  <!-- Eye with slash (hidden) -->
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                {:else}
                  <!-- Eye (visible) -->
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                {/if}
              </svg>
            </button>
          </div>
          
          <button type="submit" class="gradient-button" disabled={isLoading}>
            {#if isLoading}
              <div class="spinner"></div>
              Creating...
            {:else}
              Create Account
            {/if}
          </button>
          
          <div class="terms">
            By creating an account, you agree to the 
            <a href="#terms" class="link">Terms of Service</a> and 
            <a href="#privacy" class="link">Privacy Policy</a>.
          </div>
        {/if}
      </form>
    {/if}
    
    <div class="login-prompt">
      Already have an account? <a href="/login" class="link-button" on:click={handleLogIn}>Log In</a>
    </div>
  </div>
</div>
  
<style>
  /* Container styles */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: white;
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
  
  /* Logo styles */
  .logo-container {
    margin-bottom: 2rem;
  }
  
  .logo {
    height: 32px;
    width: auto;
  }
  
  /* Form styles */
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  h1 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 500;
  }
  
  .input-container {
    width: 100%;
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  
  input:focus {
    border-color: #a3bffa;
    box-shadow: 0 0 0 3px rgba(163, 191, 250, 0.1);
  }
  
  /* Password field styles */
  .password-container {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #a0aec0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .eye-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  /* Button styles */
  .gradient-button {
    width: 100%;
    padding: 0.75rem 1rem;
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
  
  .gradient-button:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  .gradient-button:active:not(:disabled) {
    opacity: 0.8;
  }
  
  .gradient-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Terms text */
  .terms {
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #718096;
    text-align: center;
    line-height: 1.5;
  }
  
  /* Login prompt */
  .login-prompt {
    margin-top: 2rem;
    font-size: 0.875rem;
    color: #718096;
  }
  
  /* Link styles */
  .link, .link-button {
    color: #718096;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
  }
  
  .link:hover, .link-button:hover {
    color: #4a5568;
  }
  
  /* Error message */
  .error-message {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: #fed7d7;
    color: #c53030;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    text-align: center;
  }
  
  /* Success message */
  .success-message {
    text-align: center;
    padding: 2rem 0;
  }
  
  .success-message h1 {
    color: #38a169;
    margin-bottom: 1rem;
  }
  
  /* Loading spinner */
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #4a5568;
    animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
