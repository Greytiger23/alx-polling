// src/app/auth/register/page.tsx
import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
          <div className="space-y-4">
            <RegisterForm 
              onSubmit={(data) => {
                // This will be implemented with actual registration
                console.log('Registration attempt:', data);
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}