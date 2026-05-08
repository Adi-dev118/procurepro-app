
export function renderRecentOrders(orders) {
  const tbody = document.getElementById('recent-orders-body');

  tbody.innerHTML = '';

  orders.forEach((order) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    
      <td>
        #ORD-${order.id}
      </td>

      <td>
        ${order.customer}
      </td>

      <td>
        ${order.date}
      </td>

      <td>
        $ ${order.amount}
      </td>

      <td>
        <span class="
          vendor-status-badge

          ${
            order.status === 'pending'
              ? 'pending'
              : order.status === 'delivered'
                ? 'completed'
                : order.status === 'cancelled'
                  ? 'cancelled'
                  : 'shipped'
          }
        ">

          ${order.status}

        </span>
      </td>

    `;

    tbody.appendChild(tr);
  });
}

export function renderStatusAndRating(vendor) {
  const container = document.getElementById('vendor-status');

  let statusBadge = '';

  if (vendor.status === 'approved') {
    statusBadge = `
      <span class="vendor-status-badge active me-2">
        Verified
      </span>
    `;
  } else if (vendor.status === 'pending') {
    statusBadge = `
      <span class="vendor-status-badge pending me-2">
        Pending
      </span>
    `;
  } else if (vendor.status === 'suspended') {
    statusBadge = `
      <span class="vendor-status-badge cancelled me-2">
        Suspended
      </span>
    `;
  }

  container.innerHTML = `
    <div class="mt-2">
      ${statusBadge}

      <span class="text-warning">
        ${vendor.avgRating} ★ (${vendor.totalReviews})
      </span>
    </div>
  `;
}