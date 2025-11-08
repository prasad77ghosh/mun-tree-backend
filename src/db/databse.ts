import mongoose from "mongoose";
import { db_url } from "../config";

declare global {
  var mongoose: any; // This is important for types
}

class DataBase {
  private static uri: string = db_url;

  public static async connect() {
    try {
      // Check if we already have a connection
      if (global.mongoose && mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
      }

      mongoose.set("strictQuery", true);

      // Connection options
      const options = {
        serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        keepAlive: true,
        maxPoolSize: 50,
        wtimeoutMS: 30000,
      };

      // Create the connection
      const db = await mongoose.connect(this.uri, options);
      
      // Save the connection
      global.mongoose = db;
      
      console.log("DB Connected Successfully..");
      return db;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  public static async disConnect() {
    try {
      if (global.mongoose) {
        await mongoose.disconnect();
        global.mongoose = null;
        console.log("DB Disconnected Successfully..");
      }
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}

const DB = DataBase;
export default DB;
