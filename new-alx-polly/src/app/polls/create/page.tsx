// src/app/polls/create/page.tsx
import React from 'react';
import { PollForm } from '@/components/polls/PollForm';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
        
        <PollForm 
          onSubmit={(data) => {
            // This will be implemented with actual poll creation
            console.log('Poll creation data:', data);
          }}
        />
      </div>
    </div>
  );
}