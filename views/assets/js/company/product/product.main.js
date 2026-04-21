import { productState } from './product.state.js';
import { fetchProducts } from './product.api.js';

// 🔹 Pagination
function changePage(page) {
  if (page < 1) return;

  productState.page = page;
  fetchProducts();
}

// 🔹 Search
function performSearch(query) {
  productState.search = query;
  productState.page = 1;
  fetchProducts();
}

function resetSearch() {
  productState.search = '';

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  fetchProducts();
}

// 🔹 Category Filter
function setCategoryFilter(category) {
  if (productState.category === category) {
    productState.category = '';
  } else {
    productState.category = category;
  }

  productState.page = 1;
  fetchProducts();
}

// 🔹 Stock Filter
function setStockFilter(status) {
  if (productState.status === status) {
    productState.status = '';
  } else {
    productState.status = status; // in-stock / out-of-stock
  }

  productState.page = 1;
  fetchProducts();
}

// 🔹 Sort
function setSort(sortType) {
  productState.sort = sortType;
  productState.page = 1;
  fetchProducts();
}

// 🔹 Clear Filters
function clearFilters() {
  productState.search = '';
  productState.category = '';
  productState.status = '';
  productState.sort = 'popularity';
  productState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  fetchProducts();
}

// 🔹 Pagination Click
document.getElementById('pagination').addEventListener('click', (e) => {
  const btn = e.target.closest('.pg-btn');
  if (!btn || btn.classList.contains('disabled')) return;

  const page = Number(btn.dataset.page);
  changePage(page);
});

// 🔹 Search Enter
document.querySelectorAll('input[name="search"]').forEach((input) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(input.value.trim());
    }
  });
});

// 🔹 Search Button
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.search-btn');

  if (btn) {
    const input = btn.closest('.input-group').querySelector('input[name="search"]');

    performSearch(input.value.trim());
  }
});

// 🔹 Category Filter
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-category]');

  if (btn) {
    e.preventDefault();
    setCategoryFilter(btn.dataset.category);
  }
});

// 🔹 Stock Filter
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-stock]');

  if (btn) {
    e.preventDefault();
    setStockFilter(btn.dataset.stock);
  }
});

// 🔹 Sort Dropdown
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-sort]');

  if (btn) {
    e.preventDefault();
    setSort(btn.dataset.sort);
  }
});

// 🔹 Clear Filters
document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});

// 🔹 Initial Load
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});
