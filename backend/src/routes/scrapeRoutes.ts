import { Router } from 'express';
import { scrapeAmazon } from '../controllers/scrapeController';

const router = Router();

// Endpoint for Amazon scraping
router.get('/scrape', scrapeAmazon);

export default router; 