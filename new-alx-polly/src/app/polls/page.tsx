// src/app/polls/page.tsx
import React from 'react';
import { PollCard } from '@/components/polls/PollCard';

export default function PollsPage() {
  // Mock data for polls
  const mockPolls = [
    {
      id: '1',
      question: 'What is your favorite programming language?',
      optionsCount: 4,
      voteCount: 42,
      createdAt: '2023-05-15',
      createdBy: 'John Doe'
    },
    {
      id: '2',
      question: 'Which framework do you prefer?',
      optionsCount: 3,
      voteCount: 28,
      createdAt: '2023-05-10',
      createdBy: 'Jane Smith'
    },
    {
      id: '3',
      question: 'How often do you code?',
      optionsCount: 5,
      voteCount: 15,
      createdAt: '2023-05-05',
      createdBy: 'Alex Johnson'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">All Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPolls.map(poll => (
          <PollCard
            key={poll.id}
            id={poll.id}
            question={poll.question}
            optionCount={poll.optionsCount}
            voteCount={poll.voteCount}
            createdAt={poll.createdAt}
            createdBy={poll.createdBy}
          />
        ))}
      </div>
      </div>
  );
}