'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

/**
 * AuthCard - Container for auth page content
 * 
 * Visual specs:
 * - max-w-md (handled by parent)
 * - shadow-xl
 * - rounded-lg
 * - border-purple-100
 * - bg-white
 */
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <Card className={cn('w-full shadow-xl border-purple-100', className)}>
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
