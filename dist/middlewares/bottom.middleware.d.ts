import { Application, NextFunction, Request, Response } from "express";
declare class BottomMiddleware {
    constructor(app: Application);
    routeNotFoundErrorHandler(req: Request, res: Response, next: NextFunction): void;
    fromRouteErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void;
}
export default BottomMiddleware;
//# sourceMappingURL=bottom.middleware.d.ts.map