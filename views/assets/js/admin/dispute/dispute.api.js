import { disputeState } from './dispute.state.js';
import { renderDisputes, renderPagination, updateDisputeCount } from './dispute.render.js';

export async function fetchDisputes() {
  try {
    const query = new URLSearchParams({
      page: disputeState.page,
      search: disputeState.search,
      status: disputeState.status,
      priority: disputeState.priority,
      type: disputeState.type
    });

    const res = await fetch(`/admin/dispute/dispute-data?${query}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch disputes');
    }

    disputeState.page = data.currentPage;

    renderDisputes(data.disputes);
    renderPagination(data.totalPages);
    updateDisputeCount(data.currentPage, data.total);

  } catch (error) {
    console.error('Fetch Disputes Error:', error);

    const tbody = document.getElementById('dispute-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            Failed to load disputes
          </td>
        </tr>
      `;
    }
  }
}
