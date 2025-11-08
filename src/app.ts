import express, { Application } from "express";
import { createServer, Server } from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import DB from "./db/databse";

// Middlewares
import TopMiddleWare from "./middlewares/top.middleware";
import BottomMiddleware from "./middlewares/bottom.middleware";

// Routes
import AuthRoutes from "./routes/auth.routes";
import NodeRoutes from "./routes/node.routes";

class App {
  public app: Application;
  public static server: Server;

  constructor() {
    this.app = express();

    // --- Security and Parsing Middlewares ---
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());

    // --- CORS Configuration ---
    this.app.use(
      cors({
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
      })
    );

    // --- Custom Top Middleware (CORS + Cache) ---
    new TopMiddleWare(this.app);

    // --- DB Connection ---
    DB.connect();

    // --- Health Check ---
    this.app.get("/healthcheck", async (req, res) => {
      try {
        await DB.connect();
        res.json({ status: "ok", message: "Healthcheck passed" });
      } catch (error) {
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
    new BottomMiddleware(this.app);
  }

  private initializeRoutes() {
    const authRoutes = new AuthRoutes();
    const nodeRoutes = new NodeRoutes();

    this.app.use(`/api/v1/${authRoutes.path}`, authRoutes.router);
    this.app.use(`/api/v1/${nodeRoutes.path}`, nodeRoutes.router);
  }

  public listen(serverPort: number) {
    App.server = createServer(this.app);
    App.server.listen(serverPort, () => {
      console.log(`✅ Server running on port ${serverPort}`);
    });
  }
}

export default App;
