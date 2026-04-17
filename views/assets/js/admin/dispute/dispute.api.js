import { disputeState } from './dispute.state.js';
import { renderDisputes, renderPagination, updateDisputeCount } from './dispute.render.js';


async function fetchDisputesBase(status) {
  const query = new URLSearchParams({
    page: disputeState.page,
    search: disputeState.search,
    priority: disputeState.priority,
    type: disputeState.type,
    status: status || disputeState.status
  });

  const res = await fetch(`/admin/dispute/dispute-data?${query}`);
  const data = await res.json();

  disputeState.page = data.currentPage;

  renderDisputes(data.disputes);
  renderPagination(data.totalPages);
  updateDisputeCount(data.currentPage, data.total);
}

export async function fetchAllDisputes() {
  return fetchDisputesBase('');
}

export async function fetchOpenDisputes() {
  return fetchDisputesBase('open');
}

export async function fetchInProgressDisputes() {
  return fetchDisputesBase('in progress');
}

export async function fetchResolvedDisputes() {
  return fetchDisputesBase('resolved');
}