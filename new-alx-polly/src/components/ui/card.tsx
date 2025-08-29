// src/components/ui/card.tsx
// This is a placeholder for the Shadcn UI Card component

import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  // This would be the actual Shadcn UI Card component
  // In a real implementation, this would use the Shadcn UI Card component
  
  // Placeholder implementation with Tailwind classes
  const classes = `rounded-lg border bg-card text-card-foreground shadow-sm ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardTitle({ children, className = '' }: CardTitleProps) {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`;
  
  return (
    <h3 className={classes}>
      {children}
    </h3>
  );
}

type CardDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  const classes = `text-sm text-muted-foreground ${className}`;
  
  return (
    <p className={classes}>
      {children}
    </p>
  );
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className = '' }: CardContentProps) {
  const classes = `p-6 pt-0 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardFooter({ children, className = '' }: CardFooterProps) {
  const classes = `flex items-center p-6 pt-0 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}