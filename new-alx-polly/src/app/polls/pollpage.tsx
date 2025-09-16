// src/app/polls/pollpage.tsx

/**
 * PollsPage Component
 * 
 * A server component that displays all available polls in a grid layout.
 * Fetches poll data from the database and renders them using PollCard components.
 * 
 * Features:
 * - Server-side data fetching for optimal performance
 * - Responsive grid layout for poll cards
 * - Empty state handling with call-to-action
 * - Quick access to poll creation
 * - Real-time poll data from Supabase
 * 
 * Layout Structure:
 * - Page header with title and create button
 * - Conditional rendering: empty state or poll grid
 * - PollCard components for each poll with navigation
 * 
 * Data Flow:
 * 1. Fetches all polls from database on server
 * 2. Renders grid of PollCard components
 * 3. Each card provides navigation to individual poll
 * 
 * @returns JSX element containing the polls listing page
 */

import React from 'react';
import { PollCard } from '@/components/polls/PollCard';
import { getAllPolls } from '@/lib/supabase/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PollsPage() {
  // Server-side data fetching - runs on each request for fresh data
  const polls = await getAllPolls();

  return (
    <div className="container mx-auto py-10">
      {/* Page header with title and primary action */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Polls</h1>
        {/* Quick access to poll creation */}
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      
      {/* Conditional rendering based on poll availability */}
      {polls.length === 0 ? (
        {/* Empty state - encourages user engagement */}
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No polls found. Be the first to create one!</p>
          {/* Call-to-action for first poll creation */}
          <Link href="/polls/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        {/* Poll grid - responsive layout for poll discovery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            {/* PollCard component with formatted data */}
            <PollCard
              key={poll.id}
              id={poll.id}
              question={poll.title}
              optionCount={poll.options?.length || 0} {/* Safe access with fallback */}
              voteCount={Number(poll.total_votes) || 0} {/* Safe access with fallback and type conversion */}
              createdAt={new Date(poll.created_at).toLocaleDateString()} {/* Format timestamp */}
              createdBy={poll.creator?.full_name || poll.creator?.email || 'Anonymous'} {/* Creator fallback chain */}
            />
          ))}
        </div>
)}
    </div>
  );
}