"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const helper_1 = require("../helper");
const node_service_1 = require("../services/node.service");
class NodeController {
    async create(req, res, next) {
        try {
            (0, helper_1.fieldValidateError)(req);
            const { parentId, operation, rightValue, initialValue } = req.body;
            const authorId = req.payload?.userId;
            const node = await node_service_1.NodeService.createNode({
                parentId,
                authorId,
                operation,
                rightValue,
                initialValue
            });
            res.status(201).json({
                success: true,
                msg: "Node Created Successfully...",
                data: node,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async reply(req, res, next) {
        try {
            (0, helper_1.fieldValidateError)(req);
            const { parentId, operation, rightValue } = req.body;
            const authorId = req.payload?.userId;
            const node = await node_service_1.NodeService.createNode({
                parentId,
                authorId,
                operation,
                rightValue,
            });
            return res.status(201).json({
                success: true,
                msg: "Reply created successfully",
                node,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getRoots(req, res, next) {
        try {
            (0, helper_1.fieldValidateError)(req);
            const cursor = req.query.cursor;
            const limit = parseInt(req.query.limit || "10");
            const { roots, pagination } = await node_service_1.NodeService.getRoots(cursor, limit);
            res.status(200).json({
                success: true,
                msg: "Root discussions fetched successfully",
                roots,
                pagination,
            });
        }
        catch (error) {
            console.error("Error fetching root discussions:", error.message);
            next(error);
        }
    }
    async getTree(req, res, next) {
        try {
            (0, helper_1.fieldValidateError)(req);
            const { rootId } = req.params;
            const { cursor, limit } = req.query;
            const result = await node_service_1.NodeService.getTree(rootId, cursor, parseInt(limit) || 1000);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching tree:", error.message);
            next(error);
        }
    }
    async getReplies(req, res, next) {
        try {
            (0, helper_1.fieldValidateError)(req);
            const { parentId } = req.params;
            const { cursor, limit } = req.query;
            const result = await node_service_1.NodeService.getRepliesFast(parentId, cursor, parseInt(limit, 10) || 10);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Error fetching replies:", error.message);
            next(error);
        }
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=node.controller.js.map