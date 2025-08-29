// src/components/polls/PollForm.tsx
'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type PollFormProps = {
  onSubmit?: (data: PollFormData) => void;
  initialData?: PollFormData;
};

type PollFormData = {
  question: string;
  options: string[];
};

export function PollForm({ onSubmit, initialData }: PollFormProps) {
  const [question, setQuestion] = React.useState(initialData?.question || '');
  const [options, setOptions] = React.useState<string[]>(initialData?.options || ['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        question,
        options: options.filter(option => option.trim() !== ''),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium mb-1">
          Poll Question
        </label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question here"
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium mb-1">Poll Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <Button
              type="button"
              onClick={() => handleRemoveOption(index)}
              variant="destructive"
              disabled={options.length <= 2}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddOption} variant="outline">
          Add Option
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Create Poll
      </Button>
    </form>
  );
}