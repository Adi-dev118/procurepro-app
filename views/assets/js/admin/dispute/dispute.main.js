import { disputeState } from './dispute.state.js';
import { fetchDisputes } from './dispute.api.js';

// 🔹 STATUS FILTER
function setStatusFilter(status) {
  if (disputeState.status === status) {
    disputeState.status = ''; // toggle off
  } else {
    disputeState.status = status;
  }

  disputeState.page = 1;
  fetchDisputes();
}

// 🔹 PRIORITY FILTER
function setPriorityFilter(priority) {
  if (disputeState.priority === priority) {
    disputeState.priority = '';
  } else {
    disputeState.priority = priority;
  }

  disputeState.page = 1;
  fetchDisputes();
}

// 🔹 TYPE FILTER
function setTypeFilter(type) {
  if (disputeState.type === type) {
    disputeState.type = '';
  } else {
    disputeState.type = type;
  }

  disputeState.page = 1;
  fetchDisputes();
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

  fetchDisputes();
}

// 🔹 INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => {
  fetchDisputes();
});

// 🔹 PAGINATION
document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn) {
    e.preventDefault();
    const page = Number(pageBtn.dataset.page);

    if (!page) return;

    disputeState.page = page;
    fetchDisputes();
  }
});

// 🔹 SEARCH
document.querySelector('.search-btn')?.addEventListener('click', () => {
  const input = document.querySelector('input[name="search"]');

  disputeState.search = input.value;
  disputeState.page = 1;

  fetchDisputes();
});

// 🔹 STATUS FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.status-filter');

  if (btn) {
    e.preventDefault();
    const status = btn.dataset.status;
    setStatusFilter(status);
  }
});

// 🔹 PRIORITY FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.priority-filter');

  if (btn) {
    e.preventDefault();
    const priority = btn.dataset.priority;
    setPriorityFilter(priority);
  }
});

// 🔹 TYPE FILTER CLICK
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.type-filter');

  if (btn) {
    e.preventDefault();
    const type = btn.dataset.type;
    setTypeFilter(type);
  }
});

// 🔹 CLEAR FILTER BUTTON
document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});