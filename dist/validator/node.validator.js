"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeValidator = void 0;
const express_validator_1 = require("express-validator");
exports.NodeValidator = {
    createNodeValidator: [
        // parentId: optional (only required for replies)
        (0, express_validator_1.body)("parentId")
            .optional()
            .isMongoId()
            .withMessage("Invalid parentId format"),
        // If parentId exists => operation & rightValue are required
        (0, express_validator_1.body)("operation")
            .if((0, express_validator_1.body)("parentId").exists())
            .notEmpty()
            .withMessage("operation is required when parentId is provided")
            .isIn(["+", "-", "*", "/"])
            .withMessage("Invalid operation. Allowed: +, -, *, /"),
        (0, express_validator_1.body)("rightValue")
            .if((0, express_validator_1.body)("parentId").exists())
            .notEmpty()
            .withMessage("rightValue is required when parentId is provided")
            .isNumeric()
            .withMessage("rightValue must be a number"),
        // If parentId does NOT exist => initialValue is required for root node
        (0, express_validator_1.body)("initialValue")
            .if((0, express_validator_1.body)("parentId").not().exists())
            .notEmpty()
            .withMessage("initialValue is required when creating a root node")
            .isNumeric()
            .withMessage("initialValue must be a number"),
    ],
    createReplyValidator: [
        (0, express_validator_1.body)("parentId")
            .notEmpty()
            .withMessage("parentId is required")
            .isMongoId()
            .withMessage("Invalid parentId format"),
        (0, express_validator_1.body)("operation")
            .notEmpty()
            .withMessage("operation is required")
            .isIn(["+", "-", "*", "/"])
            .withMessage("Invalid operation"),
        (0, express_validator_1.body)("rightValue")
            .notEmpty()
            .withMessage("rightValue is required")
            .isNumeric()
            .withMessage("rightValue must be a number"),
    ],
    getRootsValidator: [
        (0, express_validator_1.query)("cursor")
            .optional()
            .isISO8601()
            .withMessage("Cursor must be a valid ISO date string"),
        (0, express_validator_1.query)("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be a number between 1 and 100"),
    ],
    getTreeValidator: [
        (0, express_validator_1.param)("rootId")
            .notEmpty()
            .withMessage("rootId is required")
            .isMongoId()
            .withMessage("Invalid rootId format"),
        (0, express_validator_1.query)("limit")
            .optional()
            .isInt({ min: 1, max: 2000 })
            .withMessage("limit must be an integer between 1 and 2000"),
        (0, express_validator_1.query)("cursor")
            .optional()
            .isMongoId()
            .withMessage("cursor must be a valid ObjectId"),
    ],
    getRepliesValidator: [
        (0, express_validator_1.param)("parentId")
            .notEmpty()
            .withMessage("parentId is required")
            .isMongoId()
            .withMessage("Invalid parentId format"),
        (0, express_validator_1.query)("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("limit must be between 1 and 100"),
        (0, express_validator_1.query)("cursor")
            .optional()
            .isMongoId()
            .withMessage("cursor must be a valid ObjectId"),
    ],
};
//# sourceMappingURL=node.validator.js.map