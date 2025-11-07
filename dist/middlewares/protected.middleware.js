"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
const jwt_service_1 = require("../utils/jwt.service");
const user_model_1 = __importDefault(require("../model/user.model"));
class ProtectedMiddleware extends jwt_service_1.JwtService {
    protected = async (req, res, next) => {
        try {
            const token = req.cookies?.access_token;
            if (!token)
                throw new http_errors_1.Unauthorized("Unauthorized");
            const payload = this.verifyAccessToken(token);
            if (!payload?.userId)
                throw new http_errors_1.Unauthorized("Unauthorized");
            const user = await user_model_1.default.findById(payload.userId);
            if (!user)
                throw new http_errors_1.Unauthorized("Unauthorized");
            req.payload = payload;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = ProtectedMiddleware;
//# sourceMappingURL=protected.middleware.js.map