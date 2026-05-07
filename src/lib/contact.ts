export const COMPANY_EMAIL = "info@genesysgt.com";
// International format, no + or spaces
export const COMPANY_WHATSAPP = "96879868055";
export const COMPANY_PHONE = "+968 7986 8055";
export const COMPANY_LOCATION_URL = "https://maps.app.goo.gl/5WghirKBuCj5xyJKA";

export function whatsappLink(message: string) {
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
