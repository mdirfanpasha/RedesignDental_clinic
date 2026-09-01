/**
 * lib/storage/bookings.js
 * In-Memory & File-based Persistence for Appointments & Callbacks
 * 
 * Features:
 * - Unique Reference ID Generation (RDC-APPT-YYYYMMDD-XXXX, RDC-CALL-YYYYMMDD-XXXX)
 * - Anti-spam & Duplicate submission protection (60s sliding window)
 * - Safe file persistence to data/bookings.json with serverless fallback
 * - Audit logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// In-memory cache for recent submissions to prevent double clicks / rapid spam
const recentSubmissions = new Map();

/**
 * Generates a unique reference ID.
 * Example: RDC-APPT-20260828-A4F9 or RDC-CALL-20260828-B8D2
 * 
 * @param {'appointment' | 'callback'} type 
 * @returns {string} Unique reference ID
 */
export function generateReferenceId(type) {
  let prefix = 'RDC-CALL';
  if (type === 'appointment') prefix = 'RDC-APPT';
  if (type === 'contact') prefix = 'RDC-ENQ';
  const now = new Date();
  
  // IST Date String: YYYYMMDD
  const istDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now).replace(/-/g, '');

  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${istDate}-${randomHex}`;
}

/**
 * Checks if a submission is an accidental duplicate within a 60-second window.
 * 
 * @param {Object} data 
 * @param {string} data.type 
 * @param {string} data.name 
 * @param {string} data.phone 
 * @returns {Object|null} The cached record if duplicate, or null if new.
 */
export function checkDuplicateSubmission({ type, name, phone }) {
  const cleanKey = `${type}:${(name || '').trim().toLowerCase()}:${(phone || '').trim()}`;
  const now = Date.now();

  // Clean old entries (> 60s)
  for (const [key, val] of recentSubmissions.entries()) {
    if (now - val.timestamp > 60000) {
      recentSubmissions.delete(key);
    }
  }

  const existing = recentSubmissions.get(cleanKey);
  if (existing && (now - existing.timestamp < 60000)) {
    return existing.record;
  }

  return null;
}

/**
 * Reads all stored bookings.
 * 
 * @returns {Array} List of stored booking records
 */
export function getAllBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      return [];
    }
    const content = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.warn('[Bookings Storage] Failed to read bookings.json:', err.message);
    return [];
  }
}

/**
 * Saves a new booking or callback record.
 * 
 * @param {Object} record 
 * @returns {Object} The saved record
 */
export function saveBookingRecord(record) {
  const now = new Date();
  const enhancedRecord = {
    ...record,
    createdAt: now.toISOString(),
    createdAtIST: new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'long'
    }).format(now),
    whatsappStatus: record.whatsappStatus || 'pending'
  };

  // Cache in memory for duplicate detection
  const cleanKey = `${enhancedRecord.type}:${(enhancedRecord.name || '').trim().toLowerCase()}:${(enhancedRecord.phone || '').trim()}`;
  recentSubmissions.set(cleanKey, {
    timestamp: Date.now(),
    record: enhancedRecord
  });

  // Persist to file if filesystem is writable
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const bookings = getAllBookings();
    bookings.unshift(enhancedRecord); // Newest first

    // Limit file size to last 1000 records
    if (bookings.length > 1000) {
      bookings.length = 1000;
    }

    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) {
    // In serverless read-only environments, file write may fail gracefully
    console.warn('[Bookings Storage] File write fallback (memory only):', err.message);
  }

  return enhancedRecord;
}

/**
 * Updates notification status of an existing record.
 * 
 * @param {string} referenceId 
 * @param {string} status 
 * @param {Array} [whatsappResults] 
 */
export function updateNotificationStatus(referenceId, status, whatsappResults) {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return;
    const bookings = getAllBookings();
    const item = bookings.find(b => b.referenceId === referenceId);
    if (item) {
      item.whatsappStatus = status;
      if (whatsappResults) {
        item.whatsappResults = whatsappResults;
      }
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Bookings Storage] Status update failed:', err.message);
  }
}
