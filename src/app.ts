import express, { Application } from "express";
import { createServer, Server } from "http";
import path from "path";
import fs from "fs";
import DB from "./db/databse";
import cors from "cors";

class App {
  public app: Application;
  public static server: Server;

  constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: "https://num-tree-frontend.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    DB.connect();

    // Basic routes
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

    this.app.get("/", (req, res) => {
      res.json("it's working....");
    });
  }

  public listen(serverPort: number) {
    const options = {};
    App.server = createServer(options, this.app);
    App.server.listen(serverPort, (): void => {
      const middlewares = fs.readdirSync(path.join(__dirname, "/middlewares"));
      this.middleware(middlewares, "top.");
      this.init();
      this.middleware(middlewares, "bottom.");
      console.log(`Listening on ${serverPort}...`);
    });
  }

  public async init() {
    await this.routes();
  }

  private middleware(middlewares: any[], str: "bottom." | "top.") {
    middlewares.forEach((middleware) => {
      if (middleware.includes(str)) {
        import(path.join(__dirname + "/middlewares/" + middleware)).then(
          (middleReader) => {
            new middleReader.default(this.app);
          }
        );
      }
    });
  }

  private async routes() {
    try {
      // Import routes directly instead of using fs
      const authRoutes = (await import("./routes/auth.routes")).default;
      const nodeRoutes = (await import("./routes/node.routes")).default;

      // Initialize routes
      const auth = new authRoutes();
      const node = new nodeRoutes();

      // Mount routes
      this.app.use(`/api/v1/${auth.path}`, auth.router);
      this.app.use(`/api/v1/${node.path}`, node.router);

      console.log("Routes initialized successfully");
    } catch (error) {
      console.error("Error initializing routes:", error);
    }
  }
}

export default App;
