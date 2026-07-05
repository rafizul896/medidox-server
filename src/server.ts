import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;

async function startServer() {
  try {
    server = app.listen(config.PORT, () => {
      console.log(`✅ Server running at http://localhost:${config.PORT}`);
    });

    // Handle process signals for graceful shutdown
    process.on("SIGINT", shutdownHandler("SIGINT"));
    process.on("SIGTERM", shutdownHandler("SIGTERM"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      shutdownHandler("uncaughtException")(1);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      console.error("❌ Unhandled Rejection:", reason);
      shutdownHandler("unhandledRejection")(1);
    });
  } catch (error) {
    console.error("❌ Error during server startup:", error);
    process.exit(1);
  }
}

function shutdownHandler(signal: string) {
  return (exitCode = 0) => {
    console.log(`⚠️ Received ${signal}. Closing server...`);
    if (server) {
      server.close(() => {
        console.log("✅ Server closed gracefully.");
        process.exit(exitCode);
      });
    } else {
      process.exit(exitCode);
    }
  };
}

startServer();
