export const COMPANY_EMAIL = "Sales@genesysgt.com";
// International format, no + or spaces
export const COMPANY_WHATSAPP = "+968 97140846";
export const COMPANY_PHONE = "+968 97140846";
export const COMPANY_LOCATION_URL = "https://maps.app.goo.gl/5WghirKBuCj5xyJKA";

export function whatsappLink(message?: string) {
  const base = "https://api.whatsapp.com/send?phone=96897140846";
  if (!message) return base;
  return `${base}&text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}