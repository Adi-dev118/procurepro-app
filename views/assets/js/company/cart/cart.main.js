// cart.main.js
import {
  fetchCart,
  increaseCartItem,
  decreaseCartItem,
  deleteCartItem,
  clearEntireCart,
} from './cart.api.js';

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  fetchCart();

  // Event Delegation for dynamic buttons
  document.addEventListener('click', (e) => {
    // Increase
    if (e.target.classList.contains('increase-btn')) {
      const productId = e.target.dataset.id;
      increaseCartItem(productId);
    }

    // Decrease
    if (e.target.classList.contains('decrease-btn')) {
      const productId = e.target.dataset.id;
      decreaseCartItem(productId);
    }

    // Delete Single Item
    if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
      const btn = e.target.closest('.remove-btn');
      const productId = btn.dataset.id;
      deleteCartItem(productId);
    }

    // Clear Entire Cart
    if (e.target.id === 'clearCartBtn' || e.target.closest('#clearCartBtn')) {
      if (confirm('Are you sure you want to clear the entire cart?')) {
        clearEntireCart();
      }
    }
  });
});
