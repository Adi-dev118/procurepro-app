import { orderState } from './order.state.js';
function renderOrders(orders) {
  const tbody = document.getElementById('orders-table-body');

  function getInitials(name = '') {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }

  function paymentBadge(status) {
    let cls = 'default';

    if (status === 'completed' || status === 'paid') cls = 'paid';
    else if (status === 'pending') cls = 'pending-pay';
    else if (status === 'refunded') cls = 'refunded';

    return `
    <span class="badge ${cls}">
      <span class="dot-indicator"></span>
      ${capitalize(status)}
    </span>
  `;
  }

  function statusBadge(status) {
    let cls = 'default';

    if (status === 'processing') cls = 'processing';
    else if (status === 'delivered') cls = 'delivered';
    else if (status === 'shipped') cls = 'shipped';
    else if (status === 'cancelled') cls = 'cancelled';

    return `
    <span class="badge ${cls}">
      <span class="dot-indicator"></span>
      ${capitalize(status)}
    </span>
  `;
  }
  function capitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ❌ Empty state
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-4 text-muted">
          <i class="bi bi-inbox me-2"></i>
          No orders found
        </td>
      </tr>
    `;
    return;
  }

  // ✅ Render rows
  tbody.innerHTML = orders
    .map((order) => {
      return `
      <tr>
        <td>
          <div class="order-id">
            <strong>#ORD-${order.id}</strong>
          </div>
          <div class="order-from">
            ${order.rfq_id ? `From RFQ #RFQ-${order.rfq_id}` : `Direct Purchase`}
          </div>
        </td>

        <td>
          <div class="sup-cell">
            <div class="sup-ava">
              ${getInitials(order.supplier)}
            </div>
            <div>
              <div style="font-weight:600;font-size:13px">
                ${order.supplier}
              </div>
              <div style="font-size:11px;color:var(--col-text-muted)">
                ${order.rating || '0.0'} ★
              </div>
            </div>
          </div>
        </td>

        <td>${formatDate(order.created_at)}</td>

        <td>${order.items || '-'}</td>

        <td class="amount-cell">
          <strong>$${order.total_amount}</strong>
        </td>

        <td>
          ${statusBadge(order.status)}
        </td>

        <td>
          ${paymentBadge(order.payment_status)}
        </td>

        <td>
          <div class="action-btns">

            <button class="action-btn" title="View">
              <i class="bi bi-eye"></i>
            </button>

            <button class="action-btn" title="Invoice">
              <i class="bi bi-receipt"></i>
            </button>

            ${
              order.status === 'processing' || order.status === 'shipped'
                ? `
                  <button 
                    class="action-btn track-order-btn"
                    data-order-id="${order.id}"
                    title="Track"
                  >
                    <i class="bi bi-truck"></i>
                  </button>
                `
                : ''
            }

            ${
              order.payment_status === 'pending'
                ? `
                  <button class="action-btn" title="Pay">
                    <i class="bi bi-credit-card"></i>
                  </button>
                `
                : ''
            }

          </div>
        </td>
      </tr>
    `;
    })
    .join('');
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  const currentPage = orderState.page;

  if (!totalPages || totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let pages = [];

  // Always include first
  pages.push(1);

  // Pages around current
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Always include last
  if (totalPages > 1) pages.push(totalPages);

  pages = [...new Set(pages)].sort((a, b) => a - b);

  let html = '';

  // ⬅️ Previous
  html += `
  <button class="pag-btn ${currentPage === 1 ? 'disabled' : ''}" 
          data-page="${currentPage - 1}">
    <i class="bi bi-chevron-left"></i>
  </button>
`;

  let prev = 0;

  pages.forEach((p) => {
    if (p - prev > 1) {
      html += `<span class="pg-dots">...</span>`;
    }

    html += `
      <button class="pag-btn ${p === currentPage ? 'active' : ''}" 
              data-page="${p}">
        ${p}
      </button>
    `;

    prev = p;
  });

  // ➡️ Next
  html += `
    <button class="pag-btn ${currentPage === totalPages ? 'disabled' : ''}" 
            data-page="${currentPage + 1}">
      <i class="bi bi-chevron-right"></i>
    </button>
  `;

  container.innerHTML = html;
}

function updateOrderCount(page, totalOrders, limit) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalOrders);

  document.querySelector('.pagination-info').textContent =
    `Showing ${start} to ${end} of ${totalOrders} orders`;
}

export { renderPagination, updateOrderCount, renderOrders };
