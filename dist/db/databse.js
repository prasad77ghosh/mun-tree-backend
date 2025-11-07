"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
class DataBase {
    static uri = config_1.db_url;
    static connect() {
        mongoose_1.default.set("strictQuery", true);
        mongoose_1.default
            .connect(this.uri)
            .then(() => {
            console.log("DB Connected Successfully..");
        })
            .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
    }
    static disConnect() {
        mongoose_1.default
            .disconnect()
            .then(() => {
            console.log("DB DisConnected Successfully..");
        })
            .catch((error) => {
            console.error("Error disConnecting to MongoDB:", error);
        });
    }
}
const DB = DataBase;
exports.default = DB;
//# sourceMappingURL=databse.js.map