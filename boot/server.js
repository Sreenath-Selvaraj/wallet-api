const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('@logger');


const PORT = process.env.PORT || 3000;
let server = null;
const setupServer = async (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());

  server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
};

const closeServer = () => {
  if (server && server.close) {
    server.close(() => logger.info('Server closed'));
  } else {
    logger.error('No server instance to close');
  }
}

module.exports = {
  setupServer,
  closeServer
};