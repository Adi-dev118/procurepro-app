import { cartState } from './cart.state.js';
import { renderCart } from './cart.render.js';

export async function fetchCart() {
  const query = new URLSearchParams({
    page: cartState.page,
  });

  const res = await fetch(`/api/v1/carts/get-items/?${query}`);
  const data = await res.json();
  renderCart(data.cart);
}
