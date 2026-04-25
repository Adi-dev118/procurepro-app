import { cartState } from './cart.state.js';
import { fetchCart } from './cart.api.js';



// 🔹 Initial Load
document.addEventListener('DOMContentLoaded', () => {
  fetchCart();
});