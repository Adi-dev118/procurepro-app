import { productState } from './product.state.js';
import { renderProducts, renderPagination, updateCount } from './product.render.js';

async function fetchProductsBase(status) {
  const query = new URLSearchParams({
    page: productState.page,
    search: productState.search,
    status: status || productState.status
  });

  const res = await fetch(`/vendor/products-data?${query}`);
  const data = await res.json();

  productState.page = data.currentPage;

  renderProducts(data.products);
  renderPagination(data.totalPages);
  updateCount(data.currentPage, data.total);
}

export function fetchAllProducts() {
  return fetchProductsBase('');
}

export function fetchActiveProducts() {
  return fetchProductsBase('active');
}

export function fetchInactiveProducts() {
  return fetchProductsBase('inactive');
}

export function fetchLowStockProducts() {
  return fetchProductsBase('low_stock');
}

export function fetchOutOfStockProducts() {
  return fetchProductsBase('out_of_stock');
}