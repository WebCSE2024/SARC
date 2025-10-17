import config from "../../../../../shared/rabbitmq/publication.configurations.js";
import RabbitMQClient from "../../../../../shared/rabbitmq/rabbit.setup.js";
import { createPublication } from "./publication.controller.js";

class PublicationServiceSARC {
  constructor() {
    this.client = new RabbitMQClient();
  }

  async initialize(url) {
    await this.client.connect(url);

    if (config.PUBLICATION_EXCHANGES.PUBLICATIONS) {
      await this.client.createExchange(
        config.PUBLICATION_EXCHANGES.PUBLICATIONS,
        "direct"
      );
    }

    await this.client.createQueue(config.PUBLICATION_QUEUES.PUBLICATIONS);

    // Consuming From Queues
    await this.client.consumeFromQueue(
      config.PUBLICATION_QUEUES.PUBLICATIONS,
      async (content, message) => {
        const routingKey = message.fields?.routingKey;
        if (
          routingKey === config.PUBLICATION_ROUTING_KEYS.PUBLICATION_RESULT ||
          !config.PUBLICATION_ROUTING_KEYS.PUBLICATION_RESULT
        ) {
          await this.createPublicationList(content);
        } else {
          console.warn(`Unhandled routing key: ${routingKey}`);
          return {
            success: false,
            error: `Unhandled routing key: ${routingKey}`,
          };
        }
      }
    );
  }

  async createPublicationList(content) {
    try {
      const result = await createPublication(content);
      if (!result.success) {
        console.error("Error creating publication:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Error in creating Publication:", error);
    }
  }

  async closeConnection() {
    await this.client.closeConnection();
  }
}

const publicationServiceSARC = new PublicationServiceSARC();
export default publicationServiceSARC;
