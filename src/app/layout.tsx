import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CMI DIGITAL | Impresiones Gran Formato, Marketing Digital & Desarrollo Web',
  description: 'Empresa líder en San José de Feliciano (Entre Ríos) en Impresiones de Gran Formato, Marketing Digital, Redes Sociales y Desarrollo Web Profesional PWA.',
  keywords: ['CMI DIGITAL', 'Impresiones Feliciano', 'Marketing Digital Entre Ríos', 'Diseño Web Feliciano', 'Lonas Gran Formato', 'Cartelería'],
  authors: [{ name: 'CMI DIGITAL' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'CMI DIGITAL | Soluciones que hacen visible tu negocio',
    description: 'Impresiones Gran Formato, Marketing Digital y Desarrollo Web Profesional.',
    url: 'https://cmidigital.com.ar',
    siteName: 'CMI DIGITAL',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMI DIGITAL',
    description: 'Soluciones visuales y digitales para llevar tu negocio al próximo nivel.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FFD400" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'CMI DIGITAL',
              image: 'https://cmidigital.com.ar/logo.png',
              telePhone: '03437-421589',
              email: 'contacto@cmidigital.com.ar',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Paraná 19',
                addressLocality: 'San José de Feliciano',
                addressRegion: 'Entre Ríos',
                postalCode: 'E3180',
                addressCountry: 'AR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -30.3846301,
                longitude: -58.7554901,
              },
              url: 'https://cmidigital.com.ar',
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className="font-poppins bg-white text-gray-900 antialiased selection:bg-[#FFD400] selection:text-gray-900">
        {children}
      </body>
    </html>
  );
}
