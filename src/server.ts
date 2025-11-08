import App from "./app";
import { port } from "./config";

const appInstance = new App();

// Initialize routes and middlewares before export
// (async () => {
//   try {
//     await appInstance.init();
//     console.log("✅ App initialized successfully for Vercel deployment");
//   } catch (error) {
//     console.error("❌ App initialization failed:", error);
//   }
// })();

// appInstance.listen(port)

// 👇 Export the Express app as the default export for Vercel
export default appInstance.app;
