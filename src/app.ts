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
    this.init();
    this.app.use(
      cors({
        origin: "https://num-tree-frontend.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Your other routes and middleware
    this.app.get("/healthcheck", (req, res) => {
      res.json({ status: "ok", message: "Healthcheck passed" });
    });

    this.app.get("/", (req, res) => {
      res.json("it's working....");
    });
    DB.connect();
  }

  private async init() {
    await this.routes();
  }

  public listen(serverPort: number) {
    const options = {};
    App.server = createServer(options, this.app);
    App.server.listen(serverPort, (): void => {
      const middlewares = fs.readdirSync(path.join(__dirname, "/middlewares"));
      this.middleware(middlewares, "top.");
      this.routes();
      this.middleware(middlewares, "bottom.");
      console.log(`Listening on ${serverPort}...`);
    });
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
    const subRoutes = fs.readdirSync(path.join(__dirname, "/routes"));
    for (const file of subRoutes) {
      if (file.includes(".routes.")) {
        const routeModule = await import(
          path.join(__dirname, "/routes/", file)
        );
        const routeInstance = new routeModule.default();
        const rootPath = `/api/v1/${routeInstance.path}`;
        this.app.use(rootPath, routeInstance.router);
      }
    }
  }
}

export default App;
