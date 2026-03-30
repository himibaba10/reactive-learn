'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Global Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-6 animate-pulse">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Something went wrong!
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-[600px]">
        An unexpected error occurred while processing your request. We have been notified and are looking into it.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button
          onClick={() => reset()}
          size="lg"
          className="gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => (window.location.href = '/')}
          className="font-semibold"
        >
          Go back home
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted rounded-lg text-left text-xs font-mono overflow-auto max-w-full">
           <p className="font-bold text-destructive mb-2 uppercase tracking-widest text-[10px]">Developer Debug Info:</p>
           {error.message}
        </div>
      )}
    </div>
  );
}
