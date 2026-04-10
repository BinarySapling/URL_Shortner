import { useState, useRef } from 'react';
import { Link2, Copy, Check, ExternalLink, RotateCcw, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { shortenUrl } from '../api.js';

const TTL_OPTIONS = [
  { label: 'Never', value: null },
  { label: '1 Day',  value: 1  },
  { label: '7 Days', value: 7  },
  { label: '30 Days', value: 30 },
];

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ShortenerCard({ onSuccess }) {
  const [url, setUrl]         = useState('');
  const [ttl, setTtl]         = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [result, setResult]   = useState(null);
  const [copied, setCopied]   = useState(false);
  const inputRef              = useRef(null);

  const reset = () => {
    setResult(null);
    setUrl('');
    setError('');
    setTtl(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    try {
      const data = await shortenUrl(trimmed, ttl);
      setResult({ ...data, originalUrl: trimmed, ttl });
      onSuccess({ ...data, originalUrl: trimmed, ttl, createdAt: new Date().toISOString() });
      toast.success('Short link created!');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      toast.error(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = result.shortUrl;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for non-HTTPS or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        toast.error('Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section id="shortener" className="px-4 pb-12" aria-labelledby="shortener-heading">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-3xl p-6 md:p-8 glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {!result ? (
            <>
              {/* Card Header */}
              <div className="mb-10">
                <h2 id="shortener-heading" className="text-2xl font-semibold text-white mb-2">
                  Shorten Link
                </h2>
                <p className="text-white/30 text-sm font-light">
                  Paste your URL below to generate a high-performance short link.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* URL Input */}
                <div
                  className={`flex items-center gap-4 rounded-2xl border bg-white/5 px-5 py-2 transition-all duration-300
                    ${error
                      ? 'border-red-500/40'
                      : 'border-white/5 focus-within:border-brand-500/50'
                    }`}
                >
                  <Link2 size={20} className="text-white/20 shrink-0" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(''); }}
                    placeholder="https://example.com/long-url"
                    className="flex-1 bg-transparent text-white placeholder-white/10 text-base py-3 outline-none font-light"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="URL to shorten"
                    aria-describedby={error ? 'url-error' : undefined}
                    aria-invalid={!!error}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p id="url-error" role="alert" className="mt-3 text-red-400 text-xs pl-1">
                    {error}
                  </p>
                )}

                {/* TTL selector */}
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                      Expiry Policy
                    </p>
                  </div>
                  <div className="flex gap-2" role="group" aria-label="Link expiry">
                    {TTL_OPTIONS.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        id={`ttl-${opt.value ?? 'never'}`}
                        onClick={() => setTtl(opt.value)}
                        className={`px-5 py-2 rounded-xl text-xs transition-all duration-200 border
                          ${ttl === opt.value
                            ? 'bg-white text-surface-900 border-white font-semibold'
                            : 'bg-transparent border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                          }`}
                        aria-pressed={ttl === opt.value}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="shorten-btn"
                  type="submit"
                  disabled={loading}
                  className="mt-10 w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin-slow" />
                  ) : (
                    'Generate Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ── Result Panel ── */
            <div className="animate-fade-up">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                  <Check size={24} className="text-white/40" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Link Generated</h3>
                  <p className="text-white/30 text-sm font-light">Your short URL is ready for use.</p>
                </div>
              </div>

              {/* Short URL display */}
              <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex items-center gap-4 mb-6">
                <a
                  id="result-link"
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-white/80 font-medium hover:text-white transition-colors duration-200 truncate flex items-center gap-2"
                >
                  {result.shortUrl}
                  <ExternalLink size={14} className="shrink-0 opacity-20" />
                </a>
                <button
                  id="copy-btn"
                  type="button"
                  onClick={copyToClipboard}
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-surface-900 text-sm font-semibold transition-all duration-200 hover:bg-white/90"
                  aria-label="Copy short URL"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-6 text-[11px] text-white/20 mb-10 uppercase tracking-widest font-semibold">
                <span>Code <strong className="text-white/60">{result.shortCode}</strong></span>
                {result.ttl && (
                  <span>Expires <strong className="text-white/60">{result.ttl}d</strong></span>
                )}
                <span className="text-white/10 italic font-light">Cached in Redis</span>
              </div>

              <button
                id="shorten-another-btn"
                type="button"
                onClick={reset}
                className="w-full py-4 rounded-2xl border border-white/5 hover:border-white/10 text-white/40 hover:text-white font-medium text-sm transition-all duration-300 flex items-center justify-center gap-3"
              >
                <RotateCcw size={16} />
                Generate Another
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
