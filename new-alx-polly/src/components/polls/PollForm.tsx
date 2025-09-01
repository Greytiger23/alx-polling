// src/components/polls/PollForm.tsx
'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createPollFromObject } from '../../lib/supabase/actions';
import { useRouter } from 'next/navigation';
import { Poll } from '../../lib/supabase/types';

type PollFormProps = {
  initialData?: Partial<Poll> & {
    options?: string[];
  };
};

export function PollForm({ initialData }: PollFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState<string | undefined>((initialData as Poll)?.description || '');
  const [options, setOptions] = React.useState<string[]>(
    initialData?.options || 
    initialData?.options?.map(opt => opt.text) || 
    ['', '']
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const filteredOptions = options.filter(option => option.trim() !== '');
      
      if (!title.trim()) {
        setError('Poll title is required');
        return;
      }
      
      if (filteredOptions.length < 2) {
        setError('At least 2 options are required');
        return;
      }

      const result = await createPollFromObject({
        title: title.trim(),
        description: description?.trim() || undefined,
        options: filteredOptions
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      // Success - redirect to polls page
      router.push('/polls');
    } catch (_err) {
      setError('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Poll Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your poll title"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description (Optional)
        </label>
        <Input
          id="description"
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for your poll"
          disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <Button
              type="button"
              onClick={() => handleRemoveOption(index)}
              variant="destructive"
              disabled={options.length <= 2 || isSubmitting}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button 
          type="button" 
          onClick={handleAddOption} 
          variant="outline"
          disabled={isSubmitting || options.length >= 10}
        >
          Add Option
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
      </Button>
    </form>
  );
}