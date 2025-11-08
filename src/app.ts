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
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: "https://num-tree-frontend.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Basic routes
    this.app.get("/healthcheck", (req, res) => {
      res.json({ status: "ok", message: "Healthcheck passed" });
    });

    this.app.get("/", (req, res) => {
      res.json("it's working....");
    });
    
    // Connect to database
    DB.connect();
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
      const authRoutes = (await import('./routes/auth.routes')).default;
      const nodeRoutes = (await import('./routes/node.routes')).default;

      // Initialize routes
      const auth = new authRoutes();
      const node = new nodeRoutes();

      // Mount routes
      this.app.use(`/api/v1/${auth.path}`, auth.router);
      this.app.use(`/api/v1/${node.path}`, node.router);

      console.log('Routes initialized successfully');
    } catch (error) {
      console.error('Error initializing routes:', error);
    }
  }
}

export default App;
