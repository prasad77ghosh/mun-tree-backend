"use strict";
// import App from "./app";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const appInstance = new App();
// // Export the Express app instance directly
// export default appInstance.app;
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const app = new app_1.default();
app.listen(config_1.port);
//# sourceMappingURL=server.js.map