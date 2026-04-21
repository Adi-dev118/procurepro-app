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

