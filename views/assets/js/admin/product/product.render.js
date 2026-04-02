import { productState } from './product.state.js';

function renderProducts(products) {
  const tbody = document.getElementById('product-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!products.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">No products found</td>
      </tr>
    `;
    return;
  }

  products.forEach((product) => {
    // 🔹 Stock Badge Logic
    let stockBadge = '';
    if (Number(product.stock) === 0) {
      stockBadge = `<span class="badge bg-danger">Out of Stock</span>`;
    } else if (Number(product.stock) <= 50) {
      stockBadge = `<span class="badge bg-warning">Low Stock</span>`;
    } else {
      stockBadge = `<span class="badge bg-success">In Stock</span>`;
    }

    // Category Badge Logic
    let categoryBatch = '';
    if (product.category === 'Furniture') {
      categoryBatch = `<span class="badge bg-danger">Furniture</span>`;
    } else if (product.category === 'Electronics') {
      categoryBatch = `<span class="badge bg-primary">Electronics</span>`;
    } else if (product.category === 'Computer Parts') {
      categoryBatch = `<span class="badge bg-secondary">Computer Parts</span>`;
    } else if (product.category === 'Home & Kitchen') {
      categoryBatch = `<span class="badge bg-warning">Home & Kitchen</span>`;
    }else if (product.category === 'Stationery') {
      categoryBatch = `<span class="badge bg-success">Stationery</span>`;
    }

    // 🔹 Status Badge
    const statusBadge =
      product.verification_status === 'approved'
        ? `<span class="status-badge active">Active</span>`
        : product.verification_status === 'suspended'
        ? `<span class="status-badge suspended">Suspended</span>`
        : product.verification_status === 'pending'
        ? `<span class="status-badge pending">Pending</span>`
        : `<span class="status-badge suspended">Rejected</span>`

    tbody.innerHTML += `
      <tr>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" />
          </div>
        </td>

        <td>
          <div class="d-flex align-items-center">
            <div class="product-image me-2"
              style="
                width: 40px;
                height: 40px;
                background-color: #e9ecef;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              <i class="bi ${product.icon} text-muted"></i>
            </div>

            <div>
              <strong>${product.name}</strong>
              <div class="text-muted small">${product.description}</div>
            </div>
          </div>
        </td>

        <td>${product.sku}</td>

        <td>
         ${categoryBatch}
        </td>

        <td>${product.company || 'N/A'}</td>

        <td>$${product.final_price}</td>

        <td>
          ${stockBadge}
          <div class="text-muted small">${product.stock} units</div>
        </td>

        <td>
          ${statusBadge}
        </td>

        <td>
          <div class="action-buttons">
            <button class="btn-icon view" data-id="${product.id}" title="View">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon edit" data-id="${product.id}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" data-id="${product.id}" title="Deactivate">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  let pages = [];

  // Always include first page
  pages.push(1);
  const currentPage = productState.page;

  // Pages around current
  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last page
  if (totalPages > 1) pages.push(totalPages);

  // Remove duplicates & sort
  pages = [...new Set(pages)].sort((a, b) => a - b);

  // Previous button
  container.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage - 1}">Previous</a>
    </li>
  `;

  let prevPage = 0;

  pages.forEach((page) => {
    // Add "..." if gap exists
    if (page - prevPage > 1) {
      container.innerHTML += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }

    container.innerHTML += `
      <li class="page-item ${page === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${page}">${page}</a>
      </li>
    `;

    prevPage = page;
  });

  // Next button
  container.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page = "${currentPage + 1}">Next</a>
    </li>
  `;
}

function updateProductCount(currentPage, totalUsers, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalUsers);

  let label = 'products';
  let container = null;
  container = document.querySelector('.pagination-info');

  if (!container) return; // safety

  const text = `Showing ${start} to ${end} of ${totalUsers} ${label}`;
  container.textContent = text;
}

function renderCategoryFilters(categories) {
  const container = document.getElementById('category-filter');

  if (!container) return;

  let html = `
    <li>
      <a class="dropdown-item category-filter" href="#" data-category="">
        All Categories
      </a>
    </li>
  `;

  categories.forEach((cat) => {
   
    
    html += `
      <li>
        <a 
          class="dropdown-item category-filter" 
          href="#" 
          data-category="${cat.id}">
          ${cat.name}
        </a>
      </li>
    `;
  });

  container.innerHTML = html;
}

export { renderProducts, renderPagination, updateProductCount, renderCategoryFilters };
