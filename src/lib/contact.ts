// ──────────────────────────────────────────────
// Contact Configuration
// ──────────────────────────────────────────────
// Replace these placeholder values with your own
// before publishing the site.
// ──────────────────────────────────────────────

/** Your WhatsApp number (with country code, no + or 00 prefix) */
export const WHATSAPP_NUMBER = '905527522628'

/** Your email address */
export const EMAIL = 'ahmetyousf.2000.1@gmail.com'

/** Your GitHub profile URL */
export const GITHUB_URL = 'https://github.com/ahmed-yousef99'

/** Your LinkedIn profile URL */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/ahmed-youssef-b53a77365/'

/**
 * Creates a WhatsApp deep-link URL with a pre-filled message.
 * Used across the app for all WhatsApp CTAs.
 */
export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
