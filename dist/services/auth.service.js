"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_errors_1 = require("http-errors");
const user_model_1 = __importDefault(require("../model/user.model"));
const encrtiption_service_1 = require("../utils/encrtiption.service");
const http_errors_2 = require("http-errors");
const jwt_service_1 = require("../utils/jwt.service");
class AuthService {
    static async register({ name, email, password }) {
        const isUserExist = await user_model_1.default.findOne({ email });
        if (isUserExist) {
            throw new http_errors_1.Conflict("A user already exists with this email");
        }
        const hashPassword = await new encrtiption_service_1.EncryptAndDecryptService().hashPassword(password);
        const user = await user_model_1.default.create({
            name,
            email,
            password: hashPassword,
        });
        return {
            name: user?.name,
            email: user?.email
        };
    }
    static async login({ email, password }) {
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user)
            throw new http_errors_2.NotFound("User not found");
        const isPasswordValid = await new encrtiption_service_1.EncryptAndDecryptService().comparePassword(password, user.password);
        if (!isPasswordValid)
            throw new http_errors_2.Unauthorized("Invalid credentials");
        const payload = { userId: user._id, email: user.email };
        const jwtService = new jwt_service_1.JwtService();
        const accessToken = jwtService.generateAccessToken(payload);
        const refreshToken = jwtService.generateRefreshToken(payload);
        return { user, accessToken, refreshToken };
    }
    static async rotateTokens(refreshToken) {
        const jwtService = new jwt_service_1.JwtService();
        const decoded = jwtService.verifyRefreshToken(refreshToken);
        const payload = { userId: decoded.userId, email: decoded.email };
        const accessToken = jwtService.generateAccessToken(payload);
        return { accessToken };
    }
    static async getProfile(userId) {
        const user = await user_model_1.default.findById(userId).select("-password -__v");
        if (!user)
            throw new http_errors_2.NotFound("User not found");
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map