import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to MongoDB", error.message);
    }
};

export default connectDB;