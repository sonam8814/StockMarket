'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function TradingViewWidget({ scriptUrl, config, className, height = 400 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scriptUrl, config]);

  return (
    <div className={cn('tradingview-widget-container', className)} style={{ height }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
}