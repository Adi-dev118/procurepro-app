import { orderState } from './order.state.js';
import { fetchOrders } from './order.api.js';

function setStatusFilter(status) {
  if (orderState.status === status) {
    orderState.status = ''; // toggle off
  } else {
    orderState.status = status;
  }

  orderState.page = 1;
  fetchOrders();
}

// 🔹 STOCK FILTER
function setPaymentFilter(payment) {
  if (orderState.payment === payment) {
    orderState.payment = '';
  } else {
    orderState.payment = payment;
  }

  orderState.page = 1;
  fetchOrders();
}

function setDateFilter(dateRange) {
  if (orderState.dateRange === dateRange) {
    orderState.dateRange = '';
  } else {
    orderState.dateRange = dateRange;
  }

  orderState.page = 1;
  fetchOrders();
}
function clearFilters() {
  orderState.status = '';
  orderState.payment = '';
  orderState.search = '';
  orderState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  fetchOrders();
}
// 🔹 INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});

// 🔹 SEARCH
document.querySelector('.search-btn')?.addEventListener('click', () => {
  const input = document.querySelector('input[name="search"]');

  orderState.search = input.value;
  orderState.page = 1;

  fetchOrders();
});

// 🔹 STATUS FILTER
// 🔹 STATUS FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.status-filter');

  if (btn) {
    e.preventDefault();
    const status = btn.dataset.status;
    setStatusFilter(status);
  }
});

// 🔹 PAYMENT FILTER
// 🔹 STATUS FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.payment-filter');

  if (btn) {
    e.preventDefault();
    const payment = btn.dataset.payment;
    setPaymentFilter(payment);
  }
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.date-filter');

  if (btn) {
    e.preventDefault();
    const range = btn.dataset.range;
    setDateFilter(range);
  }
});

document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn) {
    e.preventDefault();

    const page = Number(pageBtn.dataset.page);

    if (!page) return;

    orderState.page = page;
    fetchOrders();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});
