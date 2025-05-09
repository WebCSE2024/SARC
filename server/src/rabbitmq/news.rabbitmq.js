import config from "../../../../shared/rabbitmq/news.configuration.js";
import RabbitMQClient from "../../../../shared/rabbitmq/rabbit.setup.js";
import { NewsType } from "../../../../shared/types/news.type.js";
import Achievement from "../models/achievement.models.js";
import { UserType } from "../../../../shared/types/user.type.js";
import Seminar from "../models/seminar.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../connections/coludinaryConnection.js";

class NewsService {
  constructor() {
    this.client = new RabbitMQClient();
  }

  async initialize(url) {
    await this.client.connect(url);

    await this.client.createQueue(config.NEWS_QUEUES.NEWS);

    await this.client.consumeFromQueue(
      config.NEWS_QUEUES.NEWS,
      async (content, message) => {
        const routingKey = message.fields?.routingKey;
        if (routingKey === config.NEWS_ROUTING_KEYS.NEWS_CREATED) {
          await this.createNews(content);
        } else if (routingKey === config.NEWS_ROUTING_KEYS.NEWS_UPDATED) {
          await this.updateNews(content);
        } else if (routingKey === config.NEWS_ROUTING_KEYS.NEWS_DELETED) {
          await this.deleteNews(content);
        } else {
          console.warn(`Unhandled routing key: ${routingKey}`);
          return {
            success: false,
            error: `Unhandled routing key: ${routingKey}`,
          };
        }
      }
    );

    console.log("SARC News Service Initialized.");
  }

  async isAdmin(userType) {
    try {
      if (userType === UserType.ADMIN) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error in isAdmin:", error);
      return false;
    }
  }

  async createNews(content) {
    try {
      const { news, requestedBy, userType } = content;
      const isAuthorized = await this.isAdmin(userType);

      if (!isAuthorized) {
        console.error("Unauthorized attempt to create news");
        return { success: false, error: "Unauthorized" };
      }

      if (news.type === NewsType.ACHIEVEMENT) {
        // Format and save achievement data
        const achievementData = {
          title: news.title,
          description: news.description,
          date: news.date,
          awardedTo: news.awardedTo,
          initiative: news.initiative,
          tags: news.tags || [],
          gallery: (news.images || []).map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
          socialMediaLinks: news.socialMediaLinks || [],
          status: "published",
        };

        const achievement = new Achievement(achievementData);
        await achievement.save();
        console.log("Achievement news created:", achievement._id);
        return { success: true, data: achievement };
      } else if (news.type === NewsType.SEMINAR) {
        // Format and save seminar data
        const seminarData = {
          title: news.title,
          description: news.description,
          speaker: {
            name: news.speaker.name,
            designation: news.speaker.designation || "",
            organization: news.speaker.organization || "",
          },
          date: news.date,
          venue: news.venue,
          // Add image if available
          image: news.imageUrl
            ? {
                url: news.imageUrl.url,
                publicId: news.imageUrl.publicId,
              }
            : undefined,
        };

        console.log(seminarData);

        const seminar = new Seminar(seminarData);
        await seminar.save();
        console.log("Seminar news created:", seminar._id);
        return { success: true, data: seminar };
      } else {
        console.warn(`Unhandled news type: ${news.type}`);
        return { success: false, error: `Unhandled news type: ${news.type}` };
      }
    } catch (error) {
      console.error("Error creating news:", error);
      return { success: false, error: error.message };
    }
  }

  async updateNews(content) {
    try {
      const { newsId, newsData, requestedBy, userType } = content;
      const isAuthorized = await this.isAdmin(userType);

      if (!isAuthorized) {
        console.error("Unauthorized attempt to update news");
        return { success: false, error: "Unauthorized" };
      }

      if (newsData.type === NewsType.ACHIEVEMENT) {
        // First find the existing achievement to get old images
        const existingAchievement = await Achievement.findOne({
          _id: newsId,
        });

        if (!existingAchievement) {
          console.error(`Achievement with ID ${newsId} not found`);
          return { success: false, error: "Achievement not found" };
        }

        // Delete old images if new images are provided
        if (
          newsData.images &&
          newsData.images.length > 0 &&
          existingAchievement.gallery
        ) {
          try {
            const deletePromises = existingAchievement.gallery.map((img) =>
              deleteFromCloudinary(img.publicId)
            );
            await Promise.all(deletePromises);
            console.log(
              `Deleted ${existingAchievement.gallery.length} old images for achievement ${newsId}`
            );
          } catch (error) {
            console.error("Error deleting old achievement images:", error);
            // Continue with update even if image deletion fails
          }
        }

        // Format and update achievement data
        const updateData = {
          title: newsData.title,
          description: newsData.description,
          date: newsData.date,
          awardedTo: newsData.awardedTo,
          initiative: newsData.initiative,
          tags: newsData.tags || [],
          gallery: (newsData.images || []).map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
          socialMediaLinks: newsData.socialMediaLinks || [],
        };

        // Filter out undefined values
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key]
        );

        const updatedAchievement = await Achievement.findOneAndUpdate(
          { _id: newsId },
          { $set: updateData },
          { new: true }
        );

        console.log("Achievement updated:", updatedAchievement._id);
        return { success: true, data: updatedAchievement };
      } else if (newsData.type === NewsType.SEMINAR) {
        // Find existing seminar to get old image
        const existingSeminar = await Seminar.findById(newsId);

        if (!existingSeminar) {
          console.error(`Seminar with ID ${newsId} not found`);
          return { success: false, error: "Seminar not found" };
        }

        // Delete old image if new image is provided
        if (
          newsData.imageUrl &&
          existingSeminar.image &&
          existingSeminar.image.publicId
        ) {
          try {
            await deleteFromCloudinary(existingSeminar.image.publicId);
            console.log(`Deleted old image for seminar ${newsId}`);
          } catch (error) {
            console.error("Error deleting old seminar image:", error);
            // Continue with update even if image deletion fails
          }
        }

        // Format and update seminar data
        const updateData = {
          title: newsData.title,
          description: newsData.description,
          speaker: {
            name: newsData.speaker.name,
            designation: newsData.speaker.designation || "",
            organization: newsData.speaker.organization || "",
          },
          date: newsData.date,
          venue: newsData.venue,
        };

        // Update image if available
        if (newsData.imageUrl) {
          updateData.image = {
            url: newsData.imageUrl.url,
            publicId: newsData.imageUrl.publicId,
          };
        }

        // Filter out undefined values
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key]
        );

        const updatedSeminar = await Seminar.findByIdAndUpdate(
          newsId,
          { $set: updateData },
          { new: true }
        );

        console.log("Seminar updated:", updatedSeminar._id);
        return { success: true, data: updatedSeminar };
      } else {
        console.warn(`Unhandled news type: ${newsData.type}`);
        return {
          success: false,
          error: `Unhandled news type: ${newsData.type}`,
        };
      }
    } catch (error) {
      console.error("Error updating news:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteNews(content) {
    try {
      const { newsId, requestedBy, userType } = content;
      const isAuthorized = await this.isAdmin(userType);

      if (!isAuthorized) {
        console.error("Unauthorized attempt to delete news");
        return { success: false, error: "Unauthorized" };
      }

      // Try to find the news in both models to delete associated images
      const achievement = await Achievement.findOne({ _id: newsId });
      const seminar = await Seminar.findById(newsId);

      // Clean up achievement images
      if (
        achievement &&
        achievement.gallery &&
        achievement.gallery.length > 0
      ) {
        try {
          const deletePromises = achievement.gallery.map((img) =>
            deleteFromCloudinary(img.publicId)
          );
          await Promise.all(deletePromises);
          console.log(
            `Deleted ${achievement.gallery.length} images for achievement ${newsId}`
          );
        } catch (error) {
          console.error("Error deleting achievement images:", error);
          // Continue with deletion even if image deletion fails
        }
      }

      // Clean up seminar image
      if (seminar && seminar.image && seminar.image.publicId) {
        try {
          await deleteFromCloudinary(seminar.image.publicId);
          console.log(`Deleted image for seminar ${newsId}`);
        } catch (error) {
          console.error("Error deleting seminar image:", error);
          // Continue with deletion even if image deletion fails
        }
      }

      // Delete the news from the appropriate model
      const deletedAchievement = achievement
        ? await Achievement.findOneAndDelete({ _id: newsId })
        : null;
      const deletedSeminar = seminar
        ? await Seminar.findByIdAndDelete(newsId)
        : null;

      if (deletedAchievement) {
        console.log("Achievement deleted:", newsId);
        return { success: true };
      }

      if (deletedSeminar) {
        console.log("Seminar deleted:", newsId);
        return { success: true };
      }

      console.error(`News with ID ${newsId} not found in any model`);
      return { success: false, error: "News not found" };
    } catch (error) {
      console.error("Error deleting news:", error);
      return { success: false, error: error.message };
    }
  }

  async closeConnection() {
    await this.client.closeConnection();
  }
}

export default new NewsService();
