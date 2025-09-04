// src/components/polls/VoteResult.tsx
import React, { memo } from 'react';
import { Card, CardContent } from '../ui/card';

type Option = {
  id: string;
  text: string;
  votes: number;
};

type VoteResultProps = {
  question: string;
  options: Option[];
  totalVotes: number;
};

// Extracted option component for better readability and performance
const VoteOption = memo(({ option, percentage }: { option: Option; percentage: number }) => (
  <Card key={option.id} className="overflow-hidden">
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-1">
        <span>{option.text}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
      </div>
    </CardContent>
  </Card>
));

VoteOption.displayName = 'VoteOption';

export function VoteResult({ question, options, totalVotes }: VoteResultProps) {
  // Prepare options with calculated percentages to avoid recalculation in render loop
  const optionsWithPercentages = options.map(option => ({
    option,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question}</h3>
      <p className="text-sm text-gray-500">{totalVotes} total votes</p>
      
      <div className="space-y-3">
        {optionsWithPercentages.map(({ option, percentage }) => (
          <VoteOption 
            key={option.id}
            option={option}
            percentage={percentage}
          />
        ))}
      </div>
    </div>
  );
}