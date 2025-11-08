import App from "./app";
import { port } from "./config";

const appInstance = new App();

// Initialize the app
appInstance.init();

// For local development
// if (process.env.NODE_ENV !== 'production') {
//   appInstance.listen(port);
// }

// For Vercel
export default appInstance.app;
