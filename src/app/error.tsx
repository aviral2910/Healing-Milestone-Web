'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("GLOBAL ERROR CAUGHT:", error);
  }, [error]);

  return (
    <div style={{ padding: '40px', color: 'white', background: 'black', minHeight: '100vh' }}>
      <h2>Something went wrong!</h2>
      <pre style={{ color: 'red', whiteSpace: 'pre-wrap', marginTop: '20px' }}>
        {error.message}
      </pre>
      <pre style={{ color: 'pink', whiteSpace: 'pre-wrap', marginTop: '20px' }}>
        {error.stack}
      </pre>
      <button
        onClick={() => reset()}
        style={{ padding: '10px 20px', marginTop: '20px', background: 'white', color: 'black' }}
      >
        Try again
      </button>
    </div>
  );
}
