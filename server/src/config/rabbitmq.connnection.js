import publicationService from "../domains/publications/publication.rabbitmq.js";
import sigService from "../setup/rabbitmq/sig.rabbitmq.js";

export const initializeServices = async () => {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL;

    // Initialize existing services
    // ...

    await publicationService.initialize(rabbitMQUrl);
    console.log("Publication service initialized");

    // Initialize SIG service and seed data
    await sigService.initialize(rabbitMQUrl);
    await sigService.seedSIGs();
    console.log("SIG RabbitMQ service initialized");

    console.log("Services initialized successfully");
  } catch (error) {
    console.error("Failed to initialize services:", error);
    process.exit(1);
  }
};
