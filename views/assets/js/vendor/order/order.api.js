import { orderState } from './order.state.js';
import { renderOrders, renderPagination, updateOrderCount , renderOrderStats} from './order.render.js';

export async function fetchOrders() {
  try {
    const query = new URLSearchParams({
      page: orderState.page,
      search: orderState.search,
      status: orderState.status,
      dateRange: orderState.dateRange,
    });

    // ✅ correct endpoint for vendor
    const res = await fetch(`/vendor/api/v1/order/orders-data?${query}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    // update state
    orderState.page = data.currentPage;

    // render
    renderOrders(data.orders);
    renderPagination(data.totalPages);
    updateOrderCount(data.currentPage, data.total);
  } catch (error) {
    console.error('Fetch Vendor Orders Error:', error);

    const tbody = document.getElementById('orders-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">
            Failed to load orders
          </td>
        </tr>
      `;
    }
  }
}


export async function loadOrderStats() {
  try {
    const res = await fetch('/vendor/api/v1/order/orders-stats');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }

    const stats = data.stats;
    renderOrderStats(stats);
  } catch (error) {
    console.error('Product Stats Error:', error);
  }
}
