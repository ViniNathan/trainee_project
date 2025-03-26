import axios, { AxiosRequestConfig } from 'axios';
import { JSDOM } from 'jsdom';
import { AmazonProduct } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// List of User Agents for rotation
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
];

// Function to get a random User Agent
const getRandomUserAgent = (): string => {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex] || userAgents[0];
};

// Interface for proxy
interface ProxyConfig {
  host: string;
  port: number;
}

export async function scrapeAmazonProducts(keyword: string, retryCount = 0): Promise<AmazonProduct[]> {
  try {
    // Configuration to simulate a real browser with random User Agent
    const userAgent = getRandomUserAgent();
    const headers = {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'Upgrade-Insecure-Requests': '1',
    };

    // Amazon search URL
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    
    console.log(`Starting scraping for URL: ${url} (Attempt ${retryCount + 1})`);
    console.log(`User Agent: ${userAgent.substring(0, 50)}...`);
    
    // Request configuration
    const axiosConfig: AxiosRequestConfig = { 
      headers,
      timeout: 15000,  // 15 seconds timeout
      maxRedirects: 5,
      withCredentials: true
    };

    // Add proxy if configured in environment (optional)
    const proxyString = process.env.HTTP_PROXY;
    if (proxyString) {
      console.log(`Using proxy: ${proxyString}`);
      const host = proxyString.split(':')[0];
      const portStr = proxyString.split(':')[1] || '80';
      const port = parseInt(portStr, 10);
      
      if (host) {
        axiosConfig.proxy = {
          host,
          port
        };
      }
    }
    
    const response = await axios.get(url, axiosConfig);
    
    if (response.status !== 200) {
      throw new Error(`Response with status ${response.status}: ${response.statusText}`);
    }
    
    console.log('Response received, parsing HTML...');
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Find all products on the page
    const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');
    console.log(`Found ${productElements.length} product elements`);
    
    const products: AmazonProduct[] = [];
    
    productElements.forEach((productElement, index) => {
      try {
        // Extract product title - using more specific selectors
        let titleElement = productElement.querySelector('.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style a h2 span');
        
        // Try alternative selector if the first one doesn't work
        if (!titleElement) {
          titleElement = productElement.querySelector('h2 a span');
        }
        
        // Last resort - try the original selector
        if (!titleElement) {
          titleElement = productElement.querySelector('h2 a');
        }
        
        console.log('Title element found:', titleElement ? 'Yes' : 'No');
        const title = titleElement?.textContent?.trim() || 'Title not available';
        
        // Extract rating (stars)
        const ratingElement = productElement.querySelector('.a-icon-star-small .a-icon-alt');
        const rating = ratingElement?.textContent?.trim().split(' ')[0] || 'No rating';
        
        // Extract number of reviews
        const reviewCountElement = productElement.querySelector('.a-size-base.s-underline-text');
        const reviewCount = reviewCountElement?.textContent?.trim() || '0';
        
        // Extract image URL
        const imageElement = productElement.querySelector('img.s-image');
        const imageUrl = imageElement?.getAttribute('src') || '';
        
        products.push({
          title,
          rating,
          reviewCount,
          imageUrl
        });
        
        console.log(`Product ${index + 1} processed: ${title.substring(0, 30)}...`);
      } catch (error) {
        console.error(`Error processing product ${index + 1}:`, error);
      }
    });
    
    console.log(`Scraping completed successfully. Total products: ${products.length}`);
    return products;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error;
      
      // Try again if it's a 503 error (Service Unavailable) up to 3 times
      if (axiosError.response?.status === 503 && retryCount < 3) {
        console.log(`Error 503 detected. Attempt ${retryCount + 1}/3. Waiting before trying again...`);
        
        // Wait progressively longer between attempts
        const waitTime = (retryCount + 1) * 3000;
        await sleep(waitTime);
        
        console.log(`Trying again after ${waitTime}ms...`);
        return scrapeAmazonProducts(keyword, retryCount + 1);
      }
      
      if (axiosError.code === 'ECONNABORTED') {
        console.error('Timeout while trying to access Amazon:', axiosError);
        throw new Error('Timeout while trying to access Amazon. Try again later.');
      } else if (axiosError.code === 'ECONNREFUSED') {
        console.error('Connection refused by Amazon:', axiosError);
        throw new Error('Connection refused by Amazon. Possible IP block.');
      } else if (axiosError.response) {
        console.error(`HTTP Error ${axiosError.response.status} when accessing Amazon:`, axiosError.response.data);
        throw new Error(`HTTP Error ${axiosError.response.status} when accessing Amazon`);
      } else {
        console.error('Error in request to Amazon:', axiosError.message);
        throw new Error(`Error in request to Amazon: ${axiosError.message}`);
      }
    } else {
      console.error('Error performing Amazon scraping:', error);
      throw new Error(`Failed to perform Amazon scraping: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 