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
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)({
            origin: "https://num-tree-frontend.vercel.app",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }));
        // Basic routes
        this.app.get("/healthcheck", (req, res) => {
            res.json({ status: "ok", message: "Healthcheck passed" });
        });
        this.app.get("/", (req, res) => {
            res.json("it's working....");
        });
        // Connect to database
        databse_1.default.connect();
    }
    listen(serverPort) {
        const options = {};
        App.server = (0, http_1.createServer)(options, this.app);
        App.server.listen(serverPort, () => {
            const middlewares = fs_1.default.readdirSync(path_1.default.join(__dirname, "/middlewares"));
            this.middleware(middlewares, "top.");
            this.init();
            this.middleware(middlewares, "bottom.");
            console.log(`Listening on ${serverPort}...`);
        });
    }
    async init() {
        await this.routes();
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
        try {
            // Import routes directly instead of using fs
            const authRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/auth.routes')))).default;
            const nodeRoutes = (await Promise.resolve().then(() => __importStar(require('./routes/node.routes')))).default;
            // Initialize routes
            const auth = new authRoutes();
            const node = new nodeRoutes();
            // Mount routes
            this.app.use(`/api/v1/${auth.path}`, auth.router);
            this.app.use(`/api/v1/${node.path}`, node.router);
            console.log('Routes initialized successfully');
        }
        catch (error) {
            console.error('Error initializing routes:', error);
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map