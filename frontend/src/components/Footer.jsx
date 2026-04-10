import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-brand-700/20 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-600 text-white">
            <Zap size={14} className="fill-white" />
          </span>
          <span className="text-lg font-bold gradient-text">snip</span>
        </div>

        {/* Tech stack note */}
        <p className="text-xs text-blue-200/30 text-center">
          Microservice architecture &mdash; Shortener &amp; Redirector services · MongoDB · Redis · Nginx
        </p>

        {/* Back to top */}
        <a
          href="#"
          className="text-xs text-blue-200/40 hover:text-brand-400 transition-colors duration-150"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
