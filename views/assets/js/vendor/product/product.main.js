import { productState } from './product.state.js';
import {
  fetchAllProducts,
  fetchActiveProducts,
  fetchInactiveProducts,
  fetchLowStockProducts,
  fetchOutOfStockProducts,
} from './product.api.js';
function loadProducts() {
  fetchAllProducts();
}

document.addEventListener('DOMContentLoaded', loadProducts);
document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
  tab.addEventListener('shown.bs.tab', (e) => {
    const id = e.target.id;

    // RESET BOTH
    productState.status = '';
    productState.stock = '';

    if (id === 'active-tab') {
      productState.status = 'active'; // 🔥 verification
    } else if (id === 'inactive-tab') {
      productState.status = 'inactive'; // 🔥 verification
    } else if (id === 'low-stock-tab') {
      productState.stock = 'low_stock'; // 🔥 stock
    } else if (id === 'out-of-stock-tab') {
      productState.stock = 'out_of_stock'; // 🔥 stock
    }

    productState.page = 1;

    console.log('STATUS:', productState.status);
    console.log('STOCK:', productState.stock);

    loadProducts();
  });
});
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
