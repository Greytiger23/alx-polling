/**
 * Authentication utilities and hooks for the ALX Polly application.
 * 
 * This module provides a centralized interface for all authentication operations
 * including user registration, login, logout, and user session management.
 * It abstracts the Supabase authentication API to provide a consistent interface
 * throughout the application.
 * 
 * @module auth
 */

import { supabase } from './client';

/**
 * Represents a user in the ALX Polly system.
 * 
 * @interface User
 * @property {string} id - Unique identifier for the user from Supabase Auth
 * @property {string} email - User's email address used for authentication
 * @property {string} [username] - Optional display name stored in user metadata
 */
export type User = {
  id: string;
  email: string;
  username?: string;
};

/**
 * Authentication service object containing all auth-related operations.
 * 
 * This object provides methods for user authentication, session management,
 * and user data retrieval. All methods are async and return promises.
 */
export const auth = {
  /**
   * Retrieves the currently authenticated user's information.
   * 
   * This method fetches the current user session from Supabase and transforms
   * the user data into our application's User type. It handles cases where
   * no user is logged in or when there are authentication errors.
   * 
   * @returns {Promise<User | null>} The current user object or null if not authenticated
   * @throws {Error} When there's an unexpected error during user retrieval
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Fetch current user session from Supabase Auth
      const { data, error } = await supabase.auth.getUser();
      
      // Return null if there's an error or no user data
      if (error || !data?.user) return null;
      
      // Transform Supabase user data to our User type
      return {
        id: data.user.id,
        email: data.user.email || 'unknown@example.com', // Fallback to empty string if email is null
        username: data.user.user_metadata?.username, // Extract username from metadata
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  /**
   * Authenticates a user with email and password.
   * 
   * This method attempts to sign in a user using their email and password.
   * It uses Supabase's built-in authentication system and returns the result
   * which includes user data on success or error information on failure.
   * 
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @returns {Promise<AuthResponse>} Supabase auth response with user data or error
   * @throws {Error} When there's a network error or invalid credentials
   */
  signIn: async (email: string, password: string) => {
    try {
      // Attempt to sign in with Supabase Auth
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      // Log successful sign-in (without sensitive data)
      if (result.data.user) {
        console.log('User signed in successfully:', result.data.user.email);
      }
      
      return result;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  },
  
  /**
   * Registers a new user with email, password, and username.
   * 
   * This method creates a new user account in Supabase Auth and stores
   * the username in the user's metadata. The user will need to verify
   * their email address before they can sign in (depending on Supabase config).
   * 
   * @param {string} email - The new user's email address
   * @param {string} password - The new user's password (should meet security requirements)
   * @param {string} username - Display name for the user (stored in metadata)
   * @returns {Promise<AuthResponse>} Supabase auth response with user data or error
   * @throws {Error} When email is already taken or password doesn't meet requirements
   */
  signUp: async (email: string, password: string, username: string) => {
    try {
      // Create new user account with metadata
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username } // Store username in user metadata
        }
      });
      
      // Log successful registration (without sensitive data)
      if (result.data.user) {
        console.log('User registered successfully:', result.data.user.email);
      }
      
      return result;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  },
  
  /**
   * Signs out the currently authenticated user.
   * 
   * This method clears the user's session from both the client and server.
   * After successful sign out, the user will need to authenticate again
   * to access protected resources.
   * 
   * @returns {Promise<{error: AuthError | null}>} Supabase sign out response
   * @throws {Error} When there's an error during the sign out process
   */
  signOut: async () => {
    try {
      // Sign out from Supabase Auth
      const result = await supabase.auth.signOut();
      
      // Log successful sign out
      if (!result.error) {
        console.log('User signed out successfully');
      }
      
      return result;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  },
};