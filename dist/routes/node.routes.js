"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_controller_1 = require("../controllers/node.controller");
const node_validator_1 = require("../validator/node.validator");
const protected_middleware_1 = __importDefault(require("../middlewares/protected.middleware"));
class NodeRoutes {
    router;
    nodeController;
    path = "tree";
    constructor() {
        this.router = (0, express_1.Router)();
        this.nodeController = new node_controller_1.NodeController();
        this.routes();
    }
    routes() {
        this.router.post("/add-node", new protected_middleware_1.default().protected, node_validator_1.NodeValidator.createNodeValidator, this.nodeController.create);
        this.router.post("/reply-to-node", new protected_middleware_1.default().protected, node_validator_1.NodeValidator.createReplyValidator, this.nodeController.reply);
        this.router.get("/get-roots", node_validator_1.NodeValidator.getRootsValidator, this.nodeController.getRoots);
        this.router.get("/get-full-tree/:rootId", node_validator_1.NodeValidator.getTreeValidator, this.nodeController.getTree);
        this.router.get("/get-replies/:parentId", node_validator_1.NodeValidator.getRepliesValidator, this.nodeController.getReplies);
    }
}
exports.default = NodeRoutes;
//# sourceMappingURL=node.routes.js.map