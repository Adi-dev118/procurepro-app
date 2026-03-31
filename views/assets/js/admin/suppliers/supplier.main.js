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
