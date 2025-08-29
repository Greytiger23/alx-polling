// src/components/auth/UserProfile.tsx
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
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium">Member since:</span> {user.createdAt}
          </div>
        </div>
        
        <div className="pt-4">
          <Button onClick={onLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}