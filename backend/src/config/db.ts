import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URL!);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};
