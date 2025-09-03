// src/components/polls/VoteResult.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';

type VoteResultProps = {
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
};

export function VoteResult({ question, options, totalVotes }: VoteResultProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{question}</h3>
      <p className="text-sm text-gray-500">{totalVotes} total votes</p>
      
      <div className="space-y-3">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          
          return (
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
          );
        })}
      </div>
    </div>
  );
}