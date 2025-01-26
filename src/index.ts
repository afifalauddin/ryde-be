import { app, logger } from "./server";
import { env } from "./utils/env";

const server = app.listen(env.PORT, () => {
  logger.info(`Server (${env.NODE_ENV}) listening on port ${env.PORT}`);
});

const onCloseSignal = () => {
  logger.info("sigint: shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  //Force Exit after 5 seconds
  setTimeout(() => process.exit(1), 5000).unref();
};

process.on("SIGINT", onCloseSignal); //Ctrl+C
process.on("SIGTERM", onCloseSignal); //Graceful shutdown
