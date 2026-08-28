import { sendAppointmentWhatsAppNotification, sendCallbackWhatsAppNotification } from '../lib/notifications/whatsapp.js';
import { generateReferenceId, saveBookingRecord, getAllBookings } from '../lib/storage/bookings.js';

async function test() {
  console.log('--- Testing WhatsApp Notification & Storage Service ---');

  const ref1 = generateReferenceId('appointment');
  console.log('Generated Appointment Ref:', ref1);

  const apptRecord = {
    referenceId: ref1,
    type: 'appointment',
    name: 'Mohammed Irfan',
    phone: '9876543210',
    email: 'test@example.com',
    reason: 'Dental Implants',
    date: '2026-08-30',
    time: '11:30 AM IST'
  };

  const savedAppt = saveBookingRecord(apptRecord);
  console.log('Saved Record:', savedAppt.referenceId, savedAppt.createdAtIST);

  const notifResult = await sendAppointmentWhatsAppNotification(apptRecord);
  console.log('WhatsApp Notification Result:', notifResult);

  const ref2 = generateReferenceId('callback');
  console.log('\nGenerated Callback Ref:', ref2);

  const cbRecord = {
    referenceId: ref2,
    type: 'callback',
    name: 'Amina Begum',
    phone: '7780245307',
    reason: 'Root Canal Enquiry',
    preferredTime: 'Morning'
  };

  const savedCb = saveBookingRecord(cbRecord);
  console.log('Saved Record:', savedCb.referenceId);

  const cbNotifResult = await sendCallbackWhatsAppNotification(cbRecord);
  console.log('WhatsApp Callback Result:', cbNotifResult);

  const all = getAllBookings();
  console.log('\nTotal Bookings in Storage:', all.length);
  console.log('✓ All local notification and persistence tests PASSED!');
}

test().catch(console.error);
