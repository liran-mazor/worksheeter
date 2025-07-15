import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PageTransition({ children }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
    };

    const handleComplete = () => {
      setIsTransitioning(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
      <style jsx>{`
        .page-transition {
          min-height: 100vh;
          background: 
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
          transition: opacity 0.2s ease;
        }

        .page-transition.transitioning {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
} 