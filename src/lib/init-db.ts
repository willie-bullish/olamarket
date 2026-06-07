import { initializeTable } from './store';

// Initialize database tables on server startup
initializeTable().catch((error: unknown) => {
  console.error('Failed to initialize database tables on startup:', error);
});
