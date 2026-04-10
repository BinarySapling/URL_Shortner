import { useState, useEffect } from 'react';
import { Link2, Zap, Shield, Clock, BarChart2, RefreshCw, Server } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ShortenerCard from './components/ShortenerCard.jsx';
import HistorySection from './components/HistorySection.jsx';
import FeaturesSection from './components/FeaturesSection.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Footer from './components/Footer.jsx';
import Preloader from './components/Preloader.jsx';

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snip_history') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Artificial delay to show preloader
    const timer = setTimeout(() => setAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
    <>
      <Preloader />
      <div className={`relative min-h-screen transition-opacity duration-1000 ${appLoading ? 'opacity-0' : 'opacity-100'}`}>
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
    </>
  );
}
