<script lang="ts">
    // Configuration - Update these to match your backend endpoints
    const API_BASE_URL = 'http://localhost:3000/server'; // Change this to your backend URL
    const ENDPOINTS = {
      sendVerificationCode: `${API_BASE_URL}/backend_foldername`,
      verifyCode: `${API_BASE_URL}/backend_foldername`,
      resetPassword: `${API_BASE_URL}/backend_foldername`
    };
  
    // State management
    let currentStep: number = 1;
    let email: string = '';
    let verificationCode: string[] = ['', '', '', '', ''];
    let isLoading: boolean = false;
    let error: string | null = null;
    let sessionToken: string | null = null; // To store any session token from the backend
    
    const logoUrl = '/logo/logo.png';
    
    // Handle continue button click for email step
    async function handleEmailContinue(): Promise<void> {
      if (!email) {
        error = "Please enter your email address";
        return;
      }
      
      if (!isValidEmail(email)) {
        error = "Please enter a valid email address";
        return;
      }
      
      error = null;
      isLoading = true;
      
      try {
        // Send request to backend to send verification code
        const response = await fetch(ENDPOINTS.sendVerificationCode, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send verification code');
        }
        
        // Store session token if provided by backend
        if (data.token) {
          sessionToken = data.token;
        }
        
        // Move to verification code step
        currentStep = 2;
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'An unexpected error occurred';
        }
        console.error('Error sending verification code:', err);
      } finally {
        isLoading = false;
      }
    }
    
    // Handle continue button click for verification code step
    async function handleVerificationContinue(): Promise<void> {
      const code = verificationCode.join('');
      if (code.length !== 5) {
        error = "Please enter the complete verification code";
        return;
      }
      
      error = null;
      isLoading = true;
      
      try {
        // Send request to backend to verify code
        const response = await fetch(ENDPOINTS.verifyCode, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
          },
          body: JSON.stringify({ 
            email,
            code
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to verify code');
        }
        
        // Update session token if provided
        if (data.token) {
          sessionToken = data.token;
        }
        
        // Handle successful verification
        // You might want to redirect to a password reset page or dashboard
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // Default success behavior
          alert("Verification successful!");
        }
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'An unexpected error occurred';
        }
        console.error('Error verifying code:', err);
      } finally {
        isLoading = false;
      }
    }
    
    // Handle resend code click
    async function handleResendCode(): Promise<void> {
      isLoading = true;
      
      try {
        // Send request to backend to resend verification code
        const response = await fetch(ENDPOINTS.sendVerificationCode, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` })
          },
          body: JSON.stringify({ 
            email,
            resend: true
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to resend verification code');
        }
        
        // Update session token if provided
        if (data.token) {
          sessionToken = data.token;
        }
        
        // Reset verification code fields
        verificationCode = ['', '', '', '', ''];
        
        // Focus the first input field
        setTimeout(() => {
          const firstInput = document.querySelector('input[data-index="0"]') as HTMLInputElement;
          if (firstInput) firstInput.focus();
        }, 0);
        
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'An unexpected error occurred';
        }
        console.error('Error resending verification code:', err);
      } finally {
        isLoading = false;
      }
    }
    
    // Handle form submission
    function handleSubmit(event: Event): void {
      event.preventDefault();
      if (currentStep === 1) {
        handleEmailContinue();
      } else {
        handleVerificationContinue();
      }
    }
    
    // Handle input change for verification code
    function handleCodeInput(index: number, event: Event): void {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      
      // Only allow one character
      if (value.length > 1) {
        verificationCode[index] = value.charAt(0);
      }
      
      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
    
    // Handle keydown for verification code
    function handleCodeKeyDown(index: number, event: KeyboardEvent): void {
      // Handle backspace
      if (event.key === 'Backspace') {
        if (!verificationCode[index] && index > 0) {
          const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            verificationCode[index - 1] = '';
          }
        }
      }
    }
    
    // Handle paste for verification code
    function handleCodePaste(event: ClipboardEvent): void {
      event.preventDefault();
      const pastedData = event.clipboardData?.getData('text') || '';
      const digits = pastedData.replace(/\D/g, '').split('').slice(0, 5);
      
      digits.forEach((digit, index) => {
        if (index < 5) {
          verificationCode[index] = digit;
        }
      });
      
      // Focus the next empty input or the last one
      const emptyIndex = verificationCode.findIndex(v => !v);
      const focusIndex = emptyIndex === -1 ? 4 : emptyIndex;
      const input = document.querySelector(`input[data-index="${focusIndex}"]`) as HTMLInputElement;
      if (input) input.focus();
    }
    
    // Simple email validation
    function isValidEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Handle "Log In" click
    function handleLogIn(): void {
      // Redirect to login page
      window.location.href = '/login';
    }
  </script>
  
  <div class="container">
    <div class="form-container">
      <!-- Logo -->
      <div class="logo-container">
        <img src={logoUrl || "/placeholder.svg"} alt="Swift logo" class="logo" />
      </div>
      
      <form on:submit={handleSubmit}>
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        
        {#if currentStep === 1}
          <!-- Step 1: Email Input -->
          <h2>password verification</h2>
          
          <div class="input-container">
            <input 
              type="email" 
              bind:value={email} 
              placeholder="your@email.com" 
              required
            />
          </div>
          
          <button type="submit" class="gradient-button" disabled={isLoading}>
            {#if isLoading}
              <div class="spinner"></div>
            {:else}
              Continue
            {/if}
          </button>
        {:else}
          <!-- Step 2: Verification Code Input -->
          <h2>we sent a code to {email}</h2>
          
          <div class="code-container">
            {#each verificationCode as _, index}
              <input 
                type="text" 
                maxlength="1"
                data-index={index}
                bind:value={verificationCode[index]}
                on:input={(e) => handleCodeInput(index, e)}
                on:keydown={(e) => handleCodeKeyDown(index, e)}
                on:paste={handleCodePaste}
                inputmode="numeric"
                pattern="[0-9]*"
              />
            {/each}
          </div>
          
          <div class="resend-container">
            <span>didn't receive the email?</span>
            <button type="button" class="resend-button" on:click={handleResendCode}>
              click resend
            </button>
          </div>
          
          <button type="submit" class="gradient-button" disabled={isLoading}>
            {#if isLoading}
              <div class="spinner"></div>
            {:else}
              Continue
            {/if}
          </button>
        {/if}
      </form>
      
      <div class="login-prompt">
        Go back to <button class="link-button" on:click={handleLogIn}>Log In</button>
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
    
    h2 {
      font-size: 1.1rem;
      color: #5f7a8b;
      margin-bottom: 2rem;
      text-align: center;
      font-weight: 500;
    }
    
    .input-container {
      width: 100%;
      margin-bottom: 1.5rem;
    }
    
    input[type="email"] {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    
    input[type="email"]:focus {
      border-color: #a3bffa;
      box-shadow: 0 0 0 3px rgba(163, 191, 250, 0.1);
    }
    
    /* Verification code input styles */
    .code-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      width: 100%;
    }
    
    .code-container input {
      width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 1.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .code-container input:focus {
      border-color: #a3bffa;
      box-shadow: 0 0 0 3px rgba(163, 191, 250, 0.1);
    }
    
    /* Resend container */
    .resend-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: #718096;
    }
    
    .resend-button {
      background: none;
      border: none;
      color: #5f7a8b;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      font-size: 0.875rem;
      text-decoration: underline;
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
      height: 3rem;
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
    
    /* Login prompt */
    .login-prompt {
      margin-top: 2rem;
      font-size: 0.875rem;
      color: #718096;
      display: flex;
      gap: 0.25rem;
    }
    
    /* Link styles */
    .link-button {
      color: #5f7a8b;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font: inherit;
    }
    
    .link-button:hover {
      text-decoration: underline;
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
    
    /* Loading spinner */
    .spinner {
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #4a5568;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
