require("module-alias/register");
const express = require("express");
require("dotenv").config();

const app = express();
const TERMINATION_SIGNALS = ["SIGINT", "SIGTERM"];

(async () => {
  const Boot = require("./boot");
  await Boot.initApp(app);

  const { initRoutes } = require("./src/routes");
  initRoutes(app);

  //function to handle graceful shutdown
  const logger = require("@logger")
  const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal} signal, shutting down gracefully...`);
    await Boot.shutdownApp();
    logger.info("Shutdown complete.");
    process.exit(0);
  };

  TERMINATION_SIGNALS.forEach((signal) => {
    process.on(signal, async () => gracefulShutdown(signal));
  });
})();
