"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const databse_1 = __importDefault(require("./db/databse"));
// Middlewares
const top_middleware_1 = __importDefault(require("./middlewares/top.middleware"));
const bottom_middleware_1 = __importDefault(require("./middlewares/bottom.middleware"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const node_routes_1 = __importDefault(require("./routes/node.routes"));
class App {
    app;
    static server;
    constructor() {
        this.app = (0, express_1.default)();
        // --- Security and Parsing Middlewares ---
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, helmet_1.default)());
        // --- CORS Configuration ---
        this.app.use((0, cors_1.default)({
            origin: [
                "https://num-tree-frontend.vercel.app",
                "http://localhost:3000",
                "http://localhost:5173",
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "X-Otp-Token",
            ],
            credentials: true,
        }));
        // --- Custom Top Middleware (CORS + Cache) ---
        new top_middleware_1.default(this.app);
        // --- DB Connection ---
        databse_1.default.connect();
        // --- Health Check ---
        this.app.get("/healthcheck", async (req, res) => {
            try {
                await databse_1.default.connect();
                res.json({ status: "ok", message: "Healthcheck passed" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: "error", message: "Database connection failed" });
            }
        });
        // --- Root Route ---
        this.app.get("/", (req, res) => {
            res.json({ message: "NumTree backend running successfully 🚀" });
        });
        // --- API Routes ---
        this.initializeRoutes();
        // --- Bottom Middleware (Error handling) ---
        new bottom_middleware_1.default(this.app);
    }
    initializeRoutes() {
        const authRoutes = new auth_routes_1.default();
        const nodeRoutes = new node_routes_1.default();
        this.app.use(`/api/v1/${authRoutes.path}`, authRoutes.router);
        this.app.use(`/api/v1/${nodeRoutes.path}`, nodeRoutes.router);
    }
    listen(serverPort) {
        App.server = (0, http_1.createServer)(this.app);
        App.server.listen(serverPort, () => {
            console.log(`✅ Server running on port ${serverPort}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map