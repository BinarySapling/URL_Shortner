import { Link2, Cpu, Send } from 'lucide-react';

const STEPS = [
  {
    id: 'step-1',
    number: '01',
    title: 'Source URL',
    desc: 'Input your target destination URL. Our system validates the protocol and origin.',
    icon: <Link2 size={20} className="text-white/60" />,
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Code Generation',
    desc: 'The backend generates a collision-resistant short code and populates the cache.',
    icon: <Cpu size={20} className="text-white/60" />,
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Link Resolution',
    desc: 'Redirect requests are handled by high-concurrency nodes for near-instant access.',
    icon: <Send size={20} className="text-white/60" />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4" aria-labelledby="how-heading">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.2em] mb-4">
            Workflow
          </p>
          <h2 id="how-heading" className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Seamless <span className="text-white/40">operation.</span>
          </h2>
        </div>

        {/* Steps */}
        <ol className="relative flex flex-col gap-0" role="list">
          {STEPS.map((step, index) => (
            <li key={step.id} id={step.id} className="relative flex gap-10 pb-16 last:pb-0">
              {/* Connector line - more subtle */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-px bg-white/5" aria-hidden="true" />
              )}

              {/* Icon / Number Container */}
              <div className="shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-surface-800 z-10">
                <span className="text-[10px] font-bold text-white/30">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white/5">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-white/30 leading-relaxed max-w-lg font-light">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
