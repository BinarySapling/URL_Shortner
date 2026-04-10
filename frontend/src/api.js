// API configuration
// In development, we default to localhost:3001
// In production (Docker/Nginx), we use relative paths
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

/**
 * POST /api/shorten
 * @param {string} originalUrl
 * @param {number|null} ttlDays
 * @returns {Promise<{ shortCode: string, shortUrl: string }>}
 */
export async function shortenUrl(originalUrl, ttlDays = null) {
  const body = { url: originalUrl };
  if (ttlDays) body.ttlDays = ttlDays;

  const res = await fetch(`${API_BASE}/api/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Server error ${res.status}`);
  }

  return res.json();
}
