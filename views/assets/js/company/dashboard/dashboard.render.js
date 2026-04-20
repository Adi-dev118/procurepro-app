export function renderOrders(orders) {
  const container = document.getElementById('order-feed');
  if (!container) return;

  if (!orders || !orders.length) {
    container.innerHTML = `
      <div class="text-muted">No recent orders</div>
    `;
    return;
  }

  let html = '';

  orders.forEach((order) => {
    const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    html += `
      <div class="activity-item">
        <div class="activity-dot order">
          <i class="bi bi-cart-check"></i>
        </div>

        <div class="activity-body">
          <div class="activity-title">
            Order Placed
          </div>

          <div class="activity-desc">
            Order #ORD-${String(order.id).padStart(4, '0')} for ${order.product_name || 'Items'}
          </div>

          <div class="activity-time">
            ${formattedDate}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

export function renderRFQs(rfqs) {
  const tbody = document.getElementById('rfq-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!rfqs || !rfqs.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted">No RFQs found</td>
      </tr>
    `;
    return;
  }

  let html = '';

  rfqs.forEach((rfq) => {
    // 🔹 Status class
    let statusClass = '';
    if (rfq.status === 'active') statusClass = 'active';
    else if (rfq.status === 'closed') statusClass = 'closed';
    else statusClass = 'awarded';

    // 🔹 Button
    const actionBtn =
      rfq.status === 'awarded'
        ? `<button class="btn-sm-action">View Award</button>`
        : `<button class="btn-sm-action primary">View Bids</button>`;

    // 🔹 Date format
    const formattedDate = new Date(rfq.deadline).toLocaleDateString('en-IN');

    html += `
      <tr>
        <td class="bold" style="font-family: 'DM Mono', monospace; font-size: 12px; color: var(--col-text-muted);">
          #RFQ-${String(rfq.id).padStart(3, '0')}
        </td>

        <td class="bold">${rfq.title}</td>

        <td>
          <span class="badge cat">${rfq.category}</span>
        </td>

        <td>${formattedDate}</td>

        <td style="text-align: center; font-weight: 600">${rfq.bids}</td>

        <td>
          <span class="badge ${statusClass}">
            <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:currentColor;margin-right:5px;opacity:0.8;"></span>
            ${rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
          </span>
        </td>

        <td>
          ${actionBtn}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}
