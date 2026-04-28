import { renderCategories, renderProducts} from './newRFQ.render.js';

import { rfqState } from './newRFQ.state.js';

async function loadCategories() {
  try {
    const res = await fetch('/api/v1/products/categories');
    const data = await res.json();

    if (res.ok) {
      renderCategories(data);
    }
  } catch (error) {
    console.error('Category error:', error);
  }
}

async function loadProducts(categoryId) {
  try {
    const res = await fetch(`/api/v1/products/by-category/${categoryId}`);
    const data = await res.json();

    if (res.ok) {
      rfqState.selectedCategory = categoryId;
      rfqState.selectedProducts = data.products;

      renderProducts(data);
    }
  } catch (error) {
    console.error('Product error:', error);
  }
}

export { loadCategories, loadProducts };
