const pino = require('pino');
const config = require('config');

const logger = pino({
  useLevelLabel: true,
  app: config.name,
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    exception: pino.stdSerializers.err,
  },
  level: 'info',
  enabled: true
});

module.exports = logger;
