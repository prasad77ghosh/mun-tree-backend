"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const appInstance = new app_1.default();
// Export the Express app instance directly
exports.default = appInstance.app;
// import App from "./app";
// import { port } from "./config";
// const app = new App();
// app.listen(port);
//# sourceMappingURL=server.js.map