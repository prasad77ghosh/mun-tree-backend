"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllerValidator = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = require("http-errors");
exports.AuthControllerValidator = {
    // 🔹 REGISTER VALIDATION
    registerValidation: [
        (0, express_validator_1.body)("name")
            .notEmpty()
            .withMessage("name is required")
            .bail()
            .isString()
            .withMessage("name must be a string"),
        (0, express_validator_1.body)("email")
            .notEmpty()
            .withMessage("email is required")
            .bail()
            .isEmail()
            .withMessage("email must be a valid email address"),
        (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("password is required")
            .bail()
            .isLength({ min: 8 })
            .withMessage("password must be at least 8 characters long"),
        // Uncomment below for strong password policy
        // .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        // .withMessage("password must contain one uppercase letter, one lowercase letter, one number, and one special character"),
        (0, express_validator_1.body)("confirmPassword")
            .notEmpty()
            .withMessage("confirmPassword is required")
            .bail()
            .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new http_errors_1.NotAcceptable("Password and confirmPassword do not match");
            }
            return true;
        }),
    ],
    // 🔹 LOGIN VALIDATION
    loginValidation: [
        (0, express_validator_1.body)("email")
            .notEmpty()
            .withMessage("email is required")
            .bail()
            .isEmail()
            .withMessage("email must be valid"),
        (0, express_validator_1.body)("password")
            .notEmpty()
            .withMessage("password is required")
            .bail()
            .isString()
            .withMessage("password must be a string"),
    ],
    // 🔹 REFRESH TOKEN VALIDATION
    refreshValidation: [
        (0, express_validator_1.cookie)("refresh_token")
            .notEmpty()
            .withMessage("Refresh token cookie is missing")
            .bail()
            .isString()
            .withMessage("Refresh token must be a string"),
    ],
    // 🔹 LOGOUT VALIDATION (optional)
    logoutValidation: [
        (0, express_validator_1.cookie)("access_token")
            .optional()
            .isString()
            .withMessage("Access token must be a string"),
        (0, express_validator_1.cookie)("refresh_token")
            .optional()
            .isString()
            .withMessage("Refresh token must be a string"),
    ],
};
//# sourceMappingURL=auth.validator.js.map