// src\server.ts

import app from './app';
import { config, testConnection } from './config';

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(config.port, () => {
      console.log(` Server running on port ${config.port} in ${config.env} mode`);
      console.log(` API available at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
