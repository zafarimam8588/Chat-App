import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export const connectToDB = async () => {
  console.log(process.env.MONGO_DB_URL);
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URL!);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
