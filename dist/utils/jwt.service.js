"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    accessSecret = (process.env.JWT_ACCESS_SECRET ?? "access_secret");
    refreshSecret = (process.env.JWT_REFRESH_SECRET ?? "refresh_secret");
    accessExpiry = "15d";
    refreshExpiry = "7d";
    generateAccessToken(payload) {
        const options = { expiresIn: this.accessExpiry };
        return jsonwebtoken_1.default.sign(payload, this.accessSecret, options);
    }
    generateRefreshToken(payload) {
        const options = { expiresIn: this.refreshExpiry };
        return jsonwebtoken_1.default.sign(payload, this.refreshSecret, options);
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.accessSecret);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.refreshSecret);
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map