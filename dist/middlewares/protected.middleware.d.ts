import { NextFunction, Response } from "express";
import { JwtService } from "../utils/jwt.service";
import { AuthRequest } from "../types/auth";
export default class ProtectedMiddleware extends JwtService {
    protected: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=protected.middleware.d.ts.map