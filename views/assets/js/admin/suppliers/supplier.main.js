import { supplierState } from './supplier.state.js';
import { fetchSuppliers } from './supplier.api.js';

function setStatusFilter(status) {
  if (supplierState.status === status) {
    supplierState.status = ''; // remove filter
  } else {
    supplierState.status = status;
  }
  supplierState.page = 1;

  fetchSuppliers();
}


async function performSearch(query) {
  try {
    supplierState.search = query;
    supplierState.page = 1;
    fetchSuppliers();
    
  } catch (err) {
    console.error(err);
  }
}
function resetSearch() {
  supplierState.search = '';
  // clear ALL search inputs (because multiple tabs)
  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
    performSearch('')
  });
}
function clearFilters() {
  supplierState.status = '';
  supplierState.search = '';
  supplierState.page = 1;

  document.querySelectorAll('input[name="search"]').forEach((input) => {
    input.value = '';
  });
  fetchSuppliers();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchSuppliers();
});

document.addEventListener('click', (e) => {
  const pageBtn = e.target.closest('.page-link');

  if (pageBtn) {
    e.preventDefault();
    const page = Number(pageBtn.dataset.page);
    supplierState.page = page;
    fetchSuppliers();
  }
});


document.querySelectorAll('input[name="search"]').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(input.value.trim()); // 🔥 ALSO HERE
    }
  });
});

document.querySelector('.search-btn')?.addEventListener('click', () => {
  const input = document.querySelector('input[name="search"]');
  supplierState.search = input.value;
  supplierState.page = 1;
  fetchSuppliers();
});

document.addEventListener('click', (e) => {
  const statusBtn = e.target.closest('.status-filter');

  if (statusBtn) {
    e.preventDefault();
    const status = statusBtn.dataset.status;
    setStatusFilter(status);
    supplierState.page = 1;
    fetchSuppliers();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('.clear-filters')) {
    e.preventDefault();
    clearFilters();
  }
});
