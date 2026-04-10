import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-brand-700/20 px-4">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" id="nav-logo">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600 text-white shadow-lg group-hover:bg-brand-500 transition-colors duration-200">
              <Zap size={16} className="fill-white" />
            </span>
            <span className="text-xl font-bold tracking-tight gradient-text">snip</span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <a href="#features" className="text-sm text-blue-200/70 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-blue-200/70 hover:text-white transition-colors duration-200">
              How it works
            </a>
            <a
              href="#shortener"
              id="nav-cta"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 glow-sm hover:glow"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile CTA */}
          <a
            href="#shortener"
            className="md:hidden px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200"
          >
            Start →
          </a>
        </div>
      </div>
    </header>
  );
}
