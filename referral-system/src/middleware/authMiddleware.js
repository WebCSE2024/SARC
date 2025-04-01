const authService = require('../services/authService');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate token with auth service
    const userData = await authService.validateToken(token);
    
    if (!userData) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get detailed user info
    const userDetails = await authService.getUserDetails(userData.userId);
    req.user = { ...userData, ...userDetails };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};