"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_errors_1 = require("http-errors");
const helper_1 = require("../helper");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            // Validate request body
            (0, helper_1.fieldValidateError)(req);
            if (password !== confirmPassword) {
                throw new http_errors_1.NotAcceptable("Password and confirmPassword must be equal");
            }
            const user = await auth_service_1.AuthService.register({ name, email, password });
            res.status(201).json({
                success: true,
                msg: "You have registered successfully!",
                data: user,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            (0, helper_1.fieldValidateError)(req);
            const { user, accessToken, refreshToken } = await auth_service_1.AuthService.login({
                email,
                password,
            });
            // Set both cookies
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.status(200).json({
                success: true,
                msg: "Login successful",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken)
                return res
                    .status(401)
                    .json({ success: false, msg: "No refresh token" });
            const { accessToken } = await auth_service_1.AuthService.rotateTokens(refreshToken);
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.status(200).json({
                success: true,
                msg: "Token rotated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.payload?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, msg: "Unauthorized" });
            }
            const user = await auth_service_1.AuthService.getProfile(userId);
            res.status(200).json({
                success: true,
                msg: "Profile fetched successfully",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            });
            res.status(200).json({
                success: true,
                msg: "Logged out successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map