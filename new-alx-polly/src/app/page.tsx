// src/app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to ALX Polling App</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create, share, and vote on polls. Get real-time results and insights.
        </p>
        
        <div className="flex justify-center space-x-4">
          <a 
            href="/polls" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse Polls
          </a>
          <a 
            href="/polls/create" 
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Create a Poll
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Create a Poll</h3>
            <p className="text-gray-600">Easily create polls with multiple options and customize settings.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Share with Others</h3>
            <p className="text-gray-600">Share your poll with friends, colleagues, or the community.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600">View real-time results and analytics for your polls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}