import '../backend/server.js';

export default function handler(req, res) {
  const app = require('../backend/server.js');
  return app(req, res);
}