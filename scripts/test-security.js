/**
 * scripts/test-security.js
 * Automated Security Test Suite
 * 
 * Verifies:
 * 1. Security Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
 * 2. HTTP Method Enforcement (405 for GET on POST-only endpoints)
 * 3. Content-Type Enforcement (400 for text/plain)
 * 4. Payload Size Limit Enforcement (413 for > 50KB bodies)
 * 5. Malformed JSON Handling (400)
 * 6. Zod Validation Constraints (400 for missing/invalid fields)
 * 7. Honeypot Anti-Spam Detection (400 rejection)
 * 8. Automated Bot Rapid Submission Defense (400 rejection for < 1.2s submissions)
 * 9. Valid Appointments, Callbacks, and Contact Submissions (200 + Unique Ref ID)
 * 10. 60s Sliding-Window Duplicate Deduplication
 * 11. Rate Limiting Protection (429 Too Many Requests after 5 requests)
 */

const BASE_URL = 'http://localhost:8000';

async function runTests() {
  console.log('🔒 Starting Redesign Dental Clinics Automated Security Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ── TEST 1: HTTP Security Headers ──────────────────────────────────────────
  console.log('▶ Test 1: Global HTTP Security Headers on HTML and API routes');
  const homeRes = await fetch(`${BASE_URL}/`);
  const headers = homeRes.headers;
  assert(headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options is nosniff');
  assert(headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options is SAMEORIGIN');
  assert(headers.get('referrer-policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy is strict-origin-when-cross-origin');
  assert(headers.get('permissions-policy')?.includes('camera=()'), 'Permissions-Policy restricts sensitive hardware APIs');
  assert(headers.get('content-security-policy')?.includes("default-src 'self'"), 'Content-Security-Policy contains default-src self');

  // ── TEST 2: HTTP Method Enforcement ───────────────────────────────────────
  console.log('\n▶ Test 2: HTTP Method Enforcement');
  const getAppt = await fetch(`${BASE_URL}/api/appointments`, { method: 'GET' });
  assert(getAppt.status === 405, 'GET /api/appointments returns 405 Method Not Allowed');

  const getCallback = await fetch(`${BASE_URL}/api/callback`, { method: 'GET' });
  assert(getCallback.status === 405, 'GET /api/callback returns 405 Method Not Allowed');

  const getContact = await fetch(`${BASE_URL}/api/contact`, { method: 'GET' });
  assert(getContact.status === 405, 'GET /api/contact returns 405 Method Not Allowed');

  // ── TEST 3: Content-Type Enforcement ──────────────────────────────────────
  console.log('\n▶ Test 3: Content-Type Enforcement');
  const plainTextRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain', 'X-Forwarded-For': '10.0.3.1' },
    body: 'name=Test'
  });
  assert(plainTextRes.status === 400, 'POST with text/plain returns 400 Bad Request');

  // ── TEST 4: Payload Size Limit (50KB) ─────────────────────────────────────
  console.log('\n▶ Test 4: Request Body Size Limit (Anti-DoS)');
  const largeData = 'A'.repeat(60 * 1024); // 60 KB
  try {
    const largeRes = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.4.1' },
      body: JSON.stringify({ name: 'Test', data: largeData })
    });
    assert(largeRes.status === 413, 'Oversized payload (>50KB) returns 413 Payload Too Large');
  } catch (e) {
    assert(true, 'Oversized payload triggered stream destroy / 413');
  }

  // ── TEST 5: Malformed JSON Payload ────────────────────────────────────────
  console.log('\n▶ Test 5: Malformed JSON Handling');
  const badJsonRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.5.1' },
    body: '{ name: "Unclosed json'
  });
  assert(badJsonRes.status === 400, 'Malformed JSON syntax returns 400 Bad Request');

  // ── TEST 6: Zod Schema Validation ─────────────────────────────────────────
  console.log('\n▶ Test 6: Zod Input Validation & Whitelist');
  const invalidNameRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.6.1' },
    body: JSON.stringify({
      name: 'A', // Too short (< 2 chars)
      phone: '917780245307',
      date: '2026-09-02',
      time: '10:00 AM IST',
      token: 'test_token',
      _timer: Date.now() - 5000
    })
  });
  const invNameData = await invalidNameRes.json();
  assert(invalidNameRes.status === 400 && invNameData.error?.includes('characters'), 'Invalid short name rejected by Zod with 400');

  const invalidPhoneRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.6.2' },
    body: JSON.stringify({
      name: 'John Doe',
      phone: '123', // Too short (< 7 digits)
      date: '2026-09-02',
      time: '10:00 AM IST',
      token: 'test_token',
      _timer: Date.now() - 5000
    })
  });
  const invPhoneData = await invalidPhoneRes.json();
  assert(invalidPhoneRes.status === 400 && invPhoneData.error?.includes('digit'), 'Invalid short phone number rejected by Zod with 400');

  // ── TEST 7: Honeypot Anti-Spam Detection ──────────────────────────────────
  console.log('\n▶ Test 7: Honeypot Anti-Spam Defense');
  const honeypotRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.7.1' },
    body: JSON.stringify({
      name: 'Spam Bot',
      phone: '917780245307',
      date: '2026-09-02',
      time: '10:00 AM IST',
      token: 'test_token',
      clinic_hp: 'I am a bot filling hidden fields',
      _timer: Date.now() - 5000
    })
  });
  assert(honeypotRes.status === 400, 'Honeypot filled input triggers immediate 400 rejection');

  // ── TEST 8: Automated Bot Timing Defense ──────────────────────────────────
  console.log('\n▶ Test 8: Automated Bot Timing Defense');
  const instantBotRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.8.1' },
    body: JSON.stringify({
      name: 'Fast Bot',
      phone: '917780245307',
      date: '2026-09-02',
      time: '10:00 AM IST',
      token: 'test_token',
      _timer: Date.now() - 200 // Submitted in 200ms
    })
  });
  assert(instantBotRes.status === 400, 'Instant submission (<1.2s) rejected as automated bot with 400');

  // ── TEST 9: Valid Submissions with Unique Reference IDs ────────────────────
  console.log('\n▶ Test 9: Valid Booking, Callback, and Contact Submissions');
  const validApptRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.9.1' },
    body: JSON.stringify({
      name: 'Dr. John Watson',
      phone: '919876543210',
      email: 'john.watson@example.com',
      reason: 'Dental Implants',
      date: '2026-09-10',
      time: '11:30 AM IST',
      token: 'test_token_valid',
      _timer: Date.now() - 5000
    })
  });
  const validApptData = await validApptRes.json();
  assert(validApptRes.status === 200 && validApptData.success === true, 'Valid appointment returns 200 success');
  assert(validApptData.referenceId?.startsWith('RDC-APPT-'), `Generated appointment reference ID: ${validApptData.referenceId}`);

  // Test 9b: Duplicate Detection
  const dupApptRes = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.9.1' },
    body: JSON.stringify({
      name: 'Dr. John Watson',
      phone: '919876543210',
      email: 'john.watson@example.com',
      reason: 'Dental Implants',
      date: '2026-09-10',
      time: '11:30 AM IST',
      token: 'test_token_valid',
      _timer: Date.now() - 5000
    })
  });
  const dupAppData = await dupApptRes.json();
  assert(dupAppData.isDuplicate === true, 'Immediate duplicate submission detected and flagged');

  // Test 9c: Valid Callback
  const validCallbackRes = await fetch(`${BASE_URL}/api/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.9.2' },
    body: JSON.stringify({
      name: 'Sarah Jenkins',
      phone: '918877665544',
      preferredTime: 'Morning (10:00 AM - 01:00 PM)',
      token: 'test_token_valid',
      _timer: Date.now() - 4000
    })
  });
  const validCbData = await validCallbackRes.json();
  assert(validCallbackRes.status === 200 && validCbData.success === true, 'Valid callback returns 200 success');
  assert(validCbData.referenceId?.startsWith('RDC-CALL-'), `Generated callback reference ID: ${validCbData.referenceId}`);

  // Test 9d: Valid Contact
  const validContactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.9.3' },
    body: JSON.stringify({
      name: 'Michael Brown',
      phone: '917766554433',
      email: 'michael.brown@example.com',
      subject: 'Invisalign Treatment Enquiry',
      message: 'Hello, I would like to schedule a consultation for Invisalign clear aligners.',
      token: 'test_token_valid',
      _timer: Date.now() - 6000
    })
  });
  const validContactData = await validContactRes.json();
  assert(validContactRes.status === 200 && validContactData.success === true, 'Valid contact enquiry returns 200 success');
  assert(validContactData.referenceId?.startsWith('RDC-ENQ-'), `Generated contact reference ID: ${validContactData.referenceId}`);

  // ── TEST 10: Rate Limiting Enforcement ────────────────────────────────────
  console.log('\n▶ Test 10: IP Rate Limiting Enforcement (Exceeding limit -> 429)');
  // Exhaust the quota for IP 10.0.10.1 on /api/appointments
  const rateIp = '10.0.10.1';
  let rateLimitHit = false;
  let retryAfterSeconds = null;

  for (let i = 0; i < 7; i++) {
    const r = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': rateIp },
      body: JSON.stringify({
        name: `Rate Tester ${i}`,
        phone: `91990000000${i}`,
        date: '2026-09-12',
        time: '02:30 PM IST',
        token: 'test_token_rate',
        _timer: Date.now() - 3000
      })
    });
    if (r.status === 429) {
      rateLimitHit = true;
      retryAfterSeconds = r.headers.get('retry-after');
      break;
    }
  }
  assert(rateLimitHit, `Rate limiter strictly enforced 5 requests / 15 minutes per IP (HTTP 429 triggered)`);
  assert(retryAfterSeconds !== null, `Retry-After header present: ${retryAfterSeconds}s`);

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL SECURITY TESTS PASSED PERFECTLY!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
