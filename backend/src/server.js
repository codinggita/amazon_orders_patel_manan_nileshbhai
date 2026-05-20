import app from "./app.js";
import env from "./config/env.js";
import connectDB, { disconnectDB } from "./config/db.js";

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(
        `Server running in ${env.nodeEnv} mode on port ${env.port}`
      );
      console.log(`API base URL: http://localhost:${env.port}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown("uncaughtException");
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer();
