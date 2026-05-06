export const COMPANY_EMAIL = "info@genesysgt.com";
// TODO: customer to provide. Use international format e.g. 96812345678 (no + or spaces)
export const COMPANY_WHATSAPP = "96800000000";
export const COMPANY_PHONE = "+968 0000 0000";

export function whatsappLink(message: string) {
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
