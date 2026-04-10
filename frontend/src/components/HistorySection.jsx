import { Copy, Check, ExternalLink, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function HistoryItem({ item }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.shortUrl);
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
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
    <li className="glass-light rounded-2xl p-4 flex items-center gap-4 hover:border-brand-500/20 transition-all duration-200 group">
      {/* Short URL */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={item.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 font-semibold text-sm hover:text-brand-300 transition-colors flex items-center gap-1.5 truncate"
          >
            {item.shortUrl}
            <ExternalLink size={12} className="opacity-60 shrink-0" />
          </a>
        </div>
        <p className="text-xs text-blue-200/40 truncate">{item.originalUrl}</p>
      </div>

      {/* Time */}
      <span className="hidden sm:block text-xs text-blue-200/30 shrink-0">
        {timeAgo(item.createdAt)}
      </span>

      {/* Copy */}
      <button
        type="button"
        onClick={copy}
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center glass-light hover:bg-brand-600/20 text-blue-200/50 hover:text-brand-400 transition-all duration-150"
        aria-label={`Copy ${item.shortUrl}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </li>
  );
}

export default function HistorySection({ history, onClear }) {
  return (
    <section id="history" className="px-4 pb-20" aria-labelledby="history-heading">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id="history-heading" className="text-lg font-semibold text-white">
            Recent links
            <span className="ml-2 text-xs font-normal text-blue-200/40">({history.length})</span>
          </h2>
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-blue-200/40 hover:text-red-400 transition-colors duration-150"
          >
            <Trash2 size={13} />
            Clear all
          </button>
        </div>

        <ul className="flex flex-col gap-2" role="list">
          {history.map((item) => (
            <HistoryItem key={item.shortUrl} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
