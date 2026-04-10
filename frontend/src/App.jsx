import { useState } from 'react';
import { Link2, Zap, Shield, Clock, BarChart2, RefreshCw, Server } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ShortenerCard from './components/ShortenerCard.jsx';
import HistorySection from './components/HistorySection.jsx';
import FeaturesSection from './components/FeaturesSection.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snip_history') || '[]');
    } catch {
      return [];
    }
  });

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev.filter((h) => h.shortUrl !== entry.shortUrl)].slice(0, 10);
      localStorage.setItem('snip_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('snip_history');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="blob-bg absolute w-[600px] h-[600px] top-[-100px] left-[-150px] opacity-20"
          style={{ background: 'radial-gradient(circle, #5b73f5, #3541cd)', animationDelay: '0s' }}
        />
        <div
          className="blob-bg absolute w-[500px] h-[500px] bottom-[-50px] right-[-100px] opacity-15"
          style={{ background: 'radial-gradient(circle, #a78bfa, #5b73f5)', animationDelay: '-3s' }}
        />
        <div
          className="blob-bg absolute w-[300px] h-[300px] top-[40%] left-[50%] opacity-10"
          style={{ background: 'radial-gradient(circle, #7b97fa, #4253e8)', animationDelay: '-6s' }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ShortenerCard onSuccess={addToHistory} />
        {history.length > 0 && (
          <HistorySection history={history} onClear={clearHistory} />
        )}
        <FeaturesSection />
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
}
