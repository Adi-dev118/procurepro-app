import { orderState } from './order.state.js';
import { fetchOrders } from './order.api.js';

// 🔹 Change Page
function changePage(page) {
  if (page < 1) return;

  orderState.page = page;
  fetchOrders();
}

// 🔹 Search (Topbar)
document.querySelector('.topbar-search input')
  ?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      orderState.search = e.target.value.trim();
      orderState.page = 1;
      fetchOrders();
    }
  });

// 🔹 Status Filter
document.querySelectorAll('.filter-bar select')[0]
  ?.addEventListener('change', (e) => {
    const value = e.target.value.toLowerCase();

    orderState.status = value === 'all status' ? '' : value;
    orderState.page = 1;

    fetchOrders();
  });

// 🔹 Payment Filter (if you add later)
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-payment]');
  if (!el) return;

  orderState.payment = el.value;
  orderState.page = 1;

  fetchOrders();
});

// 🔹 Track Order Click
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.track-order-btn');
  if (!btn) return;

  const orderId = btn.dataset.orderId;

  console.log('Track order:', orderId);

  // 👉 future: open tracking modal
});

// 🔹 View Order
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[title="View"]');
  if (!btn) return;

  const row = btn.closest('tr');
  console.log('View order clicked', row);

  // 👉 future: open order details modal
});

// 🔹 Pay Button
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[title="Pay"]');
  if (!btn) return;

  console.log('Initiate payment');

  // 👉 integrate payment gateway later
});

// 🔹 Initial Load
document.addEventListener('DOMContentLoaded', () => {
    
// 🔹 Pagination Click
document.getElementById('pagination')
  ?.addEventListener('click', (e) => {
    const btn = e.target.closest('.pag-btn');
    if (!btn || btn.classList.contains('disabled')) return;

    const page = Number(btn.dataset.page);
    changePage(page);
  });

  fetchOrders();
});

function openOrderModal(order) {
  function getStatusBadge(status) {
    const map = {
      delivered: 'success',
      pending: 'warning',
      processing: 'primary',
      cancelled: 'danger',
      paid: 'success',
      unpaid: 'secondary',
    };

    return `<span class="badge bg-${map[status?.toLowerCase()] || 'secondary'}">
      ${status}
    </span>`;
  }

  // Modal Title
  document.querySelector('#viewOrderModal .modal-title').textContent =
    `Order #${order.id}`;

  // Modal Body → Only Order Items
  document.getElementById('order-items-content').innerHTML = `
    <div class="row g-4">

      <!-- Order Summary -->
      <div class="col-md-12">
        <div class="card p-3 profile-card">
          <div class="row">
            <div class="col-md-4">
              <p><span>Supplier:</span> ${order.supplier_name || '-'}</p>
            </div>

            <div class="col-md-4">
              <p><span>Order Date:</span>
                ${new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div class="col-md-4">
              <p><span>Total Amount:</span> ₹${order.total_amount || 0}</p>
            </div>

            <div class="col-md-4">
              <p><span>Order Status:</span>
                ${getStatusBadge(order.order_status)}
              </p>
            </div>

            <div class="col-md-4">
              <p><span>Payment Status:</span>
                ${getStatusBadge(order.payment_status)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items Table -->
      <div class="col-md-12">
        <div class="card p-3 profile-card">
          <h5 class="mb-3">Order Items</h5>

          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              ${
                order.items?.length
                  ? order.items
                      .map(
                        (item) => `
                          <tr>
                            <td>${item.product_name}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price}</td>
                            <td>₹${item.quantity * item.price}</td>
                          </tr>
                        `
                      )
                      .join('')
                  : `
                    <tr>
                      <td colspan="4" class="text-center">
                        No items found
                      </td>
                    </tr>
                  `
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}