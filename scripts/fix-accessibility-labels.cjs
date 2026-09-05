const fs = require('fs');
const path = require('path');

// 1. Fix contact.html
const contactPath = path.join(__dirname, '..', 'contact.html');
let contact = fs.readFileSync(contactPath, 'utf8');

// Replace contact logo webp fix if needed (clean syntax)
contact = contact.replace('class="logo_image"/ width=', 'class="logo_image" width=');
contact = contact.replace('class="brand_logo" / width=', 'class="brand_logo" width=');

// Fix honeypot & typo in contact.html
contact = contact.replace(
    '<input type="text" name="clinic_hp" id="rc-contact-hp" style="display:none!important; position:absolute; left:-9999px;" tabindex="-1" autocomplete="off" />',
    '<input type="text" name="clinic_hp" id="rc-contact-hp" style="display:none!important; position:absolute; left:-9999px;" tabindex="-1" autocomplete="off" aria-hidden="true" aria-label="Do not fill" />'
);

contact = contact.replace(
    'data-i18n="contact.form.nameLabel"<span data-i18n="contact.form.nameLabel">Full Name</span> *</label>',
    'data-i18n="contact.form.nameLabel"><span data-i18n="contact.form.nameLabel">Full Name</span> *</label>'
);

fs.writeFileSync(contactPath, contact, 'utf8');
console.log('Fixed contact.html');

// 2. Fix booking.html
const bookingPath = path.join(__dirname, '..', 'booking.html');
let booking = fs.readFileSync(bookingPath, 'utf8');

booking = booking.replace(
    '<input type="text" name="clinic_hp" id="direct-booking-hp"\r\n                                    style="display:none!important; position:absolute; left:-9999px;" tabindex="-1"\r\n                                    autocomplete="off" />',
    '<input type="text" name="clinic_hp" id="direct-booking-hp"\r\n                                    style="display:none!important; position:absolute; left:-9999px;" tabindex="-1"\r\n                                    autocomplete="off" aria-hidden="true" aria-label="Do not fill" />'
);

booking = booking.replace(
    '<input type="text" name="clinic_hp" id="direct-booking-hp"\n                                    style="display:none!important; position:absolute; left:-9999px;" tabindex="-1"\n                                    autocomplete="off" />',
    '<input type="text" name="clinic_hp" id="direct-booking-hp"\n                                    style="display:none!important; position:absolute; left:-9999px;" tabindex="-1"\n                                    autocomplete="off" aria-hidden="true" aria-label="Do not fill" />'
);

fs.writeFileSync(bookingPath, booking, 'utf8');
console.log('Fixed booking.html');
