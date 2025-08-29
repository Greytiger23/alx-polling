// src/app/auth/login/page.tsx
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
          <div className="space-y-4">
            <LoginForm 
              onSubmit={(data) => {
                // This will be implemented with actual authentication
                console.log('Login attempt:', data);
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}