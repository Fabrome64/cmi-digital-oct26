import fs from 'fs';
import path from 'path';

// In-memory & file-based fallback store for settings if Prisma DB connection is unavailable
const defaultSettings: Record<string, string> = {
  company_name: 'CMI DIGITAL',
  hero_title: 'CMI DIGITAL',
  hero_subtitle: 'Soluciones que hacen visible tu negocio.',
  hero_text: 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.',
  address: 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina',
  phone: '03458-659792',
  whatsapp: '5493458659792',
  email: 'fabrome64@gmail.com',
  facebook_url: 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#',
  instagram_url: 'https://www.instagram.com/cmidigital/',
  google_maps_iframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.739775432904!2d-58.7554901!3d-30.3846301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b28b7e28cf69a1%3A0xb36b539c96129fa!2sParan%C3%A1%2019%2C%20San%20Jos%C3%A9%20de%20Feliciano%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar',
  meta_title: 'CMI DIGITAL | Impresiones Gran Formato, Marketing & Desarrollo Web en Feliciano',
  meta_description: 'Empresa líder en San José de Feliciano en Impresiones de Gran Formato, Marketing Digital, Administración de Redes Sociales y Desarrollo de Sitios Web Profesionales.',
};

function getCacheFilePath(): string {
  try {
    const tmpDir = process.env.TMPDIR || process.env.TMP || '/tmp';
    if (fs.existsSync(tmpDir)) {
      return path.join(tmpDir, 'cmi_settings_v1.json');
    }
  } catch (e) {
    // fallback
  }
  return path.join(process.cwd(), '.settings_cache.json');
}

let memorySettings: Record<string, string> = { ...defaultSettings };

// Try loading persisted file on module init
try {
  const filePath = getCacheFilePath();
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      memorySettings = { ...defaultSettings, ...parsed };
    }
  }
} catch (e) {
  console.warn('Could not read settings cache file:', e);
}

export function getMemorySettings(): Record<string, string> {
  try {
    const filePath = getCacheFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        memorySettings = { ...defaultSettings, ...parsed };
      }
    }
  } catch (e) {
    // ignore
  }
  return { ...memorySettings };
}

export function updateMemorySettings(updates: Record<string, string>): Record<string, string> {
  Object.entries(updates).forEach(([key, val]) => {
    memorySettings[key] = String(val ?? '');
  });
  try {
    const filePath = getCacheFilePath();
    fs.writeFileSync(filePath, JSON.stringify(memorySettings, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not persist settings cache file:', e);
  }
  return { ...memorySettings };
}
