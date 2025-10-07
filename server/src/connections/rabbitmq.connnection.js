import newsService from "../rabbitmq/news.rabbitmq.js";

export const initializeServices = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL;

    // Initialize existing services
    // ...

    // Initialize news service
    await newsService.initialize(rabbitMQUrl);
    console.log("News service initialized");

    // Initialize user registration consumer

    console.log("Services initialized successfully");
  } catch (error) {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  }
};
