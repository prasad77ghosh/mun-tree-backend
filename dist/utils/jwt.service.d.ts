import { JwtPayload } from "jsonwebtoken";
export declare class JwtService {
    private accessSecret;
    private refreshSecret;
    private readonly accessExpiry;
    private readonly refreshExpiry;
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyAccessToken(token: string): JwtPayload;
    verifyRefreshToken(token: string): JwtPayload;
}
//# sourceMappingURL=jwt.service.d.ts.map