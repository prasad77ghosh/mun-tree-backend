import App from "./app";

const appInstance = new App();

// Export the Express app instance directly
export default appInstance.app;
