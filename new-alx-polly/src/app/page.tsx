// src/app/page.tsx

/**
 * HomePage Component (Dashboard)
 * 
 * The main dashboard page that serves as the application's landing page and user hub.
 * Displays a sample of polls with navigation and user interface elements.
 * 
 * Features:
 * - Application header with navigation and user controls
 * - Poll grid displaying sample poll data
 * - Responsive layout with mobile-first design
 * - Quick access to poll creation and management
 * - Clean, modern UI with proper spacing and typography
 * 
 * Layout Structure:
 * - Header: App branding, navigation links, user avatar
 * - Main: Page title, create button, poll grid
 * - Footer: Simple footer for additional links/info
 * 
 * Note: Currently uses static sample data for demonstration.
 * In production, this should fetch real poll data from the database.
 * 
 * @returns JSX element containing the complete dashboard page
 */

import Link from 'next/link';

// Sample poll data for demonstration - TODO: Replace with real database queries
const polls = [
  {
    title: 'Favorite Programming Language',
    description: 'What programming language do you prefer to use?',
    options: 5,
    votes: 42,
    created: '10/15/2023',
  },
  {
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you think is the best?',
    options: 4,
    votes: 38,
    created: '10/10/2023',
  },
  {
    title: 'Preferred Database',
    description: 'What database do you prefer to work with?',
    options: 5,
    votes: 27,
    created: '10/5/2023',
  },
];

export default function HomePage() {
  return (
    // Full-height container with light background
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Application Header - Navigation and User Controls */}
      <header className="w-full border-b bg-white px-8 py-4 flex items-center justify-between ">
        {/* App branding/logo */}
        <div className="font-bold text-xl">ALX Polly</div>
        
        {/* Main navigation links */}
        <nav className="flex items-center space-x-8">
          <Link href="/polls" className="text-gray-700 font-medium hover:text-black">My Polls</Link>
          <Link href="/polls/create" className="text-gray-700 font-medium hover:text-black">Create Poll</Link>
        </nav>
        
        {/* User controls section */}
        <div className="flex items-center space-x-2">
          {/* Desktop-only create poll button for quick access */}
          <button className="hidden md:block px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">Create Poll</button>
          {/* User avatar placeholder - TODO: Replace with actual user avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 border"></div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-8">
        {/* Page header with title and primary action */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Polls</h1>
          {/* Primary call-to-action for poll creation */}
          <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition">Create New Poll</button>
        </div>
        
        {/* Poll Grid - Responsive layout for poll cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {polls.map((poll, idx) => (
            // Individual poll card - TODO: Replace with PollCard component
            <div key={idx} className="bg-white p-6 rounded-lg shadow border border-gray-100">
              {/* Poll title - primary content */}
              <div className="text-lg font-semibold mb-1">{poll.title}</div>
              
              {/* Poll description - secondary content */}
              <div className="text-gray-600 mb-4">{poll.description}</div>
              
              {/* Poll metadata - options and vote counts */}
              <div className="text-sm text-gray-500 mb-1">{poll.options} options</div>
              <div className="text-sm text-gray-500 mb-1">{poll.votes} total votes</div>
              
              {/* Creation timestamp - least important info */}
              <div className="text-xs text-gray-400 mt-4">Created on {poll.created}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Application Footer - Placeholder for additional links/info */}
      <footer className="w-full border-t bg-white py-4 text-center text-gray-400 text-sm mt-auto">
        {/* Footer content can be added here (terms, privacy, etc.) */}
      </footer>
    </div>
  );
}