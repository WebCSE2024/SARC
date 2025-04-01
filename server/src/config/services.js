export const initializeServices = async () => {
    try {
      const rabbitMQUrl = process.env.RABBITMQ_URL;

  
      // Initialize all services

 
  
      console.log("Services initialized successfully");
    } catch (error) {
      console.error("Failed to initialize services:", error);
      process.exit(1);
    }
  };