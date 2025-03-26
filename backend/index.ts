import express from 'express';
import scrapeRoutes from './src/routes/scrapeRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.use('/api', scrapeRoutes);

// Main route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Amazon Scraping API is working!',
    endpoints: {
      scrape: '/api/scrape?keyword=your_keyword'
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app; 