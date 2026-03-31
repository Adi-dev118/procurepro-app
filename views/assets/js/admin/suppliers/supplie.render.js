import { supplierState } from './supplier.state.js';

function renderSuppliers(suppliers) {
  const tbody = document.getElementById('supplier-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!suppliers.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No suppliers found</td>
      </tr>
    `;
    return;
  }

  suppliers.forEach((s) => {
    const statusBadge =
      s.status === 'approved'
        ? '<span class="status-badge active">Active</span>'
        : s.status === 'pending'
          ? '<span class="status-badge pending">Pending</span>'
          : '<span class="status-badge suspended">Suspended</span>';

    const initials = s.company
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    tbody.innerHTML += `
      <tr>
        <td>#${s.id}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="user-avatar me-1">${initials}</div>
            ${s.company}
          </div>
        </td>
        <td>${s.mobile}</td>
        <td>${s.products}</td>
        <td>${s.avgRating || 0}★</td>

        <td>${s.commission}</td>
        <td>${statusBadge}</td>
        <td>
        <div class="action-buttons">
          <button class="btn-icon view" data-id="${s.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-warning btn-sm">Suspend</button>
          </div>
        </td>
      </tr>
    `;
  });
}

function renderPagination(totalPages) {
  const container = document.getElementById('supplier-pagination');
  container.innerHTML = '';

  let pages = [];

  // Always include first page
  pages.push(1);
  const currentPage = supplierState.page;

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

function updateSupplierCount(currentPage, totalProducts, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalProducts);

  let label = 'products';
  let container = null;
    container = document.querySelector('.pagination-info');

  if (!container) return; // safety

  const text = `Showing ${start} to ${end} of ${totalProducts} ${label}`;
  container.textContent = text;
}


export { renderSuppliers, renderPagination, updateSupplierCount};
