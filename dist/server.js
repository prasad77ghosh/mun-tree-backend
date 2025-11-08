"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const appInstance = new app_1.default();
// Initialize routes and middlewares before export
// (async () => {
//   try {
//     await appInstance.init();
//     console.log("✅ App initialized successfully for Vercel deployment");
//   } catch (error) {
//     console.error("❌ App initialization failed:", error);
//   }
// })();
// appInstance.listen(port)
// 👇 Export the Express app as the default export for Vercel
exports.default = appInstance.app;
//# sourceMappingURL=server.js.map