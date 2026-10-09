import { migrate } from './db.mjs';

migrate()
  .then(() => console.log('PostgreSQL schema applied successfully.'))
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  });
