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
    <section id="shortener" className="px-4 pb-20" aria-labelledby="shortener-heading">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-10 glow animate-fade-up" style={{ animationDelay: '0.1s' }}>

          {!result ? (
            <>
              {/* Card Header */}
              <div className="mb-8">
                <h2 id="shortener-heading" className="text-2xl font-bold text-white mb-2">
                  Shorten your URL
                </h2>
                <p className="text-blue-200/50 text-sm">
                  Paste your link below and we'll make it snappy.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* URL Input */}
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-surface-800 px-4 py-1 transition-all duration-200
                    ${error
                      ? 'border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                      : 'border-brand-700/40 focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(91,115,245,0.15)]'
                    }`}
                >
                  <Link2 size={18} className="text-brand-400 shrink-0" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(''); }}
                    placeholder="https://your-very-long-url.com/path/to/something"
                    className="flex-1 bg-transparent text-white placeholder-blue-200/30 text-sm py-3 outline-none"
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
                  <p id="url-error" role="alert" className="mt-2 text-red-400 text-xs pl-1 animate-fade-in">
                    {error}
                  </p>
                )}

                {/* TTL selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-1.5 text-blue-200/50 text-xs font-semibold uppercase tracking-wider">
                      <Clock size={12} className="text-brand-400" />
                      Auto-Delete Expiry
                    </div>
                    {ttl && (
                      <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/20 animate-pulse">
                        Privacy Mode Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 p-1.5 rounded-2xl glass-light border border-white/5" role="group" aria-label="Link expiry">
                    {TTL_OPTIONS.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        id={`ttl-${opt.value ?? 'never'}`}
                        onClick={() => setTtl(opt.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 border
                          ${ttl === opt.value
                            ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                            : 'glass-light border-brand-700/20 text-blue-200/60 hover:border-brand-500/40 hover:text-blue-200'
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
                  className="mt-6 w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-200 glow hover:glow flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                      Shortening…
                    </>
                  ) : (
                    'Shorten →'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ── Result Panel ── */
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                  <Check size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Your short link is ready!</p>
                  <p className="text-blue-200/40 text-xs mt-0.5">Click the link to open it in a new tab</p>
                </div>
              </div>

              {/* Short URL display */}
              <div className="bg-surface-800 rounded-2xl border border-brand-700/30 p-4 flex items-center gap-3 mb-4">
                <a
                  id="result-link"
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-brand-400 font-semibold hover:text-brand-300 transition-colors duration-150 truncate flex items-center gap-2"
                >
                  {result.shortUrl}
                  <ExternalLink size={14} className="shrink-0 opacity-60" />
                </a>
                <button
                  id="copy-btn"
                  type="button"
                  onClick={copyToClipboard}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all duration-150"
                  aria-label="Copy short URL"
                >
                  {copied
                    ? <><Check size={14} /> Copied!</>
                    : <><Copy size={14} /> Copy</>
                  }
                </button>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-3 text-xs text-blue-200/40 mb-6">
                <span>Code: <strong className="text-brand-400">{result.shortCode}</strong></span>
                {result.ttl && (
                  <span>Expires in: <strong className="text-blue-200/70">{result.ttl} day{result.ttl > 1 ? 's' : ''}</strong></span>
                )}
                <span className="text-green-400/70 font-medium">✓ Cached in Redis</span>
              </div>

              {/* Original URL */}
              <div className="p-3 rounded-xl bg-surface-700/50 mb-6">
                <p className="text-xs text-blue-200/40 mb-1">Original URL</p>
                <p className="text-xs text-blue-200/60 truncate">{result.originalUrl}</p>
              </div>

              <button
                id="shorten-another-btn"
                type="button"
                onClick={reset}
                className="w-full py-3 rounded-2xl glass-light border border-brand-700/20 hover:border-brand-500/40 text-blue-200/70 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Shorten another URL
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
