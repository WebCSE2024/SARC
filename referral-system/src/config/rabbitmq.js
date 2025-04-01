const amqp = require('amqplib');

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      // Ensure queues exist
      await this.channel.assertQueue('referral_approval_queue', { durable: true });
      await this.channel.assertQueue('referral_status_queue', { durable: true });
      
      console.log('Connected to RabbitMQ');
      this.setupStatusListener();
    } catch (error) {
      console.error('RabbitMQ Connection Error:', error);
      throw error;
    }
  }

  async setupStatusListener() {
    try {
      // Listen for status updates from admin portal
      await this.channel.consume('referral_status_queue', async (data) => {
        if (data) {
          const { referralId, status, admin_notes } = JSON.parse(data.content);
          
          try {
            // Update referral status in database
            const Referral = require('../models/Referral');
            await Referral.findByIdAndUpdate(referralId, {
              status,
              admin_notes,
              updated_at: new Date()
            });

            this.channel.ack(data);
          } catch (error) {
            console.error('Error processing status update:', error);
            this.channel.nack(data);
          }
        }
      });
    } catch (error) {
      console.error('Error setting up status listener:', error);
      throw error;
    }
  }

  async sendForApproval(referralData) {
    try {
      await this.channel.sendToQueue(
        'referral_approval_queue',
        Buffer.from(JSON.stringify(referralData)),
        { persistent: true }
      );
    } catch (error) {
      console.error('Error sending referral for approval:', error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

module.exports = new RabbitMQClient();