// src/app/polls/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { VoteForm } from '@/components/polls/VoteForm';
import { VoteResult } from '@/components/polls/VoteResult';
import { QRCodeCard } from '@/components/polls/QRCodeCard';

// Mock data for the poll
const poll = {
  id: '123',
  question: 'Favorite Programming Language',
  description: 'What programming language do you prefer to use?',
  options: [
    { id: '1', text: 'JavaScript', votes: 42 },
    { id: '2', text: 'Python', votes: 35 },
    { id: '3', text: 'Java', votes: 28 },
    { id: '4', text: 'C#', votes: 19 },
    { id: '5', text: 'Go', votes: 15 },
  ],
  totalVotes: 139,
  createdAt: '10/15/2023',
  createdBy: 'John Doe',
  url: 'https://localhost/polls/123'
};

export default function PollDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="w-full border-b bg-white px-8 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">ALX Polly</div>
        <nav className="flex items-center space-x-8">
          <Link href="/polls" className="text-gray-700 font-medium hover:text-black">My Polls</Link>
          <Link href="/polls/create" className="text-gray-700 font-medium hover:text-black">Create Poll</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <button className="hidden md:block px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">Create Poll</button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 border">U</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-8 py-8">
        <Link href="/polls" className="text-blue-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Polls</Link>
        <div className="flex justify-end gap-2 mb-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 border">Edit Poll</button>
          <button className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 border">Delete</button>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-2xl font-bold mb-1">{poll.question}</h1>
          <div className="text-blue-600 text-sm mb-6">{poll.description}</div>
          
          {/* Toggle between voting and results */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Vote</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Results</button>
            </div>
            
            {/* Vote Form Component */}
            <VoteForm 
              pollId={poll.id}
              options={poll.options.map(opt => ({ id: opt.id, text: opt.text }))}
              onSubmitVote={(optionId: string) => {
                console.log('Vote submitted for option:', optionId);
              }}
            />
            
            {/* Vote Results Component (hidden by default) */}
            <div className="hidden">
              <VoteResult
                question={poll.question}
                options={poll.options}
                totalVotes={poll.totalVotes}
              />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Created by <span className="text-blue-700">{poll.createdBy}</span></span>
            <span>Created on {poll.createdAt}</span>
          </div>
        </div>
        
        {/* QR Code Component */}
        <div className="max-w-2xl mx-auto">
          <QRCodeCard pollUrl={poll.url} pollId={poll.id} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-4 text-center text-gray-400 text-sm mt-auto">
        © 2025 ALX Polly. All rights reserved.
      </footer>
    </div>
  );
}