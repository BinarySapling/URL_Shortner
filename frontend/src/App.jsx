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
          
          {/* Main Hero Container - Side-by-side on desktop */}
          <main className="max-w-7xl mx-auto px-6 lg:flex lg:items-center lg:gap-16 lg:min-h-[85vh] py-12 lg:py-0">
            <div className="lg:flex-1">
              <HeroSection />
            </div>
            <div className="lg:flex-1 lg:max-w-xl">
              <ShortenerCard onSuccess={addToHistory} />
            </div>
          </main>

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
