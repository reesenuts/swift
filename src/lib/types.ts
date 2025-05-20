// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  // UI specific properties
  selected?: boolean;
  status?: string;
  dateCreated?: string;
  initial?: string;
}

// Authentication types
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UsersResponse extends ApiResponse {
  users: User[];
} 