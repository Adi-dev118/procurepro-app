import { orderState } from './order.state.js';
import {
  renderOrders,
  renderPagination,
  updateOrderCount
} from './order.render.js';

export async function fetchOrders() {
  try {
    const query = new URLSearchParams({
      page: orderState.page,
      search: orderState.search,
      status: orderState.status,
      payment: orderState.payment
    });

    const res = await fetch(`/company/order/order-data?${query}`);
    const data = await res.json();

    // 🔥 render table
    renderOrders(data.orders);

    // 🔥 pagination
    renderPagination(data.totalPages);

    // 🔥 count text
    updateOrderCount(
      orderState.page,
      data.totalOrders,
      data.limit
    );

  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}