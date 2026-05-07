import {
  renderProducts,
  getInitials,
  renderProductPagination,
  updateProductCount,
} from './product.render.js';

import { productState } from './product.state.js';

export async function fetchProducts() {
  const query = new URLSearchParams({
    page: productState.page,
    search: productState.search,
    category: productState.category,
    status: productState.status,
  });

  const res = await fetch(`/company/api/v1/product/products-data?${query}`);
  const data = await res.json();

  renderProducts(data.products);
  renderProductPagination(data.totalPages);
  updateProductCount(productState.page, data.total);
}
