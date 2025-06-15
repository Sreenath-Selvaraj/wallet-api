const logger = require('@logger');

// This middleware logs incoming requests and their responses
exports.requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    }, 'Request completed');
  });

  next();
};