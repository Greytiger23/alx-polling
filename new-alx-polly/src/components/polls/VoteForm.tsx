/**
 * VoteForm Component - Interactive Poll Voting Interface
 * 
 * A client-side component that renders a radio button form for poll voting.
 * Handles user selection, form validation, and submission state management.
 * 
 * Key Features:
 * - Single-choice radio button selection
 * - Real-time validation (submit disabled until option selected)
 * - Loading state management during vote submission
 * - Accessible form controls with proper labeling
 * 
 * @component
 * @example
 * ```tsx
 * <VoteForm 
 *   options={pollOptions}
 *   onVote={(optionId) => handleVoteSubmission(optionId)}
 *   isVoting={submissionInProgress}
 * />
 * ```
 */
// src/components/polls/VoteForm.tsx
'use client';

import React from 'react';
import { Button } from '../ui/button';

/**
 * Props interface for the VoteForm component
 * 
 * @interface VoteFormProps
 * @property {string} pollId - Unique identifier for the poll (omitted in actual usage)
 * @property {Array} options - Array of voting options with id and display text
 * @property {Function} onVote - Callback function triggered when user submits vote
 * @property {boolean} [isVoting] - Optional loading state flag during submission
 */
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
  // State: Track currently selected poll option (null = no selection)
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  /**
   * Handles form submission and vote casting
   * 
   * Prevents default form behavior and triggers the onVote callback
   * with the selected option ID. Includes validation to ensure an option
   * is selected before submission.
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    // Validation: Only submit if user has selected an option
     if (isVoting || !selectedOption) return; // Prevent double-submit and enforce selection
    onVote(selectedOption); // Trigger parent callback with selected option
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Options Container: Radio button group for poll choices */}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            {/* Radio Input: Single-choice selection for poll option */}
            <input
              type="radio"
              id={`option-${option.id}`} // Unique ID for accessibility
              name="poll-option" // Group name ensures single selection
              value={option.id}
              checked={selectedOption === option.id} // Controlled component
              onChange={() => setSelectedOption(option.id)} // Update selection state
              className="mr-2"
              disabled={isVoting} // Disable during submission
            />
            {/* Label: Clickable text associated with radio button */}
            <label htmlFor={`option-${option.id}`} className="text-sm">
              {option.text}
            </label>
          </div>
        ))}
      </div>

      {/* Submit Button: Vote submission with validation and loading states */}
      <Button 
        type="submit" 
        disabled={!selectedOption || isVoting} // Disabled until option selected or during submission
        className="w-full"
      >
        {/* Dynamic button text based on submission state */}
        {isVoting ? 'Submitting...' : 'Vote'}
      </Button>
    </form>
  );
}