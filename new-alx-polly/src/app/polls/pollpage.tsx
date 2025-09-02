// src/app/polls/page.tsx
import React from 'react';
import { PollCard } from '@/components/polls/PollCard';
import { getAllPolls } from '@/lib/supabase/db';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PollsPage() {
  const polls = await getAllPolls();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      
      {polls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No polls found. Be the first to create one!</p>
          <Link href="/polls/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <PollCard
              key={poll.id}
              id={poll.id}
              question={poll.title}
              optionCount={poll.options?.length || 0}
              voteCount={poll.total_votes || 0}
              createdAt={new Date(poll.created_at).toLocaleDateString()}
              createdBy={poll.creator?.full_name || poll.creator?.email || 'Anonymous'}
            />
          ))}
        </div>
      )}
    </div>
  );
}