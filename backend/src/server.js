
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { buildApp } from './app.js';

const start = async () => {
  const app = await buildApp();

  try {
    const port = Number(process.env.PORT) || 5000;

    await app.listen({
      port,
      host: '0.0.0.0'
    });

    console.log(`Server running on port ${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
