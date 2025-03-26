import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running with Bun!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;