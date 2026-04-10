const STEPS = [
  {
    id: 'step-1',
    number: '01',
    title: 'Paste your URL',
    desc: 'Drop in any long URL — blog post, docs page, product link — anything starting with https://',
    icon: '🔗',
  },
  {
    id: 'step-2',
    number: '02',
    title: 'We generate a short code',
    desc: 'The backend creates a unique base-62 code, stores it in MongoDB, and warms the Redis cache instantly.',
    icon: '⚙️',
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Share the short link',
    desc: 'Copy your snappy link and share it anywhere. Visitors get redirected in milliseconds.',
    icon: '🚀',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4" aria-labelledby="how-heading">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs text-brand-300 font-medium mb-4 border border-brand-500/20">
            The process
          </div>
          <h2 id="how-heading" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            How it{' '}
            <span className="gradient-text">works</span>
          </h2>
        </div>

        {/* Steps */}
        <ol className="relative flex flex-col gap-0" role="list">
          {STEPS.map((step, index) => (
            <li key={step.id} id={step.id} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-brand-600/40 to-transparent" aria-hidden="true" />
              )}

              {/* Number circle */}
              <div className="shrink-0 w-12 h-12 rounded-2xl glass border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-400 z-10">
                {step.number}
              </div>

              {/* Content */}
              <div className="glass rounded-2xl p-5 flex-1 hover:border-brand-500/25 transition-all duration-200 hover:glow-sm">
                <div className="text-xl mb-2">{step.icon}</div>
                <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-blue-200/50 leading-relaxed">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
