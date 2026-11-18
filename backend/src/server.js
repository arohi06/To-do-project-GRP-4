
import 'dotenv/config';
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
