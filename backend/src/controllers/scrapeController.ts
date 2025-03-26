import type { Request, Response } from 'express';
import { scrapeAmazonProducts } from '../services/amazonScraper';
import { ScrapeResponse } from '../types';

export async function scrapeAmazon(req: Request, res: Response): Promise<void> {
  try {
    const { keyword } = req.query;
    
    if (!keyword || typeof keyword !== 'string') {
      res.status(400).json({ 
        error: 'Invalid keyword. Please provide a valid "keyword" parameter.' 
      });
      return;
    }
    
    const products = await scrapeAmazonProducts(keyword);
    
    const response: ScrapeResponse = {
      keyword,
      products
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing scraping request:', error);
    res.status(500).json({ 
      error: 'An error occurred while scraping Amazon.' 
    });
  }
} 