import axios from 'axios';
import env from '../config/env.js';
import redis from '../config/redis.js';

// Layer 1: High-abuse TLDs (Source: Interisle / Spamhaus 2024-2025 reports)
const MALICIOUS_TLDS = new Set([
  'top', 'xin', 'bond', 'help', 'win', 'cfd',
  'motorcycles', 'surf', 'buzz', 'gq', 'tk', 'ml', 'ga', 'cf'
]);

// Layer 1.5: Whitelisted domains to save API quota
const WHITELISTED_DOMAINS = new Set([
  'google.com', 'github.com', 'microsoft.com', 'apple.com', 'amazon.com',
  'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com'
]);

/**
 * Checks if a URL is safe to shorten.
 * @param {string} urlString 
 * @returns {Promise<{ safe: boolean, reason: string | null }>}
 */
export const checkUrlSafety = async (urlString) => {
  try {
    const url = new URL(urlString);
    const domain = url.hostname.toLowerCase();
    const tld = domain.split('.').pop();

    // 1. Whitelist Check (Fastest)
    if (WHITELISTED_DOMAINS.has(domain) || WHITELISTED_DOMAINS.has(domain.replace(/^www\./, ''))) {
      console.log(`[Security] Whitelist hit for: ${domain}`);
      return { safe: true, reason: null };
    }

    // 2. High-Abuse TLD Check (Local)
    if (MALICIOUS_TLDS.has(tld)) {
      console.log(`[Security] TLD Blacklist hit for: .${tld}`);
      return { safe: false, reason: `Policy: High-risk domain extension (.${tld})` };
    }

    // 3. Cache Check (Fast)
    const cachedResult = await redis.get(`safety_check:${domain}`);
    if (cachedResult) {
      console.log(`[Security] Cache hit for: ${domain} Result: ${cachedResult}`);
      if (cachedResult === 'safe') return { safe: true, reason: null };
      if (cachedResult === 'malicious') return { safe: false, reason: 'Previously flagged as unsafe' };
    }

    // 4. Google Safe Browsing Check (Deep Scan)
    if (env.GOOGLE_SAFE_BROWSING_KEY) {
      console.log(`[Security] Calling Google Safe Browsing for: ${domain}`);
      const isMalicious = await checkGoogleSafeBrowsing(urlString);
      if (isMalicious) {
        console.log(`[Security] Google flagged: ${domain} as MALICIOUS`);
        await redis.setex(`safety_check:${domain}`, 86400, 'malicious');
        return { safe: false, reason: 'Flagged by Google Safe Browsing as dangerous' };
      }
    } else {
      console.warn('[Security] Google API Key is missing. Skipping deep scan.');
    }

    // Default to safe if no negative signals found
    console.log(`[Security] URL is safe: ${domain}`);
    await redis.setex(`safety_check:${domain}`, 3600, 'safe'); // Cache clean results for 1 hr
    return { safe: true, reason: null };
  } catch (error) {
    console.error('Security check error:', error);
    // Be permissive if security check itself fails? Or restrictive?
    // For now, permissive but log it.
    return { safe: true, reason: null };
  }
};

/**
 * Calls Google Safe Browsing Lookup API (v4)
 * @param {string} targetUrl 
 * @returns {Promise<boolean>} - true if malicious
 */
async function checkGoogleSafeBrowsing(targetUrl) {
  const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${env.GOOGLE_SAFE_BROWSING_KEY}`;
  
  const payload = {
    client: { clientId: 'url-shortener-node', clientVersion: '1.0.0' },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HAZARDOUS_APPLICATION'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url: targetUrl }]
    }
  };

  try {
    const res = await axios.post(API_URL, payload);
    // If res.data has 'matches', it is malicious
    return !!(res.data && res.data.matches && res.data.matches.length > 0);
  } catch (err) {
    console.error('Google Safe Browsing API failed:', err.response?.data || err.message);
    return false;
  }
}
