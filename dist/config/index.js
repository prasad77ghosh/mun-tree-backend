"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_url = exports.port = void 0;
require("dotenv/config");
exports.port = Number(process.env.PORT);
exports.db_url = String(process.env.MONGO_URI);
//# sourceMappingURL=index.js.map