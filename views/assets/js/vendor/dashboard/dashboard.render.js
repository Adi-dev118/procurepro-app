
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
