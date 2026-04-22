const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/profile',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Proxy Status:', res.statusCode);
    console.log('Response:', body.substring(0, 200));
  });
});

req.on('error', (e) => console.error('Proxy Error:', e.message));
req.end();