import { orderState } from "./order.state.js";

function renderOrders(orders) {
  const tbody = document.getElementById('order-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!orders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">No orders found</td>
      </tr>
    `;
    return;
  }

  orders.forEach((order) => {
    // 🔹 Status Badge
    let statusBadge = '';
    if (order.status === 'processing') {
      statusBadge = `<span class="badge bg-primary">Processing</span>`;
    } else if (order.status === 'pending') {
      statusBadge = `<span class="badge bg-warning">Pending</span>`;
    } else if (order.status === 'delivered') {
      statusBadge = `<span class="badge bg-success">Delivered</span>`;
    } else {
      statusBadge = `<span class="badge bg-danger">Cancelled</span>`;
    }

    // 🔹 Payment Badge
    let paymentBadge = '';
    if (order.payment_status === 'paid') {
      paymentBadge = `<span class="badge bg-success">Paid</span>`;
    } else {
      paymentBadge = `<span class="badge bg-warning">Pending</span>`;
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <strong>#ORD-${order.id}</strong>
          <div class="text-muted small"> <a 
  href="/admin/order-detail/${order.id}" 
  class="btn-icon view" 
  title="View"
> Details
</a></div>
        </td>
        <td>${order.orderType}</td>
        <td>
          <div>
            <strong>${order.customer}</strong>
            <div class="text-muted small">${order.email}</div>
          </div>
        </td>

        <td>
          ${order.date}
          <div class="text-muted small">${order.time || ''}</div>
        </td>

        <td>${order.items || 5}</td>

        <td>$${order.total}</td>

        <td>${statusBadge}</td>

        <td>${paymentBadge}</td>

        <td>
          <div class="action-buttons">
            <button class="btn-icon view" data-id="${order.id}" title="View">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon edit" data-id="${order.id}" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary">
              Invoice
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
  const currentPage = orderState.page;

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

function updateProductCount(currentPage, totalOrders, limit = 5) {
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalOrders);

  let label = 'orders';
  let container = null;
  container = document.querySelector('.pagination-info');

  if (!container) return; // safety

  const text = `Showing ${start} to ${end} of ${totalOrders} ${label}`;
  container.textContent = text;
}

export {renderOrders, renderPagination, updateProductCount};