"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSchema = void 0;
const mongoose_1 = require("mongoose");
const nodeSchema = new mongoose_1.Schema({
    rootId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Node",
        index: true,
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Node",
        default: null,
        index: true,
    },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true,
    },
    leftValue: { type: Number },
    operation: {
        type: String,
        enum: ["+", "-", "*", "/", null],
        default: null,
    },
    rightValue: {
        type: Number,
        default: null,
    },
    result: { type: Number },
    status: {
        type: String,
        enum: ["confirmed", "pending", "rejected"],
        default: "confirmed",
    },
    createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
nodeSchema.pre("save", function (next) {
    if (!this.parentId) {
        this.rootId = this._id;
    }
    next();
});
nodeSchema.index({ rootId: 1, _id: 1 });
nodeSchema.index({ parentId: 1, _id: 1 });
nodeSchema.index({ authorId: 1, createdAt: -1 });
exports.NodeSchema = (0, mongoose_1.model)("Node", nodeSchema);
//# sourceMappingURL=node.model.js.map