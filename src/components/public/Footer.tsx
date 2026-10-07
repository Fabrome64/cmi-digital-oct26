import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface FooterProps {
  companyName?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Footer({
  companyName = 'CMI DIGITAL',
  address = 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina',
  phone = '03458-659792',
  whatsapp = '5493458659792',
  email = 'fabrome64@gmail.com',
  facebookUrl = 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#',
  instagramUrl = 'https://www.instagram.com/cmidigital/',
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');

  return (
    <footer className="bg-[#FFD400] text-gray-900 border-t-4 border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-900/20">
          
          {/* Col 1: Branding & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="CMI DIGITAL Logo"
                className="h-14 w-auto object-contain"
              />
              <span className="font-extrabold text-2xl text-gray-900">{companyName}</span>
            </div>
            <p className="font-bold text-gray-800 text-sm leading-relaxed">
              Impresiones · Marketing Digital · Diseño Web
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              Transformamos la presencia de tu marca con impresiones de gran impacto visual y soluciones digitales de alto rendimiento.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-900 hover:bg-black text-[#FFD400] rounded-lg flex items-center justify-center transition-transform transform hover:scale-110"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-900 hover:bg-black text-[#FFD400] rounded-lg flex items-center justify-center transition-transform transform hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-900 hover:bg-black text-[#FFD400] rounded-lg flex items-center justify-center transition-transform transform hover:scale-110"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 uppercase tracking-wider mb-4 border-b-2 border-gray-900 pb-2 inline-block">
              Navegación
            </h3>
            <ul className="space-y-2.5 font-semibold text-sm">
              <li>
                <a href="#inicio" className="hover:underline hover:text-black">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#diseno-web" className="hover:underline hover:text-black">
                  Diseño Web
                </a>
              </li>
              <li>
                <a href="#marketing-redes" className="hover:underline hover:text-black">
                  Marketing en Redes
                </a>
              </li>
              <li>
                <a href="#impresiones" className="hover:underline hover:text-black">
                  Impresiones Gran Formato
                </a>
              </li>
              <li>
                <a href="#presupuesto" className="hover:underline hover:text-black">
                  Solicitar Presupuesto
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:underline hover:text-black">
                  Contacto & Ubicación
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Servicios Principales */}
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 uppercase tracking-wider mb-4 border-b-2 border-gray-900 pb-2 inline-block">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>• Páginas Web Corporativas</li>
              <li>• E-commerce & Tiendas Online</li>
              <li>• PWA Aplicaciones Instalables</li>
              <li>• Administración de Instagram & FB</li>
              <li>• Cartelería & Lonas Gran Formato</li>
              <li>• Microperforados & Vidrieras</li>
              <li>• Ploteo Vehicular & Señalética</li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 uppercase tracking-wider mb-4 border-b-2 border-gray-900 pb-2 inline-block">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-900">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-900" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-gray-900" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 flex-shrink-0 text-gray-900" />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  +{whatsapp}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-gray-900" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-sm font-semibold text-gray-900">
          <p>© {currentYear} {companyName}. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 text-xs">
            Desarrollado con arquitectura profesional Next.js + PWA
          </p>
        </div>
      </div>
    </footer>
  );
}
