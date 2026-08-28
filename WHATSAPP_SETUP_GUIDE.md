# Meta WhatsApp Business Cloud API — Setup & Deployment Guide
**Redesign Dental Clinics — Automated Appointment & Callback Notifications**

---

## 1. Overview
When a patient submits an **Appointment Request** or **Callback Request** on the Redesign Dental Clinics website, the backend automatically:
1. Verifies Google reCAPTCHA v3 independently on the server.
2. Validates all inputs and checks for duplicate double-submissions (60s anti-spam window).
3. Persists the booking record with a unique Reference ID (`RDC-APPT-YYYYMMDD-XXXX` or `RDC-CALL-YYYYMMDD-XXXX`).
4. Automatically dispatches an official Meta WhatsApp Business Cloud API notification directly to the clinic / doctor's WhatsApp number (`+91 77802 45307`).
5. Returns a confirmed success response to the patient — **without requiring the patient to open WhatsApp or manually send any messages**.

---

## 2. Meta WhatsApp Business Cloud API Configuration

### Step 1: Create / Access Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Create or select a **Business** App (App Type: Business).
3. Add the **WhatsApp** product to your application.

### Step 2: Configure WhatsApp Business Account (WABA)
1. Navigate to **WhatsApp > API Setup** in your Meta App Dashboard.
2. Copy your:
   - **Phone number ID** -> `WHATSAPP_PHONE_NUMBER_ID`
   - **WhatsApp Business Account ID** -> `WHATSAPP_BUSINESS_ACCOUNT_ID`
3. Add and verify your official business phone number (or use the test number for development).

### Step 3: Generate Permanent System User Access Token
1. Go to [Meta Business Manager Settings](https://business.facebook.com/settings).
2. Under **Users > System Users**, click **Add** (Admin system user).
3. Click **Generate New Token**, select your App, and grant the following permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Set token expiration to **Never** (Permanent Token).
5. Copy this token -> `WHATSAPP_ACCESS_TOKEN`.

---

## 3. Server Environment Variables (Vercel & Local)

Add these variables to **Vercel Project Settings > Environment Variables** (for `Production`, `Preview`, and `Development`):

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `WHATSAPP_ENABLED` | Toggle live messaging (`true` in production, `false` for local mock) | `true` |
| `WHATSAPP_ACCESS_TOKEN` | Meta System User Permanent Token | `EAA...` (Secret) |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business Phone Number ID from Meta | `102938475610293` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WABA ID from Meta Business Manager | `987654321098765` |
| `WHATSAPP_NOTIFY_NUMBER` | Doctor / Reception WhatsApp number (with country code) | `917780245307` |
| `WHATSAPP_NOTIFY_NUMBERS` | *(Optional)* Multiple recipient numbers (comma-separated) | `917780245307,919876543210` |
| `WHATSAPP_API_VERSION` | Meta Graph API Version | `v20.0` |
| `WHATSAPP_APPOINTMENT_TEMPLATE` | *(Optional)* Approved Meta Template Name | `new_appointment_request` |
| `WHATSAPP_CALLBACK_TEMPLATE` | *(Optional)* Approved Meta Template Name | `new_callback_request` |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 Server Secret Key | `6LdkaZQtAAAA...` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 Public Site Key | `6LdkaZQtAAAA...` |

> [!NOTE]
> All sensitive tokens (`WHATSAPP_ACCESS_TOKEN`, `RECAPTCHA_SECRET_KEY`) are **server-side only** and are never exposed to the frontend or browser.

---

## 4. Message Formats

### A. Appointment Notification
```text
🦷 NEW APPOINTMENT REQUEST

Reference: RDC-APPT-20260828-A4F9
Patient: Rahul Kumar
Phone: +91 98765 43210
Email: rahul@example.com
Reason: Dental Implants
Date: 2026-08-30
Time: 05:30 PM IST

Please review and contact the patient to confirm availability.

Redesign Dental Clinics — Banjara Hills, Hyderabad
```

### B. Callback Notification
```text
📞 NEW CALLBACK REQUEST

Reference: RDC-CALL-20260828-B8D2
Patient: Priya Sharma
Phone: +91 98765 12345
Email: priya@example.com
Reason: General Dental Enquiry
Preferred Callback: Afternoon

Please contact the patient as soon as possible.

Redesign Dental Clinics — Banjara Hills, Hyderabad
```

---

## 5. Local Testing & Mock Mode

When developing locally:
1. If `WHATSAPP_ACCESS_TOKEN` is not set or `WHATSAPP_ENABLED=false`, the server automatically operates in **Mock Mode**.
2. Form submissions will succeed, reCAPTCHA will verify, booking records will save to `data/bookings.json`, and the notification payload will be safely logged to the server console.
3. Once valid Meta credentials are added to `.env.local` or Vercel, the integration automatically switches to live Meta Cloud API delivery.
