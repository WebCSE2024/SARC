import config from "../../../../../shared/rabbitmq/sig.configuration.js";
import RabbitMQClient from "../../../../../shared/rabbitmq/rabbit.setup.js";
import { UserType } from "../../../../../shared/types/user.type.js";
import { Project, SIG } from "../../domains/sig/sig.model.js";
import { SIGType } from "../../../../../shared/types/user.type.js";

const SIG_SEED_DATA = [
  {
    sigId: SIGType.AI,
    name: "ANVESH",
    description:
      "'Exploring' intelligence through innovation—advancing ethical, human-centric AI and machine learning for global impact.",
    isActive: true,
  },
  {
    sigId: SIGType.SYSTEMS,
    name: "Computing Systems",
    description:
      "Cloud computing, IoT solutions for agriculture, distributed systems, and performance optimization",
    isActive: true,
  },
  {
    sigId: SIGType.SECURITY,
    name: "Information Security",
    description:
      "Blockchain for e-governance, privacy-preserving systems, post-quantum cryptography, and network security",
    isActive: true,
  },
  {
    sigId: SIGType.THEORY,
    name: "Theoretical Computer Science",
    description:
      "Exploring quantum algorithms, graph theory, and computational complexity for solving fundamental problems",
    isActive: true,
  },
];

class SIGService {
  constructor() {
    this.client = new RabbitMQClient();
  }

  async initialize(url) {
    await this.client.connect(url);

    await this.client.createQueue(config.SIG_QUEUES.PROJECT);

    await this.client.consumeFromQueue(
      config.SIG_QUEUES.PROJECT,
      async (content, message) => {
        const routingKey = message.fields?.routingKey;
        if (routingKey === config.SIG_ROUTING_KEYS.PROJECT_CREATED) {
          await this.createProject(content);
        } else if (routingKey === config.SIG_ROUTING_KEYS.PROJECT_UPDATED) {
          await this.updateProject(content);
        } else if (routingKey === config.SIG_ROUTING_KEYS.PROJECT_DELETED) {
          await this.deleteProject(content);
        } else {
          console.warn(`Unhandled routing key: ${routingKey}`);
          return {
            success: false,
            error: `Unhandled routing key: ${routingKey}`,
          };
        }
      }
    );

    console.log("SARC SIG Service Initialized.");
  }

  async seedSIGs() {
    try {
      for (const sigData of SIG_SEED_DATA) {
        const existing = await SIG.findOne({ sigId: sigData.sigId });
        if (!existing) {
          await SIG.create(sigData);
          console.log(`Seeded SIG: ${sigData.name}`);
        }
      }
      console.log("SIG seed check completed");
    } catch (error) {
      console.error("Error seeding SIGs:", error);
      throw error;
    }
  }

  isAdmin(userType) {
    return userType === UserType.ADMIN;
  }

  async createProject(content) {
    try {
      const { projectData, requestedBy, userType } = content;

      if (!this.isAdmin(userType)) {
        console.error("Unauthorized attempt to create project");
        return { success: false, error: "Unauthorized" };
      }

      const project = new Project({
        title: projectData.title,
        description: projectData.description,
        date: new Date(projectData.date),
        year: projectData.year,
        sigId: projectData.sigId,
        media: projectData.media || undefined,
      });

      await project.save();
      console.log(`Project created: ${project.title}`);
      return { success: true, data: project };
    } catch (error) {
      console.error("Error creating project:", error);
      return { success: false, error: error.message };
    }
  }

  async updateProject(content) {
    try {
      const { projectId, updateData, requestedBy, userType } = content;

      if (!this.isAdmin(userType)) {
        console.error("Unauthorized attempt to update project");
        return { success: false, error: "Unauthorized" };
      }

      const existingProject = await Project.findById(projectId);
      if (!existingProject) {
        console.error(`Project with ID ${projectId} not found`);
        return { success: false, error: "Project not found" };
      }

      const updates = {};
      if (updateData.title !== undefined) updates.title = updateData.title;
      if (updateData.description !== undefined)
        updates.description = updateData.description;
      if (updateData.date !== undefined)
        updates.date = new Date(updateData.date);
      if (updateData.year !== undefined) updates.year = updateData.year;
      if (updateData.sigId !== undefined) updates.sigId = updateData.sigId;
      if (updateData.media !== undefined) updates.media = updateData.media;

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updates },
        { new: true }
      );

      console.log(`Project updated: ${projectId}`);
      return { success: true, data: updatedProject };
    } catch (error) {
      console.error("Error updating project:", error);
      return { success: false, error: error.message };
    }
  }

  async deleteProject(content) {
    try {
      const { projectId, requestedBy, userType } = content;

      if (!this.isAdmin(userType)) {
        console.error("Unauthorized attempt to delete project");
        return { success: false, error: "Unauthorized" };
      }

      const project = await Project.findById(projectId);
      if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return { success: false, error: "Project not found" };
      }

      await Project.findByIdAndDelete(projectId);
      console.log(`Project deleted: ${projectId}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { success: false, error: error.message };
    }
  }

  async closeConnection() {
    await this.client.closeConnection();
  }
}

export default new SIGService();
