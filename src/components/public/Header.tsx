'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Facebook, Instagram, LogIn, Monitor } from 'lucide-react';

interface HeaderProps {
  companyName?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Header({
  companyName = 'CMI DIGITAL',
  facebookUrl = 'https://web.facebook.com/profile.php?id=100091974249919&_rdc=2&_rdr#',
  instagramUrl = 'https://www.instagram.com/cmidigital/',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'INICIO', href: '#inicio' },
    { name: 'DISEÑO WEB', href: '#diseno-web' },
    { name: 'MARKETING REDES', href: '#marketing-redes' },
    { name: 'IMPRESIONES', href: '#impresiones' },
    { name: 'CONTACTO', href: '#contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFD400] text-gray-900 shadow-md border-b border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Logo CMI DIGITAL */}
          <div className="flex items-center space-x-3">
            <Link href="#inicio" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="CMI DIGITAL Logo"
                className="h-12 w-auto object-contain transform group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-gray-900 group-hover:text-black">
                  {companyName}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-gray-800 uppercase">
                  Impresiones · Marketing · Web
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER / RIGHT: Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-bold text-sm tracking-wide text-gray-900 hover:text-black hover:bg-yellow-400 px-3 py-2 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* RIGHT: Social Icons & Register/Login CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-900 hover:text-black hover:bg-yellow-400 rounded-full transition-colors"
              title="Facebook CMI Digital"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-900 hover:text-black hover:bg-yellow-400 rounded-full transition-colors"
              title="Instagram CMI Digital"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-black text-[#FFD400] font-bold px-4 py-2 rounded-lg shadow transition-transform transform hover:-translate-y-0.5 text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>REGISTRO / ACCESO</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/admin/login"
              className="p-2 text-gray-900 bg-yellow-400 rounded-lg"
              title="Acceso Admin"
            >
              <LogIn className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-900 hover:bg-yellow-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFD400] border-t border-yellow-400 px-4 pt-4 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-extrabold text-base text-gray-900 hover:bg-yellow-400 px-4 py-3 rounded-lg transition-colors"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-4 border-t border-yellow-500/40 flex items-center justify-between px-2">
            <div className="flex items-center space-x-4">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-900 bg-yellow-400 rounded-full"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-900 bg-yellow-400 rounded-full"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-gray-900 text-[#FFD400] font-bold px-4 py-2.5 rounded-lg text-sm flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Acceso Panel</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
