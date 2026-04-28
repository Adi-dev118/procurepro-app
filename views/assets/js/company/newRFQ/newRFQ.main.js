import { loadCategories, loadProducts } from './newRFQ.api.js';

document.addEventListener('DOMContentLoaded', () => {
  const categorySelect = document.getElementById('rfqCategory');

  // Load categories
  loadCategories();

  // Category change → load products
  categorySelect.addEventListener('change', async () => {
    const categoryId = categorySelect.value;

    if (!categoryId) return;

    await loadProducts(categoryId);
  });

});
