import { productState } from './product.state.js';
import { renderProducts, renderPagination, updateProductCount, renderCategoryFilters } from './product.render.js';

export async function fetchProducts() {
  try {
    // 🔹 Build query params from state
    const query = new URLSearchParams({
      page: productState.page,
      search: productState.search,
      status: productState.status,
      stock: productState.stock,
      category: productState.category,
    });

    // 🔹 API call
    const res = await fetch(`/admin/product/product-data?${query}`);
    const data = await res.json();

    // 🔴 Safety check
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    // 🔹 Sync state (important for pagination)
    productState.page = data.currentPage;

    // 🔹 Render UI
    renderProducts(data.products);
    renderPagination(data.totalPages);
    updateProductCount(data.currentPage, data.total);
    renderCategoryFilters(data.categories)

  } catch (error) {
    console.error('Fetch Products Error:', error);

    // Optional UI fallback
    const tbody = document.getElementById('product-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-danger">
            Failed to load products
          </td>
        </tr>
      `;
    }
  }
}