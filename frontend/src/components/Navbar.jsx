import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="bg-surface-900/80 backdrop-blur-lg border-b border-white/5 px-4">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" id="nav-logo">
            <span className="text-xl font-bold tracking-[0.2em] text-white">SNIP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
            <a href="#features" className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200">
              Capabilities
            </a>
            <a href="#how-it-works" className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200">
              Workflow
            </a>
            <a
              href="#shortener"
              id="nav-cta"
              className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-full bg-white text-surface-900 hover:bg-white/90 transition-all duration-200"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile CTA */}
          <a
            href="#shortener"
            className="md:hidden px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full bg-white text-surface-900 transition-all duration-200"
          >
            Start
          </a>
        </div>
      </div>
    </header>
  );
}
