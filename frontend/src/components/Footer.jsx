import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-surface-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-[0.3em] text-white">SNIP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            </div>
            <p className="text-[10px] text-white/10 uppercase tracking-widest font-bold">
              Professional Link Management
            </p>
          </div>

          <nav className="flex items-center gap-10" aria-label="Footer navigation">
            <a href="#features" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              Privacy
            </a>
          </nav>

          <p className="text-[10px] text-white/10 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SNIP API
          </p>
        </div>
      </div>
    </footer>
  );
}
