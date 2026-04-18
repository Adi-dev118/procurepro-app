import { productState } from './product.state.js';

function getContainer() {
  if (productState.status === 'active') {
    return document.getElementById('active-container');
  }
  if (productState.status === 'inactive') {
    return document.getElementById('inactive-container');
  }
  if (productState.stock === 'low_stock') {
    return document.getElementById('low-stock-container');
  }
  if (productState.stock === 'out_of_stock') {
    return document.getElementById('out-of-stock-container');
  }
  return document.getElementById('all-products-container');
}
export function renderProducts(products) {
  const container = getContainer();
  if (!container) return;

  container.innerHTML = '';

  if (!products.length) {
    container.innerHTML = `<p>No products found</p>`;
    return;
  }

  products.forEach((product) => {
    let stockHTML = '';

    if (Number(product.stock) === 0) {
      stockHTML = `<span class="vendor-stock-badge out-of-stock">Out of Stock</span>`;
    } else if (Number(product.stock) <= 50) {
      stockHTML = `<span class="vendor-stock-badge low-stock">Low Stock</span>`;
    } else {
      stockHTML = `<span class="vendor-stock-badge in-stock">In Stock</span>`;
    }

    container.innerHTML += `
      <div class="vendor-product-card">
        <div class="vendor-product-image">
          <i class="bi ${product.icon || 'bi-box'}"></i>
        </div>

        <div class="vendor-product-content">
          <h5 class="vendor-product-title">${product.name}</h5>

          <div class="vendor-product-meta">
            <span>SKU: ${product.sku}</span>
            <span>Category: ${product.category}</span>
          </div>

          <div class="vendor-product-price">$${product.final_price}</div>

          <div class="vendor-product-stock">
            ${stockHTML}
          </div>
        </div>
      </div>
    `;
  });
}
export function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;

  pagination.innerHTML = '';

  const currentPage = productState.page;

  // Previous button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Next button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;
}

export function updateCount(currentPage, totalItems, limit = 4) {
  const info = document.querySelector('.pagination-info');
  if (!info) return;

  if (totalItems === 0) {
    info.innerText = 'No products found';
    return;
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  info.innerText = `Showing ${start} to ${end} of ${totalItems} products`;
}
