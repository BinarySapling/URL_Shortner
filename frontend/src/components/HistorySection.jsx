import { Copy, Check, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function HistoryItem({ item }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = item.shortUrl;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <li className="border border-white/5 rounded-[1.25rem] p-4 flex items-center gap-5 hover:bg-white/[0.02] transition-all duration-300 group">
      {/* Short URL */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={item.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 font-medium text-sm hover:text-white transition-colors flex items-center gap-2 truncate"
          >
            {item.shortUrl}
            <ExternalLink size={12} className="opacity-20 shrink-0" />
          </a>
        </div>
        <p className="text-[10px] text-white/20 truncate uppercase tracking-wider">{item.originalUrl}</p>
      </div>

      {/* Time */}
      <span className="hidden sm:block text-[10px] font-bold text-white/10 shrink-0 uppercase tracking-widest">
        {timeAgo(item.createdAt)}
      </span>

      {/* Copy */}
      <button
        type="button"
        onClick={copy}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 hover:border-white/10 text-white/20 hover:text-white transition-all duration-200"
        aria-label={`Copy ${item.shortUrl}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </li>
  );
}

export default function HistorySection({ history, onClear }) {
  return (
    <section id="history" className="px-4 pb-32" aria-labelledby="history-heading">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 id="history-heading" className="text-sm font-bold text-white/30 uppercase tracking-[0.3em]">
            History
          </h2>
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-red-400 transition-colors duration-200 uppercase tracking-widest"
          >
            <Trash2 size={12} />
            Clear
          </button>
        </div>

        <ul className="flex flex-col gap-3" role="list">
          {history.map((item) => (
            <HistoryItem key={item.shortUrl} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

