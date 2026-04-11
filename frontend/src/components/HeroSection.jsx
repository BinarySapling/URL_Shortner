export default function HeroSection() {
  const scrollToInput = () => {
    const input = document.getElementById('url-input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="text-left animate-fade-up" aria-labelledby="hero-heading">
      <div className="max-w-xl">
        {/* Subtle Brand Prefix */}
        <p className="text-xs font-bold text-brand-500 uppercase tracking-[0.4em] mb-6">
          Snip v2.0
        </p>

        {/* Heading - Poppins emphasis */}
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white"
        >
          Shorten <span className="text-white/20">your</span> <br />
          Perspective<span className="text-brand-500">.</span>
        </h1>

        {/* Subtext - Muted */}
        <p className="text-lg md:text-xl text-white/40 mb-0 leading-relaxed font-light">
          A minimalist interface for professional link management. 
          Blazing fast resolution with sub-5ms latency.
        </p>
      </div>
    </section>
  );
}
