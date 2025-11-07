import { AuthRequest } from "../types/auth";
import { NextFunction, Response, Request } from "express";
export declare class NodeController {
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    reply(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getRoots(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTree(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getReplies(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=node.controller.d.ts.map