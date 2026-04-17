import { disputeState } from './dispute.state.js';
import {
  fetchAllDisputes,
  fetchOpenDisputes,
  fetchInProgressDisputes,
  fetchResolvedDisputes,
} from './dispute.api.js';

function loadDisputes() {
  switch (disputeState.tab) {
    case 'open':
      fetchOpenDisputes();
      break;
    case 'in_progress':
      fetchInProgressDisputes();
      break;
    case 'resolved':
      fetchResolvedDisputes();
      break;
    default:
      fetchAllDisputes();
  }
}
// 🔹 STATUS FILTER
function setStatusFilter(status) {
  if (disputeState.status === status) {
    disputeState.status = ''; // toggle off
  } else {
    disputeState.status = status;
  }

  disputeState.page = 1;
  loadDisputes();
}

// 🔹 PRIORITY FILTER
function setPriorityFilter(priority) {
  if (disputeState.priority === priority) {
    disputeState.priority = '';
  } else {
    disputeState.priority = priority;
  }

  disputeState.page = 1;
  loadDisputes();
}

// 🔹 TYPE FILTER
function setTypeFilter(type) {
  if (disputeState.type === type) {
    disputeState.type = '';
  } else {
    disputeState.type = type;
  }

  disputeState.page = 1;
  loadDisputes();
}

// 🔹 CLEAR FILTERS
function clearFilters() {
  disputeState.status = '';
  disputeState.priority = '';
  disputeState.type = '';
  disputeState.search = '';
  disputeState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });

  loadDisputes();
}

async function performSearch(query) {
  try {
    disputeState.search = query;
    disputeState.page = 1;
    loadDisputes();
  } catch (err) {
    console.error(err);
  }
}

// 🔹 INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  loadDisputes();
});

document.getElementById('all-disputes-tab').addEventListener('click', () => {
  disputeState.tab = '';
  disputeState.page = 1;
  disputeState.search = '';
  loadDisputes();
});

document.getElementById('open-tab').addEventListener('click', () => {
  disputeState.tab = 'open';
  disputeState.page = 1;
  disputeState.search = '';
  loadDisputes();
});

document.getElementById('in-progress-tab').addEventListener('click', () => {
  disputeState.tab = 'in_progress';
  disputeState.page = 1;
  disputeState.search = '';
  loadDisputes();
});

document.getElementById('resolved-tab').addEventListener('click', () => {
  disputeState.tab = 'resolved';
  disputeState.page = 1;
  disputeState.search = '';
  loadDisputes();
});

// 🔹 PAGINATION
document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn) {
    e.preventDefault();
    const page = Number(pageBtn.dataset.page);

    if (!page) return;

    disputeState.page = page;
    loadDisputes();
  }
});

document.querySelectorAll('input[name="search"]').forEach((input) => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(input.value.trim()); // 🔥 ALSO HERE
    }
  });
});

document.querySelector('.search-btn')?.addEventListener('click', () => {
  const input = document.querySelector('input[name="search"]');
  disputeState.search = input.value;
  disputeState.page = 1;
  loadDisputes();
});

// 🔹 CLEAR FILTER BUTTON
document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadDisputes();
});
