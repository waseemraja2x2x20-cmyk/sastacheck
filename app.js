const products = [
  {
    name: 'Everyday Wireless Headphones',
    brand: 'Soundcore',
    category: 'Audio',
    image: '🎧',
    background: '#eceee6',
    offers: [['Soundcore', 49.99], ['TechTown', 54.50], ['ShopHub', 59.00]],
    previousPrice: 69.99
  },
  {
    name: 'Compact Pour-Over Coffee Maker',
    brand: 'Brew & Co.',
    category: 'Home',
    image: '☕',
    background: '#f2ede4',
    offers: [['HomeKind', 28.00], ['ShopHub', 31.49], ['Daily Goods', 34.00]],
    previousPrice: 39.00
  },
  {
    name: 'Smartwatch Active 2',
    brand: 'Fitbit',
    category: 'Tech',
    image: '⌚',
    background: '#e8edeb',
    offers: [['TechTown', 129.95], ['ShopHub', 139.00], ['Gadget Lane', 149.99]],
    previousPrice: 159.95
  },
  {
    name: 'Soft Glow Table Lamp',
    brand: 'Hearthside',
    category: 'Home',
    image: '💡',
    background: '#f1eee5',
    offers: [['HomeKind', 42.00], ['Daily Goods', 45.99], ['ShopHub', 49.00]],
    previousPrice: 58.00
  },
  {
    name: 'Calm Day Essential Oil Set',
    brand: 'Good Ritual',
    category: 'Wellness',
    image: '🌿',
    background: '#e9eee6',
    offers: [['Good Ritual', 24.50], ['HomeKind', 27.00], ['ShopHub', 29.99]],
    previousPrice: 32.00
  },
  {
    name: 'Portable Bluetooth Speaker',
    brand: 'JBL',
    category: 'Audio',
    image: '🔊',
    background: '#eee9e6',
    offers: [['Gadget Lane', 59.00], ['TechTown', 64.99], ['ShopHub', 69.95]],
    previousPrice: 79.00
  }
];

const productGrid = document.querySelector('#product-grid');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');
const resultsCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const categoryButtons = [...document.querySelectorAll('.category-chip')];
let activeCategory = 'all';

const lowestPrice = (product) => Math.min(...product.offers.map(([, price]) => price));

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products
    .filter((product) => activeCategory === 'all' || product.category === activeCategory)
    .filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query))
    .sort((first, second) => {
      if (sortSelect.value === 'price') return lowestPrice(first) - lowestPrice(second);
      if (sortSelect.value === 'savings') {
        return (second.previousPrice - lowestPrice(second)) - (first.previousPrice - lowestPrice(first));
      }
      if (sortSelect.value === 'name') return first.name.localeCompare(second.name);
      return products.indexOf(first) - products.indexOf(second);
    });

  resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'find' : 'finds'} worth a look`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
  productGrid.innerHTML = visibleProducts.map((product) => {
    const offers = [...product.offers].sort((first, second) => first[1] - second[1]);
    const bestPrice = offers[0][1];
    const discount = Math.round((1 - bestPrice / product.previousPrice) * 100);

    return `
      <article class="product-card">
        <div class="product-art" style="--product-background: ${product.background}">
          <span class="deal-badge">Save ${discount}%</span>
          <span class="product-emoji" role="img" aria-label="${product.name}">${product.image}</span>
        </div>
        <div class="product-details">
          <p class="product-category">${product.category}</p>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-brand">by ${product.brand}</p>
          <div class="best-deal">
            <div>
              <span class="best-label">Best price</span>
              <strong class="best-price">${money.format(bestPrice)}</strong>
              <span class="old-price">${money.format(product.previousPrice)}</span>
            </div>
            <span class="saving-label">Save ${money.format(product.previousPrice - bestPrice)}</span>
          </div>
          <div class="seller-list" aria-label="Compare prices from ${offers.length} stores">
            ${offers.map(([store, price]) => `
              <div class="seller-row">
                <span class="seller-name"><span class="seller-logo" aria-hidden="true">${store.charAt(0)}</span>${store}</span>
                <span class="seller-price">${money.format(price)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

document.querySelector('.search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  renderProducts();
  document.querySelector('#deals').scrollIntoView({ behavior: 'smooth' });
});

searchInput.addEventListener('input', renderProducts);
sortSelect.addEventListener('change', renderProducts);

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((categoryButton) => {
      const isActive = categoryButton === button;
      categoryButton.classList.toggle('active', isActive);
      categoryButton.setAttribute('aria-pressed', String(isActive));
    });
    renderProducts();
  });
});

document.querySelector('#clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  activeCategory = 'all';
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === 'all';
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  renderProducts();
});

renderProducts();
