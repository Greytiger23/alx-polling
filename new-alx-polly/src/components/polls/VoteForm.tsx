// src/components/polls/VoteForm.tsx
'use client';

import React from 'react';
import { Button } from '../ui/button';

type VoteFormProps = {
  pollId: string;
  options: {
    id: string;
    text: string;
  }[];
  onVote: (optionId: string) => void;
  isVoting?: boolean;
};

export function VoteForm({ options, onVote, isVoting = false }: Omit<VoteFormProps, 'pollId'>) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      onVote(selectedOption);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              id={`option-${option.id}`}
              name="poll-option"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
              className="mr-2"
              disabled={isVoting}
            />
            <label htmlFor={`option-${option.id}`} className="text-sm">
              {option.text}
            </label>
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        disabled={!selectedOption || isVoting}
        className="w-full"
      >
        {isVoting ? 'Submitting...' : 'Vote'}
      </Button>
    </form>
  );
}