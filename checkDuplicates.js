// One-off script: checks for duplicate razorpayOrderId values in the Order
// collection before adding a unique+sparse index. Safe to delete after running.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/Order.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const duplicates = await Order.aggregate([
      { $match: { razorpayOrderId: { $ne: null } } },
      {
        $group: {
          _id: "$razorpayOrderId",
          count: { $sum: 1 },
          orderIds: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicates.length === 0) {
      console.log("✅ No duplicate razorpayOrderId values found. Safe to add the unique+sparse index.");
    } else {
      console.log(`⚠️  Found ${duplicates.length} duplicate razorpayOrderId value(s):`);
      console.log(JSON.stringify(duplicates, null, 2));
      console.log("\nResolve these before adding the unique index, or index creation will fail.");
    }
  } catch (error) {
    console.error("Error checking duplicates:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
