import { orderState } from "./order.state.js";

export function renderOrders(orders) {
  const tbody = document.getElementById('orders-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!orders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No orders found</td>
      </tr>
    `;
    return;
  }

  let html = '';

  orders.forEach(order => {
    // Format date
    const date = new Date(order.date);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Status badge
    let statusHTML = '';
    if (order.status === 'pending') {
      statusHTML = `<span class="vendor-status-badge pending">Pending</span>`;
    } else if (order.status === 'processing') {
      statusHTML = `<span class="vendor-status-badge processing">Processing</span>`;
    } else if (order.status === 'shipped') {
      statusHTML = `<span class="vendor-status-badge shipped">Shipped</span>`;
    } else if (order.status === 'delivered') {
      statusHTML = `<span class="vendor-status-badge completed">Completed</span>`;
    }

    // Action buttons
    let actionHTML = `
      <button class="btn btn-outline-secondary btn-sm">
        <i class="bi bi-eye"></i>
      </button>
    `;

    if (order.status === 'pending') {
      actionHTML = `
        <button class="btn btn-primary btn-sm btn-process-order" data-order-id="${order.id}">
          <i class="bi bi-check-circle me-1"></i> Process
        </button>
        ${actionHTML}
      `;
    } else if (order.status === 'processing') {
      actionHTML = `
        <button class="btn btn-info btn-sm" data-order-id="${order.id}">
          <i class="bi bi-truck me-1"></i> Ship
        </button>
        ${actionHTML}
      `;
    }

    html += `
      <tr>
        <td>
          <strong>#ORD-${order.id}</strong>
          <div class="text-muted small">Click to view details</div>
        </td>

        <td>
          <div>${order.name}</div>
          <div class="text-muted small">${order.email}</div>
        </td>

        <td>
          ${formattedDate}<br />
          <span class="text-muted small">${formattedTime}</span>
        </td>

        <td>${order.items} items</td>

        <td>$${order.total}</td>

        <td>${statusHTML}</td>

        <td>
          <div class="vendor-action-buttons">
            ${actionHTML}
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

export function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (!container) return;

  container.innerHTML = '';

  const currentPage = orderState.page;

  let pages = [];

  // Always include first page
  pages.push(1);

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
      <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>
  `;

  let prevPage = 0;

  pages.forEach((page) => {
    // Add "..." gap
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
      <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>
  `;
}

export function updateOrderCount(currentPage, totalOrders, limit = 5) {
  const container = document.querySelector('.pagination-info');
  if (!container) return;

  if (totalOrders === 0) {
    container.textContent = 'No orders found';
    return;
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalOrders);

  container.textContent = `Showing ${start} to ${end} of ${totalOrders} orders`;
}