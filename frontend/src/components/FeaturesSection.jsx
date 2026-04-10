import { Zap, LayoutGrid, Clock, RotateCcw, BarChart3, Lock } from 'lucide-react';

const FEATURES = [
  {
    id: 'feature-speed',
    icon: <Zap size={24} className="text-brand-500" />,
    title: 'High Performance',
    desc: 'Low-latency redirects powered by a Redis cache layer for sub-5ms response times.',
  },
  {
    id: 'feature-scale',
    icon: <LayoutGrid size={24} className="text-indigo-400" />,
    title: 'Microservices',
    desc: 'Independently scalable services for link shortening and resolution.',
  },
  {
    id: 'feature-expiry',
    icon: <Clock size={24} className="text-blue-400" />,
    title: 'Auto Expiry',
    desc: 'Optional TTL policies to automatically purge links after a set period.',
  },
  {
    id: 'feature-idempotent',
    icon: <RotateCcw size={24} className="text-indigo-300" />,
    title: 'Idempotency',
    desc: 'Generating the same short code for duplicate URLs to ensure data integrity.',
  },
  {
    id: 'feature-clicks',
    icon: <BarChart3 size={24} className="text-brand-400" />,
    title: 'Real-time Analytics',
    desc: 'Automated click tracking built directly into the redirection flow.',
  },
  {
    id: 'feature-secure',
    icon: <Lock size={24} className="text-slate-400" />,
    title: 'Rate Limiting',
    desc: 'Protective measures to prevent API abuse and provide reliable service.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-4" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.2em] mb-4">
            Capabilities
          </p>
          <h2 id="features-heading" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Built for scale and{' '}
            <span className="text-white/40">reliability.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              id={f.id}
              className="glass rounded-3xl p-8 hover:bg-white/[0.02] border border-white/5 transition-all duration-300 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300 inline-block p-4 rounded-2xl bg-white/5">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
