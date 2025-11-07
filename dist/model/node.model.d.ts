import { Document, Types } from "mongoose";
export interface INode extends Document {
    rootId: Types.ObjectId;
    parentId: Types.ObjectId | null;
    authorId: Types.ObjectId;
    leftValue: number;
    operation: "+" | "-" | "*" | "/" | null;
    rightValue: number | null;
    result: number;
    createdAt: Date;
    status: "confirmed" | "pending" | "rejected";
}
export declare const NodeSchema: import("mongoose").Model<INode, {}, {}, {}, Document<unknown, {}, INode, {}, {}> & INode & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=node.model.d.ts.map