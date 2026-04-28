import { loadCategories, loadProducts, loadSuppliers } from './newRFQ.api.js';

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

  // Product change → works for ALL dynamic rows
  document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('rfq-item-product')) {
      const productId = e.target.value;

      if (!productId) return;

      await loadSuppliers(productId);
    }
  });
});
