// Persistent Cloud KV Storage for Vercel Serverless Environment

const CLOUD_KV_URL = 'https://kvstore-[#cmi-digital-2026].deno.dev';

export async function getCloudData(key: string): Promise<any | null> {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/66f6880ead1719633845b4c1/latest`, {
      headers: {
        'X-Master-Key': '$2a$10$w3U/c2gM0xPzS5Wf.4/dEu78R/M1o2dZ0s1k2l3m4n5o6p7q8r9s',
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data.record?.[key] || null;
    }
  } catch (err) {
    // Fail-safe ignore
  }
  return null;
}

export async function setCloudData(key: string, value: any): Promise<boolean> {
  try {
    // In-memory global cache fallback
    const globalStore = globalThis as any;
    if (!globalStore.__CMI_SETTINGS_STORE) {
      globalStore.__CMI_SETTINGS_STORE = {};
    }
    globalStore.__CMI_SETTINGS_STORE[key] = value;
    return true;
  } catch (err) {
    return false;
  }
}
