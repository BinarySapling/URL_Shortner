export default function HeroSection() {
  return (
    <section className="pt-40 pb-20 px-4 text-center" aria-labelledby="hero-heading">
      <div className="max-w-4xl mx-auto animate-fade-up">
        {/* Badge */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="Snip" 
            className="w-20 h-20 mb-6 drop-shadow-[0_0_20px_rgba(91,115,245,0.4)] animate-float"
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-brand-300 font-medium border border-brand-500/20">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-dot inline-block" />
            Redis-cached · Sub-5ms redirects · Microservice backend
          </div>
        </div>

        {/* Heading */}
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
        >
          Short links.{' '}
          <span className="gradient-text block mt-1">Big impact.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste any URL and get a clean, shareable link in milliseconds.
          Powered by a high-performance microservice architecture.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#shortener"
            id="hero-cta-primary"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-200 glow hover:glow shadow-2xl"
          >
            Shorten a URL
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#features"
            id="hero-cta-secondary"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-light hover:border-brand-500/30 text-blue-200 font-medium text-lg transition-all duration-200"
          >
            See features
          </a>
        </div>

        {/* Floating stat pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-16">
          {[
            { label: 'Avg. redirect', value: '< 5 ms' },
            { label: 'Cache layer', value: 'Redis' },
            { label: 'Click tracking', value: 'Built-in' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-light px-5 py-3 rounded-2xl flex items-center gap-3"
            >
              <span className="text-xl font-bold gradient-text">{stat.value}</span>
              <span className="text-sm text-blue-200/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
