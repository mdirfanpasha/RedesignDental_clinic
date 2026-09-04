/**
 * lib/security/schemas.js
 * Zod Validation Schemas for Production API Endpoints
 * 
 * Enforces strict type, length, format, and whitelist constraints on all incoming requests.
 */

import { z } from 'zod';

// Reusable Field Validators
const patientNameSchema = z.string({
  required_error: 'Full name is required',
  invalid_type_error: 'Full name must be a string'
})
  .trim()
  .min(2, 'Full name must be at least 2 characters long')
  .max(100, 'Full name must not exceed 100 characters')
  .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'Full name contains invalid characters');

const phoneNumberSchema = z.string({
  required_error: 'Contact phone number is required',
  invalid_type_error: 'Contact phone number must be a string'
})
  .trim()
  .min(7, 'Phone number must have at least 7 digits')
  .max(20, 'Phone number must not exceed 20 characters')
  .refine(val => val.replace(/\D/g, '').length >= 7, {
    message: 'Phone number must contain at least 7 numerical digits'
  });

const emailSchema = z.string()
  .trim()
  .email('Please enter a valid email address')
  .max(150, 'Email address must not exceed 150 characters')
  .optional()
  .or(z.literal(''));

const tokenSchema = z.string({
  required_error: 'Security verification token is required'
})
  .trim()
  .min(1, 'Security verification token cannot be empty')
  .max(4096, 'Security token is abnormally large');

const honeypotSchema = z.string().max(0, 'Spam detected').optional().or(z.literal(''));

// Appointment Reason Whitelist
const allowedAppointmentReasons = [
  'General Consultation',
  'Dental Implants',
  'Full Mouth Rehabilitation',
  'Root Canal Treatment',
  'Cosmetic Dentistry',
  'Gum Disease Treatment',
  'Teeth Whitening',
  'Emergency Care',
  'Pediatric Dentistry',
  'Orthodontics / Aligners',
  'Toothache Relief',
  'Custom Message',
  'General',
  'Other'
];

/**
 * Schema for POST /api/appointments
 */
export const appointmentPayloadSchema = z.object({
  name: patientNameSchema,
  phone: phoneNumberSchema,
  email: emailSchema,
  doctor: z.string().trim().max(120).optional().default(''),
  reason: z.string().trim().max(120).optional().default('General Consultation'),
  customMsg: z.string().trim().max(1000, 'Custom message must not exceed 1000 characters').optional().default(''),
  date: z.string({
    required_error: 'Preferred appointment date is required'
  }).trim().min(4, 'Please provide a valid date').max(30),
  time: z.string({
    required_error: 'Preferred appointment time is required'
  }).trim().min(2, 'Please provide a valid time').max(30),
  token: tokenSchema,
  // Honeypot fields (must be empty)
  clinic_hp: honeypotSchema,
  website_hp: honeypotSchema,
  _timer: z.number().optional()
}).strict(); // Disallow unapproved extra fields

/**
 * Schema for POST /api/callback
 */
export const callbackPayloadSchema = z.object({
  name: patientNameSchema,
  phone: phoneNumberSchema,
  email: emailSchema,
  reason: z.string().trim().max(120).optional().default('General Dental Enquiry'),
  subject: z.string().trim().max(120).optional().default('General Dental Enquiry'),
  preferredTime: z.string().trim().max(60).optional().default('Anytime / ASAP'),
  message: z.string().trim().max(1000, 'Message must not exceed 1000 characters').optional().default(''),
  token: tokenSchema,
  // Honeypot fields
  clinic_hp: honeypotSchema,
  website_hp: honeypotSchema,
  _timer: z.number().optional()
}).strict();

/**
 * Schema for POST /api/contact
 */
export const contactPayloadSchema = z.object({
  name: patientNameSchema,
  phone: phoneNumberSchema,
  email: emailSchema,
  subject: z.string().trim().max(150).optional().default('General Enquiry'),
  message: z.string().trim().max(2000, 'Message must not exceed 2000 characters').optional().default(''),
  token: tokenSchema,
  clinic_hp: honeypotSchema,
  website_hp: honeypotSchema,
  _timer: z.number().optional()
}).strict();
