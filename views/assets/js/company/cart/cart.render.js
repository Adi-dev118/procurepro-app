function renderCart(cartItems) {
  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('emptyState');
  const itemCountBadge = document.getElementById('itemCountBadge');
  const cartSubtitle = document.getElementById('cartSubtitle');

  const summaryQty = document.getElementById('summaryQty');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryTax = document.getElementById('summaryTax');
  const summaryTotal = document.getElementById('summaryTotal');

  if (!cartItems || cartItems.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';

    itemCountBadge.textContent = 0;
    cartSubtitle.textContent = 'Your cart is empty';

    summaryQty.textContent = 0;
    summarySubtotal.textContent = '$0.00';
    summaryTax.textContent = '$0.00';
    summaryTotal.textContent = '$0.00';

    return;
  }

  emptyState.style.display = 'none';

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  const subtotal = Number(cartItems[0].cart_total || 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const finalTotal = +(subtotal + tax).toFixed(2);

  itemCountBadge.textContent = cartItems.length;
  cartSubtitle.textContent = `${cartItems.length} products in your cart`;

  summaryQty.textContent = totalItems;
  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  summaryTax.textContent = `$${tax.toFixed(2)}`;
  summaryTotal.textContent = `$${finalTotal.toFixed(2)}`;

  container.innerHTML = cartItems
    .map(
      (item) => `
      <div class="cart-card">

        <!-- Product Image -->
        <div class="cart-img">
          <i class="bi ${item.icon || 'bi-box'}"></i>
        </div>

        <!-- Product Info -->
        <div class="cart-info">
          <div class="cart-cat">
            ${item.category_id || 'Product'}
          </div>

          <div class="cart-name">
            ${item.name}
          </div>

          <div class="cart-supplier">
            <i class="bi bi-upc-scan"></i>
            SKU: ${item.sku}
          </div>

          <div class="cart-price-row">
            <div class="cart-unit-price">
              $${Number(item.price).toFixed(2)}
            </div>
            <div class="cart-per-unit">
              / unit
            </div>
          </div>

          <div class="cart-subtotal-label">
            MOQ: <span>${item.moq}</span> • 
            Stock: <span>${item.stock}</span>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="cart-controls">

          <div class="qty-control">
            <button 
              class="qty-btn decrease-btn" 
              data-id="${item.id}"
            >
              −
            </button>

            <input
              type="number"
              class="qty-input"
              value="${item.quantity}"
              min="1"
              data-id="${item.id}"
            />

            <button 
              class="qty-btn increase-btn" 
              data-id="${item.id}"
            >
              +
            </button>
          </div>

          <div class="cart-line-total">
            $${Number(item.item_total).toFixed(2)}
          </div>

          <button 
            class="delete-btn remove-btn"
            data-id="${item.id}"
          >
            <i class="bi bi-trash"></i>
          </button>

        </div>

      </div>
    `,
    )
    .join('');
}

export { renderCart };
