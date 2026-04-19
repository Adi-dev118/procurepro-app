import { orderState } from './order.state.js';
import { fetchOrders } from './order.api.js';

/* ================= LOAD ================= */
document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});

/* ================= TABS ================= */ document
  .querySelectorAll('[data-bs-toggle="tab"]')
  .forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const id = e.target.id;

      orderState.status = '';

      if (id === 'new-tab') {
        orderState.status = 'pending';
      } else if (id === 'processing-tab') {
        orderState.status = 'processing';
      } else if (id === 'completed-tab') {
        orderState.status = 'delivered';
      }

      // reset filters
      orderState.search = '';
      orderState.dateRange = '';
      orderState.page = 1;

      fetchOrders();
    });
  });
/* ================= SEARCH ================= */
document.addEventListener('keypress', (e) => {
  if (e.target.matches('input[placeholder="Search orders..."]') && e.key === 'Enter') {
    e.preventDefault();

    orderState.search = e.target.value.trim();
    orderState.page = 1;

    fetchOrders();
  }
});

document.querySelector('.vendor-table-actions button')?.addEventListener('click', () => {
  const input = document.querySelector('input[placeholder="Search orders..."]');

  orderState.search = input.value.trim();
  orderState.page = 1;

  fetchOrders();
});

/* ================= DATE FILTER ================= */
document.querySelectorAll('.dropdown-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    const text = item.textContent.trim();

    if (text === 'Today') orderState.dateRange = 'today';
    else if (text === 'Last 7 days') orderState.dateRange = '7days';
    else if (text === 'Last 30 days') orderState.dateRange = '30days';
    else if (text === 'This month') orderState.dateRange = 'month';
    else orderState.dateRange = '';

    orderState.page = 1;

    fetchOrders();
  });
});

/* ================= PAGINATION ================= */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-link');
  if (!btn) return;

  e.preventDefault();

  const page = Number(btn.dataset.page);
  if (!page) return;

  orderState.page = page;
  fetchOrders();
});
