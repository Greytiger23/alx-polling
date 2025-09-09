/**
 * VoteResult Component - Poll Results Display Interface
 * 
 * A server-side compatible component that renders poll results with visual
 * vote distribution, percentages, and vote counts. Optimized for performance
 * with memoized sub-components and pre-calculated percentages.
 * 
 * Key Features:
 * - Visual progress bars showing vote distribution
 * - Percentage calculations with proper zero-division handling
 * - Responsive card-based layout
 * - Memoized option rendering for performance
 * - Accessible vote count display with proper pluralization
 * 
 * @component
 * @example
 * ```tsx
 * <VoteResult 
 *   question="What's your favorite programming language?"
 *   options={pollOptions}
 *   totalVotes={totalVoteCount}
 * />
 * ```
 */
// src/components/polls/VoteResult.tsx
import React, { memo } from 'react';
import { Card, CardContent } from '../ui/card';

/**
 * Individual poll option data structure
 * 
 * @interface Option
 * @property {string} id - Unique identifier for the option
 * @property {string} text - Display text for the option
 * @property {number} votes - Current vote count for this option
 */
type Option = {
  id: string;
  text: string;
  votes: number;
};

/**
 * Props interface for the VoteResult component
 * 
 * @interface VoteResultProps
 * @property {string} question - The poll question/title to display
 * @property {Option[]} options - Array of poll options with vote data
 * @property {number} totalVotes - Total number of votes across all options
 */
type VoteResultProps = {
  question: string;
  options: Option[];
  totalVotes: number;
};

/**
 * VoteOption - Memoized Individual Option Display Component
 * 
 * Renders a single poll option with visual vote representation.
 * Memoized to prevent unnecessary re-renders when parent updates.
 * 
 * Features:
 * - Progress bar visualization of vote percentage
 * - Proper vote count pluralization
 * - Responsive card layout
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Option} props.option - Option data (id, text, votes)
 * @param {number} props.percentage - Calculated percentage for this option
 */
const VoteOption = memo(({ option, percentage }: { option: Option; percentage: number }) => (
  <Card key={option.id} className="overflow-hidden">
    <CardContent className="p-4">
      {/* Header: Option text and percentage display */}
      <div className="flex justify-between items-center mb-1">
        <span>{option.text}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      
      {/* Progress Bar: Visual representation of vote percentage */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }} // Dynamic width based on vote percentage
        ></div>
      </div>
      
      {/* Vote Count: Displays raw vote numbers with proper pluralization */}
      <div className="mt-1 text-xs text-gray-500">
        {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
      </div>
    </CardContent>
  </Card>
));

VoteOption.displayName = 'VoteOption';

export function VoteResult({ question, options, totalVotes }: VoteResultProps) {
  /**
   * Pre-calculate percentages to optimize rendering performance
   * 
   * Calculates vote percentages for each option while handling edge cases:
   * - Zero division protection (returns 0% when totalVotes is 0)
   * - Rounded percentages for clean display
   * - Memoization-friendly data structure
   */
  const optionsWithPercentages = options.map(option => ({
    option,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
  }));

  return (
    <div className="space-y-4">
      {/* Poll Question: Main heading for the results */}
      <h3 className="text-xl font-semibold">{question}</h3>
      
      {/* Total Vote Count: Summary information */}
      <p className="text-sm text-gray-500">{totalVotes} total votes</p>
      
      {/* Results List: Individual option results with visual representation */}
      <div className="space-y-3">
        {optionsWithPercentages.map(({ option, percentage }) => (
          <VoteOption 
            key={option.id} // Unique key for React reconciliation
            option={option}
            percentage={percentage}
          />
        ))}
      </div>
    </div>
  );
}