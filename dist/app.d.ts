import { Application } from "express";
import { Server } from "http";
declare class App {
    app: Application;
    static server: Server;
    constructor();
    private initializeRoutes;
    listen(serverPort: number): void;
}
export default App;
//# sourceMappingURL=app.d.ts.map