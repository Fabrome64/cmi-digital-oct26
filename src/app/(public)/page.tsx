import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import WebDesignSection from '@/components/public/WebDesignSection';
import MarketingSection from '@/components/public/MarketingSection';
import PrintSection from '@/components/public/PrintSection';
import BudgetForm from '@/components/public/BudgetForm';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import PWAPrompt from '@/components/public/PWAPrompt';
import { prisma } from '@/lib/prisma';
import { getMemorySettings } from '@/lib/settingsStore';

export const revalidate = 0; // Dynamic SSR to ensure Instant DB Sync (Requisito 31)

export default async function HomePage() {
  // Fetch global settings dynamically from database with memory store fallback
  const settings: Record<string, string> = { ...getMemorySettings() };
  try {
    const settingsList = await prisma.setting.findMany();
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });
  } catch (err) {
    console.error('Error fetching settings from Prisma:', err);
  }

  const companyName = settings.company_name || 'CMI DIGITAL';
  const heroTitle = settings.hero_title || 'CMI DIGITAL';
  const heroSubtitle = settings.hero_subtitle || 'Soluciones que hacen visible tu negocio.';
  const heroText = settings.hero_text || 'Impresiones, marketing digital y desarrollo web para llevar tu empresa al próximo nivel.';
  const whatsapp = settings.whatsapp || '5493458659792';
  const address = settings.address || 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina';
  const phone = settings.phone || '03458-659792';
  const email = settings.email || 'fabrome64@gmail.com';
  const facebookUrl = settings.facebook_url || 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#';
  const instagramUrl = settings.instagram_url || 'https://www.instagram.com/cmidigital/';
  const googleMapsIframe = settings.google_maps_iframe;

  return (
    <div className="min-h-screen flex flex-col justify-between font-poppins">
      
      {/* 1. STICKY HEADER */}
      <Header
        companyName={companyName}
        facebookUrl={facebookUrl}
        instagramUrl={instagramUrl}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 2. HERO PRESENTATION */}
        <Hero
          title={heroTitle}
          subtitle={heroSubtitle}
          text={heroText}
          whatsapp={whatsapp}
        />

        {/* 3. SECCIÓN DISEÑO WEB & PORTFOLIO DINÁMICO */}
        <WebDesignSection whatsapp={whatsapp} />

        {/* 4. SECCIÓN MARKETING EN REDES & SERVICIOS DINÁMICOS */}
        <MarketingSection whatsapp={whatsapp} />

        {/* 5. SECCIÓN IMPRESIONES GRAN FORMATO & CATÁLOGO DINÁMICO */}
        <PrintSection whatsapp={whatsapp} />

        {/* 6. SOLICITÁ TU PRESUPUESTO FORMULARIO */}
        <BudgetForm />

        {/* 7. SECCIÓN CONTACTO & ¿DÓNDE ESTAMOS? */}
        <ContactSection
          address={address}
          phone={phone}
          whatsapp={whatsapp}
          email={email}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          googleMapsIframe={googleMapsIframe}
        />
      </main>

      {/* 8. FOOTER */}
      <Footer
        companyName={companyName}
        address={address}
        phone={phone}
        whatsapp={whatsapp}
        email={email}
        facebookUrl={facebookUrl}
        instagramUrl={instagramUrl}
      />

      {/* 9. PWA INSTALL PROMPT BANNER */}
      <PWAPrompt />

    </div>
  );
}
