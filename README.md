# Amazon Scraper Project

A full-stack application for scraping Amazon search results with a modern web interface.

## Project Overview

This project consists of a backend API that scrapes Amazon search results and a frontend application that provides a user-friendly interface to search for products and display the results.

## Technology Stack

### Backend
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Express](https://expressjs.com) - Web framework for Node.js
- [Axios](https://axios-http.com) - Promise-based HTTP client
- [JSDOM](https://github.com/jsdom/jsdom) - JavaScript implementation of web standards for parsing HTML

### Frontend
- [Vite](https://vitejs.dev) - Modern build tool and development server
- JavaScript/HTML/CSS - Core web technologies

## Requirements

- Node.js 14+ or Bun runtime
- Internet connection

## Installation

```bash
# Install backend dependencies
cd backend

npm install
# or
bun install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Backend

```bash
cd backend

# Start the server
bun start

# Start in development mode (with hot reload)
bun run dev
```

The backend server will run on http://localhost:3000 by default.

### Frontend

```bash
cd frontend

# Start development server
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun run preview
```

The frontend development server will run on http://localhost:5173 by default.

## API Endpoints

- **GET /api/scrape**
  - Query params:
    - `keyword`: Keyword to search on Amazon
  - Returns:
    - JSON with found products, including title, rating, review count, and image URL

## Example Usage

API request:
```
GET http://localhost:3000/api/scrape?keyword=smartphone
```

Example response:
```json
{
  "keyword": "smartphone",
  "products": [
    {
      "title": "Smartphone XYZ 128GB",
      "rating": "4.5",
      "reviewCount": "1252",
      "imageUrl": "https://www.amazon.com.br/images/product.jpg"
    },
    // ... more products
  ]
}
```

## Features

- Real-time scraping of Amazon search results
- Responsive web interface for displaying products
- Quick and efficient data extraction
- Support for various product attributes
