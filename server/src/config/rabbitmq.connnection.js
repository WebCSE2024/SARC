import newsService from "../setup/rabbitmq/news.rabbitmq.js";
import publicationService from "../domains/publications/publication.rabbitmq.js";

export const initializeServices = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL;

    // Initialize existing services
    // ...

    // Initialize news service
    await newsService.initialize(rabbitMQUrl);
    console.log("News service initialized");

    await publicationService.initialize(rabbitMQUrl);
    console.log("Publication service initialized");

    console.log("Services initialized successfully");
  } catch (error) {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  }
};
