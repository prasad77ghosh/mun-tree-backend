"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
class DataBase {
    static uri = config_1.db_url;
    static async connect() {
        try {
            // Check if we already have a connection
            if (global.mongoose && mongoose_1.default.connection.readyState === 1) {
                console.log('Using existing database connection');
                return;
            }
            mongoose_1.default.set("strictQuery", true);
            // Connection options
            const options = {
                serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                keepAlive: true,
                maxPoolSize: 50,
                wtimeoutMS: 30000,
            };
            // Create the connection
            const db = await mongoose_1.default.connect(this.uri, options);
            // Save the connection
            global.mongoose = db;
            console.log("DB Connected Successfully..");
            return db;
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }
    static async disConnect() {
        try {
            if (global.mongoose) {
                await mongoose_1.default.disconnect();
                global.mongoose = null;
                console.log("DB Disconnected Successfully..");
            }
        }
        catch (error) {
            console.error("Error disconnecting from MongoDB:", error);
            throw error;
        }
    }
}
const DB = DataBase;
exports.default = DB;
//# sourceMappingURL=databse.js.map