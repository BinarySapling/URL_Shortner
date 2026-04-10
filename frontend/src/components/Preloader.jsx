import { useEffect, useState } from 'react';

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setShow(false), 800);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-900 transition-all duration-700 ease-in-out
        ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}
      `}
    >
      <div className="relative flex flex-col items-center">
        {/* Minimal Logo */}
        <div className="relative w-20 h-20 mb-10">
          <div className="relative z-10 w-full h-full rounded-[2rem] glass border border-white/5 flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Snip" 
              className="w-12 h-12 grayscale opacity-40 animate-float"
            />
          </div>
        </div>

        {/* Brand Name - Subtle */}
        <h1 className="text-2x font-bold tracking-[0.3em] text-white/90 mb-8 uppercase">
          SNIP
        </h1>

        {/* Minimal Progress Line */}
        <div className="w-32 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 bg-white/20 w-1/2 animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
