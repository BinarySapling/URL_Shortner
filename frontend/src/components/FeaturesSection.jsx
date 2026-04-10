const FEATURES = [
  {
    id: 'feature-speed',
    icon: '⚡',
    title: 'Blazing Fast',
    desc: 'Redis-first caching ensures redirects happen in under 5 ms — even under heavy load.',
  },
  {
    id: 'feature-scale',
    icon: '📡',
    title: 'Infinitely Scalable',
    desc: 'Microservice architecture lets you scale the redirector independently of the shortener.',
  },
  {
    id: 'feature-expiry',
    icon: '⏳',
    title: 'Self-Expiring Links',
    desc: 'Set a 1, 7, or 30-day TTL. Links automatically vanish from the database after expiry.',
  },
  {
    id: 'feature-idempotent',
    icon: '♻️',
    title: 'Idempotent',
    desc: "Shorten the same URL twice? You'll always get the same short code. No duplicate entries.",
  },
  {
    id: 'feature-clicks',
    icon: '📊',
    title: 'Click Tracking',
    desc: 'Every redirect increments the click counter automatically — built right into the DB query.',
  },
  {
    id: 'feature-secure',
    icon: '🔒',
    title: 'Rate Limited',
    desc: 'Built-in rate limiting protects the API from abuse, keeping it fast and fair for everyone.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs text-brand-300 font-medium mb-4 border border-brand-500/20">
            Why Snip?
          </div>
          <h2 id="features-heading" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Everything a URL shortener
            <span className="gradient-text block">should be.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              id={f.id}
              className="glass rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 hover:glow-sm group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-blue-200/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
