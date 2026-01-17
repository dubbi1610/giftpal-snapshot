'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Something went wrong!
        </h2>
        <p className="mb-6 text-slate-600">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="purple">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outlined"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
