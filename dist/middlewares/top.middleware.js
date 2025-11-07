"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
class TopMiddleWare {
    constructor(app) {
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(this.allowCrossDomain);
        app.use(this.cacheClear);
        app.use((0, cookie_parser_1.default)());
    }
    allowCrossDomain(req, res, next) {
        const allAllowedOrigin = [
            "https://num-tree-frontend.vercel.app",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5173/",
            "http://localhost:3000/",
            "http://localhost:5173/",
            "https://num-tree-frontend.vercel.app/",
        ];
        const origin = req.headers.origin;
        if (allAllowedOrigin.includes(origin)) {
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Credentials", "true");
        }
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization,X-Otp-Token"); //all headers allowed
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"); //all method allowed
            return res.status(200).json({});
        }
        next();
    }
    cacheClear(req, res, next) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");
        next();
    }
}
exports.default = TopMiddleWare;
//# sourceMappingURL=top.middleware.js.map