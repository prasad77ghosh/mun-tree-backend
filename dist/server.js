"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const appInstance = new app_1.default();
// Initialize the app
appInstance.init();
// For local development
// if (process.env.NODE_ENV !== 'production') {
//   appInstance.listen(port);
// }
// For Vercel
exports.default = appInstance.app;
//# sourceMappingURL=server.js.map