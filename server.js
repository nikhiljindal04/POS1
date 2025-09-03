import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import logger from "./src/utils/logger.js";
import { config } from "./src/config/environment.js";


const server = http.createServer(app);
server.listen(config.PORT, () => {
  logger.info(`🚀 Restaurant POS API running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

