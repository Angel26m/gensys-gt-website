export const COMPANY_EMAIL = "Sales@genesysgt.com";
// International format, no + or spaces
export const COMPANY_WHATSAPP = "+968 97140846";
export const COMPANY_PHONE = "+968 97140846";
export const COMPANY_LOCATION_URL = "https://maps.app.goo.gl/5WghirKBuCj5xyJKA";

export function whatsappLink(_message?: string) {
  return "https://wa.me/96897140846";
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}