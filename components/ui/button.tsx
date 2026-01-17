'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient' | 'outlined' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900': variant === 'primary',
            'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-glow hover:shadow-glow-pink focus-visible:ring-purple-500': variant === 'gradient',
            'bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-500': variant === 'purple',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-900': variant === 'secondary',
            'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-900': variant === 'ghost',
            'bg-white/90 backdrop-blur-sm text-purple-600 border-2 border-purple-600 hover:bg-white hover:border-purple-700 focus-visible:ring-purple-500': variant === 'outlined',
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600': variant === 'danger',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
