export type ServiceType = 'WEB' | 'MARKETING' | 'PRINT' | 'GENERAL';

export function getWhatsAppUrl(
  phoneNumber: string = '5493437421589',
  serviceType: ServiceType = 'GENERAL',
  customMessage?: string
): string {
  // Clean phone number (remove +, spaces, hyphens)
  const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');

  let defaultText = 'Hola CMI Digital, quisiera más información sobre sus servicios.';

  if (serviceType === 'WEB') {
    defaultText = 'Hola CMI Digital, quiero consultar por el desarrollo de un sitio web.';
  } else if (serviceType === 'MARKETING') {
    defaultText = 'Hola CMI Digital, quiero consultar por el servicio de administración de redes sociales.';
  } else if (serviceType === 'PRINT') {
    defaultText = 'Hola CMI Digital, quiero solicitar un presupuesto de impresiones.';
  }

  const messageText = customMessage || defaultText;
  const encodedText = encodeURIComponent(messageText);

  return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
}
