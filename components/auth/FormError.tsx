'use client';

import { cn } from '@/lib/utils/cn';

/**
 * FormError - Displays form error messages
 * 
 * Visual specs:
 * - text-sm
 * - text-red-600
 * - mt-2 (spacing from input)
 */
interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className={cn('text-sm text-red-600 mt-2', className)} role="alert">
      {message}
    </p>
  );
}
