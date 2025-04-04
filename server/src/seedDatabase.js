import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.models.js";
import Seminar from "./models/seminar.models.js";
import { Publication } from "./models/publication.models.js";
import { Referral } from "./models/referral.models.js";
import { Comment } from "./models/comments.models.js";
import { Like } from "./models/like.models.js";
import Achievement from "./models/achievement.models.js";
import { alumni } from "./randomdata/alumni.random.js";
import { profs } from "./randomdata/prof.random.js";
import { students } from "./randomdata/student.random.js";

dotenv.config({ path: "../.env" });

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/sarc", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await Seminar.deleteMany();
    await Publication.deleteMany();
    await Referral.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await Achievement.deleteMany();

    console.log("Cleared existing data");

    // Insert Users
    const users = [...students, ...profs, ...alumni];
    const userDocs = await User.insertMany(users);
    console.log("Inserted Users");

    // Insert Seminars
    const seminars = Array.from({ length: 15 }, (_, i) => ({
      title: `Seminar Title ${i + 1}`,
      description: `Description for Seminar ${i + 1}`,
      speaker: {
        name: `Speaker ${i + 1}`,
        designation: `Designation ${i + 1}`,
        organization: `Organization ${i + 1}`,
      },
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      venue: `Venue ${i + 1}`,
    }));
    await Seminar.insertMany(seminars);
    console.log("Inserted Seminars");

    // Insert Publications
    const publications = Array.from({ length: 15 }, (_, i) => ({
      title: `Publication Title ${i + 1}`,
      publicationURL: `https://example.com/publication${i + 1}`,
      publisher: userDocs[i % userDocs.length]._id,
    }));
    await Publication.insertMany(publications);
    console.log("Inserted Publications");

    // Insert Referrals
    const referrals = Array.from({ length: 15 }, (_, i) => ({
      companyName: `Company ${i + 1}`,
      deadline: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      jobProfile: `Job Profile ${i + 1}`,
      addedBy: userDocs[i % userDocs.length]._id,
      requirements: `Requirements for Job ${i + 1}`,
      stipend: { amount: 5000 + i * 100, currency: "USD" },
      location: { city: `City ${i + 1}`, country: "Country" },
      mode: "remote",
      description: `Description for Job ${i + 1}`,
      email: `contact${i + 1}@company.com`,
      website: `https://company${i + 1}.com`,
    }));
    await Referral.insertMany(referrals);
    console.log("Inserted Referrals");

    // Insert Achievements
    const achievements = Array.from({ length: 15 }, (_, i) => ({
      achievementId: `ACH${i + 1}`,
      title: `Achievement Title ${i + 1}`,
      description: `Description for Achievement ${i + 1}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      awardedTo: `Awardee ${i + 1}`,
      tags: ["Tag1", "Tag2"],
      gallery: [
        {
          url: `https://example.com/gallery${i + 1}.jpg`,
          publicId: `gallery${i + 1}`,
        },
      ],
      status: "published",
    }));
    await Achievement.insertMany(achievements);
    console.log("Inserted Achievements");

    console.log("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
