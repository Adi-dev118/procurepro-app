import { productState } from './product.state.js';

function renderProducts(products) {
  const container = document.querySelector('.products-grid');

  container.innerHTML = products
    .map((product) => {
      const isInStock = product.stock > 0;

      return `
      <div class="product-card">
        <div class="product-img">
          <i class="bi ${product.icon || 'bi-box'}"></i>
          <span class="product-img-badge ${isInStock ? '' : 'oos'}">
            ${isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div class="product-body">
          <div class="product-cat">${product.category}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.description}</div>

          <div class="product-meta">
            <span class="product-meta-item">
              <i class="bi bi-geo-alt"></i> ${product.country}
            </span>
            <span class="product-meta-item">
              <i class="bi bi-star-fill" style="color:#f59e0b"></i>
              ${product.rating} (${product.reviews})
            </span>
          </div>

          <div class="product-price-row">
            <span class="product-price">$${product.price}</span>
            <span class="unit">/ unit</span>
          </div>

          <div class="product-moq">
            Min. order: <strong>${product.moq} units</strong>
          </div>

          <div class="product-supplier-row">
            <div class="sup-avatar">
              ${getInitials(product.supplier)}
            </div>
            <div>
              <div class="sup-name">${product.supplier}</div>
              <div class="sup-rating">
                ${product.rating} ★ · ${product.reviews} reviews
              </div>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn-quote">
              <i class="bi bi-send"></i> Request Quote
            </button>
             <button  class="btn-quote direct-order-btn"
  data-id="${product.id}"
  data-name="${product.name}"
  data-price="${product.price}"
  data-bs-toggle="modal"
  data-bs-target="#directOrderModal">
              <i class="bi bi-send"></i> Direct Order
            </button>
            <button class="btn-info-icon">
              <i class="bi bi-info-circle"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
function renderProductPagination(totalPages) {
  const container = document.getElementById('pagination');
  const currentPage = productState.page;

  let pages = [];

  // Always include first
  pages.push(1);

  // Around current
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last
  if (totalPages > 1) pages.push(totalPages);

  pages = [...new Set(pages)].sort((a, b) => a - b);

  let html = '';

  // ⬅️ Prev
  html += `
    <button class="pg-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
      <i class="bi bi-chevron-left"></i>
    </button>
  `;

  let prev = 0;

  pages.forEach((p) => {
    if (p - prev > 1) {
      html += `<span class="pg-dots">...</span>`;
    }

    html += `
      <button class="pg-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">
        ${p}
      </button>
    `;

    prev = p;
  });

  // ➡️ Next
  html += `
    <button class="pg-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
      <i class="bi bi-chevron-right"></i>
    </button>
  `;

  container.innerHTML = html;
}

function updateProductCount(currentPage, totalProducts, limit = 6) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalProducts);
  console.log('limit', limit);

  const container = document.querySelector('.pagination-info');
  if (!container) return;

  container.textContent = `Showing ${start} to ${end} of ${totalProducts} products`;
}

export { renderProducts, getInitials, renderProductPagination, updateProductCount };
