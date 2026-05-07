import { orderState } from './order.state.js';
import { renderOrders, renderPagination, updateOrderCount, renderOrderStats } from './order.render.js';

export async function fetchOrders() {
  try {
    const query = new URLSearchParams({
      page: orderState.page,
      search: orderState.search,
      status: orderState.status,
      payment: orderState.payment,
    });

    const res = await fetch(`/company/api/v1/order/order-data?${query}`);
    const data = await res.json();

    // 🔥 render table
    renderOrders(data.orders);

    // 🔥 pagination
    renderPagination(data.totalPages);

    // 🔥 count text
    updateOrderCount(orderState.page, data.totalOrders, data.limit);
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}

export async function loadOrderStats() {
  try {
    const res = await fetch('/company/api/v1/order/order-stats');
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    renderOrderStats(data.stats);
  } catch (error) {
    console.error('Order Stats Error:', error);
  }
}

