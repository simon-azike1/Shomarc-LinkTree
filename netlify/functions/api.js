const server = require('../../backend/server.js');
const serverless = require('serverless-http');

module.exports.handler = serverless(server);