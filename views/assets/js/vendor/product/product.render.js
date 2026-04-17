import { productState } from "./product.state.js";

function getContainer() {
  switch (productState.tab) {
    case 'active': return document.getElementById('active-container');
    case 'inactive': return document.getElementById('inactive-container');
    case 'low_stock': return document.getElementById('low-stock-container');
    case 'out_of_stock': return document.getElementById('out-of-stock-container');
    default: return document.getElementById('all-products-container');
  }
}

export function renderProducts(products) {
  const container = getContainer();
  if (!container) return;

  container.innerHTML = '';

  if (!products.length) {
    container.innerHTML = `<p>No products found</p>`;
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div class="vendor-product-card">
        <div class="vendor-product-image">
          <i class="bi ${p.icon || 'bi-box'}"></i>
        </div>

        <div class="vendor-product-content">
          <h5>${p.name}</h5>
          <p>$${p.price}</p>
          <span class="badge ${p.stock > 5 ? 'bg-success' : 'bg-warning'}">
            ${p.stock > 5 ? 'In Stock' : 'Low Stock'}
          </span>
        </div>
      </div>
    `;
  });
}