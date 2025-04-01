const axios = require('axios');

class AuthService {
  constructor() {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL;
  }

  async validateToken(token) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/validate-token`, {
        token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw new Error('Invalid token');
    }
  }

  async getUserDetails(userId) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw new Error('Failed to fetch user details');
    }
  }
}

module.exports = new AuthService();