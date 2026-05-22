import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ Database connected successfully');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     Amazon E-Commerce API Server       ║
╠════════════════════════════════════════╣
║ ✓ Server started successfully          ║
║ 📍 Environment: ${NODE_ENV.padEnd(22)} ║
║ 🔌 Port: ${String(PORT).padEnd(28)} ║
║ 📅 Started at: ${new Date().toISOString()} ║
╚════════════════════════════════════════╝
      `);
    });

    /**
     * Graceful Shutdown
     */
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
