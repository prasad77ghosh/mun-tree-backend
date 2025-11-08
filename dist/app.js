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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const databse_1 = __importDefault(require("./db/databse"));
const cors_1 = __importDefault(require("cors"));
class App {
    app;
    static server;
    constructor() {
        this.app = (0, express_1.default)();
        this.init();
        this.app.use((0, cors_1.default)({
            origin: "https://num-tree-frontend.vercel.app",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }));
        // Your other routes and middleware
        this.app.get("/healthcheck", (req, res) => {
            res.json({ status: "ok", message: "Healthcheck passed" });
        });
        this.app.get("/", (req, res) => {
            res.json("it's working....");
        });
        databse_1.default.connect();
    }
    async init() {
        await this.routes();
    }
    listen(serverPort) {
        const options = {};
        App.server = (0, http_1.createServer)(options, this.app);
        App.server.listen(serverPort, () => {
            const middlewares = fs_1.default.readdirSync(path_1.default.join(__dirname, "/middlewares"));
            this.middleware(middlewares, "top.");
            this.routes();
            this.middleware(middlewares, "bottom.");
            console.log(`Listening on ${serverPort}...`);
        });
    }
    middleware(middlewares, str) {
        middlewares.forEach((middleware) => {
            if (middleware.includes(str)) {
                Promise.resolve(`${path_1.default.join(__dirname + "/middlewares/" + middleware)}`).then(s => __importStar(require(s))).then((middleReader) => {
                    new middleReader.default(this.app);
                });
            }
        });
    }
    async routes() {
        const subRoutes = fs_1.default.readdirSync(path_1.default.join(__dirname, "/routes"));
        for (const file of subRoutes) {
            if (file.includes(".routes.")) {
                const routeModule = await Promise.resolve(`${path_1.default.join(__dirname, "/routes/", file)}`).then(s => __importStar(require(s)));
                const routeInstance = new routeModule.default();
                const rootPath = `/api/v1/${routeInstance.path}`;
                this.app.use(rootPath, routeInstance.router);
            }
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map