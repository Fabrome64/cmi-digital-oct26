'use client';

import { MapPin, Phone, Mail, MessageCircle, Clock, Navigation, Facebook, Instagram } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ContactSectionProps {
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleMapsIframe?: string;
}

export default function ContactSection({
  address = 'Paraná 19, San José de Feliciano, Entre Ríos, Argentina',
  phone = '03437-421589',
  whatsapp = '5493437421589',
  email = 'contacto@cmidigital.com.ar',
  facebookUrl = 'https://facebook.com',
  instagramUrl = 'https://instagram.com',
  googleMapsIframe = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.739775432904!2d-58.7554901!3d-30.3846301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b28b7e28cf69a1%3A0xb36b539c96129fa!2sParan%C3%A1%2019%2C%20San%20Jos%C3%A9%20de%20Feliciano%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar',
}: ContactSectionProps) {
  const waUrl = getWhatsAppUrl(whatsapp, 'GENERAL');
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section id="contacto" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-3">
            <MapPin className="w-4 h-4 text-yellow-700" />
            <span>Atención Personalizada</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            ¿DÓNDE ESTAMOS?
          </h2>
          <p className="text-lg text-gray-600 mt-2 font-medium">
            Visitanos en nuestro taller comercial o comunicate directamente con nuestro equipo.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 bg-gray-50 p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-gray-900 border-b pb-3">
                Información de Contacto
              </h3>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#FFD400] text-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm uppercase">Dirección Física</h4>
                  <p className="text-base text-gray-700 font-medium leading-snug">{address}</p>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm uppercase">Teléfono & WhatsApp</h4>
                  <p className="text-base text-gray-700 font-medium">Fijo: {phone}</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold hover:underline">
                    WhatsApp: +{whatsapp}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm uppercase">Correo Electrónico</h4>
                  <p className="text-base text-gray-700 font-medium">{email}</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-900 text-[#FFD400] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm uppercase">Horarios de Atención</h4>
                  <p className="text-sm text-gray-700 font-medium">Lunes a Viernes: 08:00 a 12:30 hs y 16:00 a 20:00 hs</p>
                  <p className="text-sm text-gray-700 font-medium">Sábados: 08:30 a 12:30 hs</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 flex items-center space-x-4">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-[#FFD400] font-extrabold py-3.5 rounded-xl shadow text-sm transition-transform transform hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-yellow-400" />
                <span>CÓMO LLEGAR</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow text-sm transition-transform transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WHATSAPP</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Iframe */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border-4 border-gray-900 min-h-[400px]">
            <iframe
              src={googleMapsIframe}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación CMI Digital en San José de Feliciano"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
