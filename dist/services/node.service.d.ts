import mongoose from "mongoose";
export declare class NodeService {
    static createNode(data: {
        parentId?: string;
        authorId: string;
        operation?: string;
        rightValue?: number;
        initialValue?: number;
    }): Promise<mongoose.Document<unknown, {}, import("../model/node.model").INode, {}, {}> & import("../model/node.model").INode & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    static getRoots(cursor?: string, limit?: number): Promise<{
        roots: any[];
        pagination: {
            nextCursor: any;
            hasNextPage: boolean;
            limit: number;
        };
    }>;
    static getTree(rootId: string, cursor?: string, limit?: number): Promise<{
        message: string;
        rootId: string;
        rootNode: (mongoose.FlattenMaps<import("../model/node.model").INode> & Required<{
            _id: mongoose.FlattenMaps<unknown>;
        }> & {
            __v: number;
        }) | null;
        nodes: any;
        count: any;
        nextCursor: any;
        hasMore: boolean;
    }>;
    static getRepliesFast(parentId: string, cursor?: string, limit?: number): Promise<{
        success: boolean;
        message: string;
        parentId: string;
        replies: any;
        count: any;
        nextCursor: any;
        hasMore: boolean;
    }>;
}
//# sourceMappingURL=node.service.d.ts.map