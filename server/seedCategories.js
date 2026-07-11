import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { name: "Rings", slug: "rings", description: "Timeless rings crafted for every moment." },
  { name: "Necklaces", slug: "necklaces", description: "Elegant necklaces that define your presence." },
  { name: "Earrings", slug: "earrings", description: "Refined earrings for everyday luxury." },
  { name: "Bracelets", slug: "bracelets", description: "Handcrafted bracelets, effortlessly elegant." },
  { name: "Wedding Collection", slug: "wedding-collection", description: "Celebrate forever with timeless designs." },
  { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to the Lumière house." },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    for (const cat of categories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Skipped (already exists): ${cat.name}`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seed();
