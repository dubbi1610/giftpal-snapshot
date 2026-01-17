import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <h2 className="mb-4 text-4xl font-bold text-slate-900">404</h2>
        <h3 className="mb-2 text-2xl font-semibold text-slate-800">
          Page Not Found
        </h3>
        <p className="mb-6 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="purple">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outlined">
            <Link href="/app">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
