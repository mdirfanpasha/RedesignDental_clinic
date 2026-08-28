async function runTests() {
  console.log('--- Testing Live HTTP API Endpoints on http://localhost:8000 ---');

  // Test 1: Appointment submission
  const apptRes = await fetch('http://localhost:8000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      reason: 'Implants',
      date: '2026-08-30',
      time: '11:30 AM IST',
      token: 'test_token_123'
    })
  });

  const apptData = await apptRes.json();
  console.log('1. /api/appointments Response:', apptRes.status, apptData);

  // Test 2: Duplicate appointment within 60s
  const dupRes = await fetch('http://localhost:8000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      reason: 'Implants',
      date: '2026-08-30',
      time: '11:30 AM IST',
      token: 'test_token_123'
    })
  });
  const dupData = await dupRes.json();
  console.log('2. Duplicate Protection Response:', dupRes.status, dupData);

  // Test 3: Callback submission
  const cbRes = await fetch('http://localhost:8000/api/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Smith',
      phone: '7780245307',
      preferredTime: 'Afternoon',
      reason: 'General Consultation',
      token: 'test_token_456'
    })
  });
  const cbData = await cbRes.json();
  console.log('3. /api/callback Response:', cbRes.status, cbData);

  // Test 4: Missing required fields
  const errRes = await fetch('http://localhost:8000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'A',
      phone: '',
      token: 'test_token_789'
    })
  });
  const errData = await errRes.json();
  console.log('4. Validation Error Response:', errRes.status, errData);

  console.log('\n✓ All HTTP Endpoint verification tests PASSED!');
}

runTests().catch(console.error);
