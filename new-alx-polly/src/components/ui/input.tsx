// src/components/ui/input.tsx
// This is a placeholder for the Shadcn UI Input component
import React from 'react';

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
};

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
}: InputProps) {
  // This would be the actual Shadcn UI Input component
  // In a real implementation, this would use the Shadcn UI Input component
  
  // Placeholder implementation with Tailwind classes
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const classes = `${baseClasses} ${className}`;
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classes}
      id={id}
      name={name}
      required={required}
    />
  );
}