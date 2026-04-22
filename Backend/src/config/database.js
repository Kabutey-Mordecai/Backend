import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set. Check Backend/src/.env");
    }

    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI,
    );
    console.log(
      `\n MongoDB Connected: ${connectionInstance.connection.host} \n`,
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
