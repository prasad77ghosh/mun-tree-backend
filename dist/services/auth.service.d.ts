interface RegisterData {
    name: string;
    email: string;
    password: string;
}
interface LoginData {
    email: string;
    password: string;
}
export declare class AuthService {
    static register({ name, email, password }: RegisterData): Promise<{
        name: any;
        email: any;
    }>;
    static login({ email, password }: LoginData): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    static rotateTokens(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    static getProfile(userId: string): Promise<any>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map