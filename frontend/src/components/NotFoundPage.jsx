import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const isExpired = queryParams.get('reason') === 'expired';
  const isServerError = queryParams.get('reason') === 'server-error';

  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-[80vh]">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-indigo-500/10 p-10 rounded-3xl max-w-lg text-center shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <AlertCircle className="w-10 h-10 text-indigo-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Oops!!</h1>
        
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          {isExpired 
            ? "This short link has reached its expiration date and is no longer available."
            : isServerError
              ? "Our servers are experiencing a temporary hiccup. Please try again in a few moments."
              : "The URL you're looking for doesn't exist or might be typed incorrectly."}
        </p>

        <a 
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>
      </div>
    </main>
  );
}
