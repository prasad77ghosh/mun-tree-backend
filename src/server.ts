import App from "./app";

const appInstance = new App();

// Export the Express app instance directly
export default appInstance.app;

// import App from "./app";
// import { port } from "./config";
// const app = new App();

// app.listen(port);
