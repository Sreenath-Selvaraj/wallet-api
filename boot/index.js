const db = require('./db');
const server = require('./server');

async function initApp(app) {
  await db.connect();
  await server.setupServer(app);
}

async function shutdownApp() {
  db.close();
  server.closeServer();
}

module.exports = {
  initApp,
  shutdownApp
};