// src/components/auth/UserProfile.tsx

/**
 * UserProfile Component
 * 
 * A dashboard component that displays authenticated user information in a card format.
 * Provides user details (name, email, join date) and logout functionality.
 * 
 * Features:
 * - Displays user profile information in a clean card layout
 * - Shows user name, email, and account creation date
 * - Provides logout button with full-width styling
 * - Uses shadcn/ui components for consistent design
 * 
 * Usage:
 * - Typically rendered in user dashboard or profile pages
 * - Requires authenticated user data and logout handler
 * - Integrates with authentication system for logout functionality
 * 
 * @param user - User object containing profile information
 * @param user.id - Unique user identifier
 * @param user.name - User's display name
 * @param user.email - User's email address
 * @param user.createdAt - Account creation timestamp (formatted string)
 * @param onLogout - Callback function to handle user logout
 * 
 * @returns JSX element containing user profile card
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   user={{
 *     id: "123",
 *     name: "John Doe",
 *     email: "john@example.com",
 *     createdAt: "January 15, 2024"
 *   }}
 *   onLogout={() => handleLogout()}
 * />
 * ```
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type UserProfileProps = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  onLogout: () => void;
};

export function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <Card>
      {/* Profile header with title */}
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User information section - displays key profile details */}
        <div className="space-y-2">
          {/* User's display name */}
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
          
          {/* User's email address */}
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          
          {/* Account creation date - helps users track account age */}
          <div>
            <span className="font-medium">Member since:</span> {user.createdAt}
          </div>
        </div>
        
        {/* Logout action section - separated with padding for visual hierarchy */}
        <div className="pt-4">
          {/* Full-width logout button with outline variant for secondary action styling */}
          <Button onClick={onLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}