import React, { useState, useEffect } from 'react';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      console.error('Caught error:', error, errorInfo);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []); // Run only once on mount

  if (hasError) {
    return <h1>Something went wrong.</h1>; // Or a custom error UI
  }

  return children;
}

export default ErrorBoundary;