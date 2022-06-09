import express from 'express';
import { config } from 'dotenv';

// Parse .env file and write to process.env
config();
const PORT = process.env.PORT;

// run express server
const app = express();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});