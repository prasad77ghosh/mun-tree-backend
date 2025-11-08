"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const node_helper_1 = require("../helper/node.helper");
const node_model_1 = require("../model/node.model");
class NodeService {
    static async createNode(data) {
        // ✅ If no parentId => create a ROOT node
        if (!data.parentId) {
            if (typeof data.initialValue !== "number")
                throw new Error("Root node requires an initialValue");
            const rootNode = await node_model_1.NodeSchema.create({
                rootId: null,
                parentId: null,
                authorId: new mongoose_1.Types.ObjectId(data.authorId),
                leftValue: null,
                operation: null,
                rightValue: null,
                result: data.initialValue,
                status: "confirmed",
            });
            await rootNode.save();
            return rootNode;
        }
        // ✅ Else, create a CHILD (reply) node
        const parent = await node_model_1.NodeSchema.findById(data.parentId);
        if (!parent)
            throw new Error("Parent node not found");
        const leftValue = parent.result;
        if (!data.operation || typeof data.rightValue !== "number")
            throw new Error("Child node requires operation and rightValue");
        const result = (0, node_helper_1.applyOperation)(leftValue, data.operation, data.rightValue);
        const newNode = await node_model_1.NodeSchema.create({
            rootId: parent.rootId || parent._id,
            parentId: new mongoose_1.Types.ObjectId(data.parentId),
            authorId: new mongoose_1.Types.ObjectId(data.authorId),
            leftValue,
            operation: data.operation,
            rightValue: data.rightValue,
            result,
            status: "confirmed",
        });
        return newNode;
    }
    static async getRoots(cursor, limit = 10) {
        try {
            // Set a reasonable timeout for the aggregation
            const options = { maxTimeMS: 20000 };
            const matchStage = {
                $match: { parentId: null },
            };
            if (cursor) {
                matchStage.$match.createdAt = { $lt: new Date(cursor) };
            }
            // Split the heavy operation into two steps
            // Step 1: Get root nodes with basic info
            const rootNodes = await node_model_1.NodeSchema.find({ parentId: null })
                .sort({ createdAt: -1 })
                .limit(limit + 1)
                .lean()
                .exec();
            if (!rootNodes.length) {
                return {
                    roots: [],
                    pagination: {
                        nextCursor: null,
                        hasNextPage: false,
                        limit,
                    },
                };
            }
            // Step 2: Get additional info for these specific roots
            const rootIds = rootNodes.map(node => node._id);
            const pipeline = [
                {
                    $match: {
                        _id: { $in: rootIds },
                    },
                },
                // Count replies efficiently
                {
                    $lookup: {
                        from: "nodes",
                        let: { rootId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$rootId", "$$rootId"] },
                                },
                            },
                            {
                                $count: "count",
                            },
                        ],
                        as: "replyCountArr",
                    },
                },
                // Fetch author info
                {
                    $lookup: {
                        from: "users",
                        let: { authorId: "$authorId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$authorId"] },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    name: 1,
                                    email: 1,
                                    avatar: 1,
                                },
                            },
                        ],
                        as: "author",
                    },
                },
                {
                    $addFields: {
                        replyCount: {
                            $subtract: [
                                { $ifNull: [{ $arrayElemAt: ["$replyCountArr.count", 0] }, 0] },
                                1,
                            ],
                        },
                        author: { $arrayElemAt: ["$author", 0] },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        leftValue: 1,
                        result: 1,
                        replyCount: 1,
                        createdAt: 1,
                        author: 1,
                        replyCountArr: 0,
                    },
                },
            ];
            const roots = await node_model_1.NodeSchema.aggregate(pipeline);
            const hasNextPage = rootNodes.length > limit;
            const paginatedRoots = hasNextPage ? roots.slice(0, -1) : roots;
            const nextCursor = hasNextPage
                ? paginatedRoots[paginatedRoots.length - 1].createdAt
                : null;
            return {
                roots: paginatedRoots,
                pagination: {
                    nextCursor,
                    hasNextPage,
                    limit,
                },
            };
        }
        catch (error) {
            console.error('Error in getRoots:', error);
            throw error;
        }
    }
    static async getTree(rootId, cursor, limit = 1000) {
        try {
            const queryLimit = Math.min(limit, 2000); // safety cap
            if (!mongoose_1.default.Types.ObjectId.isValid(rootId)) {
                throw new Error("Invalid rootId");
            }
            const query = { rootId: new mongoose_1.default.Types.ObjectId(rootId) };
            // Cursor-based pagination (only newer ObjectIds)
            if (cursor && mongoose_1.default.Types.ObjectId.isValid(cursor)) {
                query._id = { $gt: new mongoose_1.default.Types.ObjectId(cursor) };
            }
            // Execute queries in parallel
            const [nodes, rootNode] = await Promise.all([
                node_model_1.NodeSchema.find(query)
                    .sort({ _id: 1 })
                    .limit(queryLimit)
                    .select("_id parentId rootId operation rightValue result authorId status createdAt")
                    .populate("authorId", "username")
                    .lean()
                    .exec(),
                !cursor ? node_model_1.NodeSchema.findOne({ _id: rootId, parentId: null })
                    .populate("authorId", "username")
                    .select("_id parentId rootId operation rightValue result authorId status createdAt")
                    .lean()
                    .exec() : null
            ]);
            // If empty
            if (!nodes.length) {
                return {
                    message: "No more nodes",
                    rootId,
                    rootNode: null,
                    nodes: [],
                    count: 0,
                    nextCursor: null,
                    hasMore: false,
                };
            }
            // Determine next cursor
            const nextCursor = nodes.length === queryLimit ? nodes[nodes.length - 1]?._id : null;
            return {
                message: "Nodes fetched successfully",
                rootId,
                rootNode,
                nodes,
                count: nodes.length,
                nextCursor,
                hasMore: Boolean(nextCursor),
            };
        }
        catch (error) {
            console.error('Error in getTree:', error);
            throw error;
        }
    }
    static async getRepliesFast(parentId, cursor, limit = 10) {
        if (!mongoose_1.default.Types.ObjectId.isValid(parentId)) {
            throw new Error("Invalid parentId");
        }
        const queryLimit = Math.min(Math.max(limit, 1), 100);
        const query = { parentId: new mongoose_1.default.Types.ObjectId(parentId) };
        if (cursor) {
            if (!mongoose_1.default.Types.ObjectId.isValid(cursor)) {
                throw new Error("Invalid cursor");
            }
            // For descending order, we use $lt (older than cursor)
            query._id = { $lt: new mongoose_1.default.Types.ObjectId(cursor) };
        }
        try {
            const replies = await node_model_1.NodeSchema.find(query)
                .sort({ _id: -1 }) // newest first
                .limit(queryLimit + 1)
                .select("_id parentId rootId operation rightValue result authorId status createdAt")
                .populate("authorId", "name email")
                .lean()
                .exec();
            const hasMore = replies.length > queryLimit;
            const slicedReplies = hasMore
                ? replies.slice(0, queryLimit)
                : replies;
            const nextCursor = hasMore && slicedReplies.length > 0
                ? slicedReplies[slicedReplies.length - 1]._id.toString()
                : null;
            return {
                success: true,
                message: slicedReplies.length > 0
                    ? "Replies fetched successfully"
                    : "No more replies",
                parentId,
                replies: slicedReplies, // ✅ do NOT reverse
                count: slicedReplies.length,
                nextCursor,
                hasMore,
            };
        }
        catch (error) {
            console.error("Error fetching replies:", error);
            throw new Error("Failed to fetch replies");
        }
    }
}
exports.NodeService = NodeService;
//# sourceMappingURL=node.service.js.map