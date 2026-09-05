async function test() {
  const res = await fetch('https://www.redesigndentalclinics.com/appointment');
  const html = await res.text();
  console.log('Status:', res.status, 'HTML length:', html.length);
  console.log('Has translations.js:', html.includes('translations.js'));
  console.log('Has i18n.js:', html.includes('i18n.js'));
  console.log('Has dark navbar css:', html.includes('background: rgba(2, 20, 23, 0.96)'));
  console.log('Has data-i18n apt.title:', html.includes('apt.title'));
  console.log('Has data-i18n apt.cardTitle:', html.includes('apt.cardTitle'));
  console.log('Has data-i18n booking.fullNameLabel:', html.includes('booking.fullNameLabel'));
}
test();
