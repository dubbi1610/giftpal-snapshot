'use client';

import { cn } from '@/lib/utils/cn';

/**
 * FormSuccess - Displays form success messages
 * 
 * Visual specs:
 * - text-sm
 * - text-green-600
 * - mt-2 (spacing from input)
 * - bg-green-50
 * - p-3
 * - rounded-lg
 * - border border-green-200
 */
interface FormSuccessProps {
  message?: string | null;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'text-sm text-green-700 mt-2 bg-green-50 p-3 rounded-lg border border-green-200',
        className
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
