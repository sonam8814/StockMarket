import { useEffect, useState } from 'react';

export function useDebounce(callback, delay) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const debouncedCallback = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(callback, delay);
    setTimeoutId(id);
  };

  return debouncedCallback;
}
