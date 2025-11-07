import { Application } from "express";
import { Server } from "http";
declare class App {
    app: Application;
    static server: Server;
    constructor();
    listen(serverPort: number): void;
    private middleware;
    private routes;
}
export default App;
//# sourceMappingURL=app.d.ts.map