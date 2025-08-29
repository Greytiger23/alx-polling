// src/components/polls/PollCard.tsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type PollCardProps = {
  id: string;
  question: string;
  optionCount: number;
  voteCount: number;
  createdAt: string;
  createdBy: string;
};

export function PollCard({ id, question, optionCount, voteCount, createdAt, createdBy }: PollCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 space-y-1">
          <p>{optionCount} options</p>
          <p>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</p>
          <p>Created {createdAt}</p>
          <p>By {createdBy}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <a href={`/polls/${id}`}>View Poll</a>
        </Button>
      </CardFooter>
    </Card>
  );
}