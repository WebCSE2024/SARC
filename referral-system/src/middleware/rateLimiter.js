const rateLimit = require('express-rate-limit');

module.exports = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per windowMs
    message: {
      error: 'Too many requests, please try again later.'
    }
  });
};