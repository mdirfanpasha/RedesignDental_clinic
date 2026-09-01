/**
 * lib/security/sanitize.js
 * Input Sanitization, XSS Protection & PII Masking Utilities
 * 
 * Features:
 * - HTML Entity Escaping (prevents Stored & Reflected XSS)
 * - Email Header Injection Stripping (prevents CRLF injection)
 * - PII Masking for Privacy-Safe Logging (HIPAA/NABH-aligned)
 */

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string} Sanitized string
 */
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Strip non-printable control characters
}

/**
 * Sanitizes plain text input by stripping control chars and trimming whitespace.
 * @param {string} str 
 * @param {number} [maxLength=1000]
 * @returns {string} Clean plain text
 */
export function sanitizeText(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Strips CRLF characters to prevent Email Header Injection.
 * @param {string} str 
 * @returns {string} Header-safe string
 */
export function sanitizeHeaderValue(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t]/g, ' ').trim();
}

/**
 * Masks a phone number for safe diagnostic logging.
 * Example: "917780245307" -> "+91 7780***307"
 * @param {string} phone 
 * @returns {string} Masked phone number
 */
export function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '***';
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.length <= 4) return '****';
  const start = clean.slice(0, clean.startsWith('+') ? 6 : 4);
  const end = clean.slice(-3);
  return `${start}***${end}`;
}

/**
 * Masks a patient's full name for safe diagnostic logging.
 * Example: "Mohammed Irfan Pasha" -> "M******* I**** P****"
 * @param {string} name 
 * @returns {string} Masked name
 */
export function maskName(name) {
  if (!name || typeof name !== 'string') return '***';
  return name.trim().split(/\s+/).map(part => {
    if (part.length <= 1) return part;
    return part[0] + '*'.repeat(Math.min(part.length - 1, 6));
  }).join(' ');
}

/**
 * Masks an email address for safe logging.
 * Example: "patient@example.com" -> "p***t@example.com"
 * @param {string} email 
 * @returns {string} Masked email
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const user = parts[0];
  const domain = parts[1];
  if (user.length <= 2) return `*@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}
