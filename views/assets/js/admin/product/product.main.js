import { productState } from './product.state.js';
import { fetchProducts } from './product.api.js';

// 🔹 STATUS FILTER
function setStatusFilter(status) {
  if(status === 'active') 
    {status = 'approved'}
  if (productState.status === status) {
    productState.status = ''; // toggle off
  } else {
    productState.status = status;
  }
  
  productState.page = 1;
  fetchProducts();
}

// 🔹 STOCK FILTER
function setStockFilter(stock) {

  if (productState.stock === stock) {
    productState.stock = '';
  } else {
    productState.stock = stock;
  }
  console.log(stock)

  productState.page = 1;
  fetchProducts();
}

// 🔹 CATEGORY FILTER
function setCategoryFilter(category) {
  if (productState.category === category) {
    productState.category = '';
  } else {
    productState.category = category;
  }

  productState.page = 1;
  fetchProducts();
}

// 🔹 CLEAR FILTERS
function clearFilters() {
  productState.status = '';
  productState.stock = '';
  productState.category = '';
  productState.search = '';
  productState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  fetchProducts();
}

// 🔹 INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});

// 🔹 PAGINATION
document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn) {
    e.preventDefault();
    const page = Number(pageBtn.dataset.page);

    if (!page) return;

    productState.page = page;
    fetchProducts();
  }
});

// 🔹 SEARCH
document.querySelector('.search-btn')?.addEventListener('click', () => {
  const input = document.querySelector('input[name="search"]');

  productState.search = input.value;
  productState.page = 1;

  fetchProducts();
});

// 🔹 STATUS FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.status-filter');

  if (btn) {
    e.preventDefault();
    const status = btn.dataset.status;
    setStatusFilter(status);
  }
});

// 🔹 STOCK FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.stock-filter');

  if (btn) {
    e.preventDefault();
    const stock = btn.dataset.stock;
    setStockFilter(stock);
  }
});

// 🔹 CATEGORY FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.category-filter');

  if (btn) {
    e.preventDefault();
    const category = btn.dataset.category;
    setCategoryFilter(category);
  }
});

// 🔹 CLEAR FILTER BUTTON
document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});
