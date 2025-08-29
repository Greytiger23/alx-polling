// src/app/auth/profile/page.tsx
import React from 'react';
import { UserProfile } from '@/components/auth/UserProfile';

export default function ProfilePage() {
  // This is a placeholder for user data
  // In a real application, this would be fetched from an API or context
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date().toLocaleDateString(),
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <UserProfile 
          user={mockUser} 
          onLogout={() => {
            // This will be implemented with actual logout functionality
            console.log('User logged out');
          }} 
        />
      </div>
    </div>
  );
}