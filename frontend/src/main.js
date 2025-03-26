import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Amazon Product Finder</h1>
    <div class="search-container">
      <input type="text" id="keyword" placeholder="Enter a keyword to search for" />
      <button id="search-btn">Search</button>
    </div>
    <div id="loading" class="loading hidden">
      <div class="spinner"></div>
      <p>Looking for products...</p>
    </div>
    <div id="results" class="results-container"></div>
  </div>
`

const searchButton = document.querySelector('#search-btn');
const keywordInput = document.querySelector('#keyword');
const resultsContainer = document.querySelector('#results');
const loadingElement = document.querySelector('#loading');

searchButton.addEventListener('click', searchProducts);
keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchProducts();
  }
});

async function searchProducts() {
  const keyword = keywordInput.value.trim();
  
  if (!keyword) {
    alert('Please enter a keyword to search for');
    return;
  }
  
  // Show loading indicator
  loadingElement.classList.remove('hidden');
  resultsContainer.innerHTML = '';
  
  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    
    if (data.error) {
      resultsContainer.innerHTML = `<div class="error-message">${data.error}</div>`;
      return;
    }
    
    displayResults(data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    resultsContainer.innerHTML = `
      <div class="error-message">
        An error occurred when searching for products. Check that the backend server is running.
      </div>
    `;
  } finally {
    // Hide loading indicator
    loadingElement.classList.add('hidden');
  }
}

function displayResults(data) {
  if (!data.products || data.products.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        No products found for "${data.keyword}".
      </div>
    `;
    return;
  }
  
  let resultsHTML = `
    <h2>Results for "${data.keyword}"</h2>
    <div class="products-list">
  `;
  
  data.products.forEach(product => {
    resultsHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.imageUrl}" alt="${product.title}" />
        </div>
        <div class="product-info">
          <h3>${product.title}</h3>
          <div class="product-details">
            <div class="product-rating">
              <span class="stars">${displayStars(product.rating)}</span>
              <span class="rating-text">${product.rating} (${product.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  resultsHTML += `</div>`;
  resultsContainer.innerHTML = resultsHTML;
}

function displayStars(rating) {
  const numRating = parseFloat(rating) || 0;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating - fullStars >= 0.5;
  
  let starsHTML = '';
  
  // Full star
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '★';
  }
  
  // Half star
  if (hasHalfStar) {
    starsHTML += '✬';
  }
  
  // Empty star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '☆';
  }
  
  return starsHTML;
}
