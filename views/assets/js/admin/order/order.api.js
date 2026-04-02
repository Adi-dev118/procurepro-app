import { orderState } from './order.state.js';
import { renderOrders, renderPagination, updateProductCount } from './order.render.js';

export async function fetchOrders() {
  try {
    const query = new URLSearchParams({
      page: orderState.page,
      search: orderState.search,
      status: orderState.status,
      payment: orderState.payment,
      dateRange: orderState.dateRange
    });

    const res = await fetch(`/admin/order/order-data?${query}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    orderState.page = data.currentPage;

    renderOrders(data.orders);
    renderPagination(data.totalPages);
    updateProductCount(data.currentPage, data.total);
  } catch (error) {
    console.error('Fetch Orders Error:', error);

    const tbody = document.getElementById('order-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            Failed to load orders
          </td>
        </tr>
      `;
    }
  }
}
