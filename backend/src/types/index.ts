export interface AmazonProduct {
  title: string;
  rating: string;
  reviewCount: string;
  imageUrl: string;
}

export interface ScrapeResponse {
  keyword: string;
  products: AmazonProduct[];
} 