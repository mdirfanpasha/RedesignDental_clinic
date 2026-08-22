import http from 'http';

const routes = ['/', '/about', '/services', '/gallery', '/blog', '/contact', '/privacy', '/terms', '/cookies', '/licenses'];

function checkRoute(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:8000' + path, (res) => {
      resolve({ path, statusCode: res.statusCode, location: res.headers.location });
    }).on('error', (err) => resolve({ path, error: err.message }));
  });
}

async function testAll() {
  console.log('Testing Clean Routes:');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(`  ${r.padEnd(12)} -> status ${res.statusCode}`);
  }

  console.log('\nTesting 301 Redirects:');
  const redirects = ['/service', '/service.html', '/services.html', '/about.html', '/index.html'];
  for (const r of redirects) {
    const res = await checkRoute(r);
    console.log(`  ${r.padEnd(16)} -> status ${res.statusCode} (Redirects to ${res.location})`);
  }
}

testAll();
