// src/components/polls/PollCard.tsx

/**
 * PollCard Component
 * 
 * A dashboard component that displays poll information in a card format for poll listings.
 * Shows poll metadata, statistics, and provides navigation to the full poll view.
 * 
 * Features:
 * - Displays poll question as the main title
 * - Shows poll statistics (option count, vote count)
 * - Displays creation metadata (date and creator)
 * - Provides "View Poll" button for navigation
 * - Uses flex layout to ensure consistent card heights in grid layouts
 * - Responsive design with proper text hierarchy
 * 
 * Usage:
 * - Rendered in poll listing pages (dashboard, browse polls)
 * - Used in grid layouts for poll discovery
 * - Integrates with Next.js routing for poll navigation
 * 
 * @param id - Unique poll identifier for navigation
 * @param question - The poll question/title to display
 * @param optionCount - Number of available voting options
 * @param voteCount - Total number of votes received
 * @param createdAt - Formatted creation date string
 * @param createdBy - Name or identifier of poll creator
 * 
 * @returns JSX element containing poll card with navigation
 * 
 * @example
 * ```tsx
 * <PollCard
 *   id="poll-123"
 *   question="What's your favorite programming language?"
 *   optionCount={4}
 *   voteCount={127}
 *   createdAt="January 15, 2024"
 *   createdBy="John Doe"
 * />
 * ```
 */

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
    {/* Flex column layout with full height for consistent grid alignment */}
    <Card className="h-full flex flex-col">
      {/* Poll question header - primary content */}
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      
      {/* Poll metadata section - grows to fill available space */}
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 space-y-1">
          {/* Number of voting options available */}
          <p>{optionCount} options</p>
          
          {/* Total vote count with proper pluralization */}
          <p>{voteCount} {voteCount === 1 ? 'vote' : 'votes'}</p>
          
          {/* Poll creation date for context */}
          <p>Created {createdAt}</p>
          
          {/* Poll creator attribution */}
          <p>By {createdBy}</p>
        </div>
      </CardContent>
      
      {/* Action footer - always at bottom due to flex layout */}
      <CardFooter>
        {/* Full-width navigation button to poll details */}
        <Button className="w-full">
          <a href={`/polls/${id}`}>View Poll</a>
        </Button>
      </CardFooter>
    </Card>
  );
}