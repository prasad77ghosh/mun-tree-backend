"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validator/auth.validator");
const protected_middleware_1 = __importDefault(require("../middlewares/protected.middleware"));
class AuthRoutes {
    router;
    authController;
    path = "api/v1/auth";
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.AuthController();
        this.routes();
    }
    routes() {
        this.router.post("/register", auth_validator_1.AuthControllerValidator.registerValidation, this.authController.register);
        this.router.post("/login", auth_validator_1.AuthControllerValidator.loginValidation, this.authController.login);
        this.router.post("/refresh", auth_validator_1.AuthControllerValidator.refreshValidation, this.authController.refreshToken);
        this.router.post("/logout", new protected_middleware_1.default().protected, auth_validator_1.AuthControllerValidator.logoutValidation, this.authController.logout);
        this.router.get("/profile", new protected_middleware_1.default().protected, this.authController.getProfile);
    }
}
exports.default = AuthRoutes;
//# sourceMappingURL=auth.routes.js.map