import { productState } from './product.state.js';
import {
  fetchAllProducts,
  fetchActiveProducts,
  fetchInactiveProducts,
  fetchLowStockProducts,
  fetchOutOfStockProducts
} from './product.api.js';

function loadProducts() {
  switch (productState.tab) {
    case 'active': fetchActiveProducts(); break;
    case 'inactive': fetchInactiveProducts(); break;
    case 'low_stock': fetchLowStockProducts(); break;
    case 'out_of_stock': fetchOutOfStockProducts(); break;
    default: fetchAllProducts();
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);

// Tabs
document.getElementById('all-products-tab').onclick = () => {
  productState.tab = '';
  productState.page = 1;
  loadProducts();
};

document.getElementById('active-tab').onclick = () => {
  productState.tab = 'active';
  productState.page = 1;
  loadProducts();
};

document.getElementById('inactive-tab').onclick = () => {
  productState.tab = 'inactive';
  productState.page = 1;
  loadProducts();
};

document.getElementById('low-stock-tab').onclick = () => {
  productState.tab = 'low_stock';
  productState.page = 1;
  loadProducts();
};

document.getElementById('out-of-stock-tab').onclick = () => {
  productState.tab = 'out_of_stock';
  productState.page = 1;
  loadProducts();
};

// Pagination
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-link');
  if (!btn) return;

  e.preventDefault();
  const page = Number(btn.dataset.page);
  if (!page) return;

  productState.page = page;
  loadProducts();
});