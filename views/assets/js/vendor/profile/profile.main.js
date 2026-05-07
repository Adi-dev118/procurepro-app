import { getCurrentUser } from './profile.api.js';
import { renderProfileDropdown, initProfileDropdown } from './profile.render.js';

async function initNavbar() {
  const user = await getCurrentUser();

  const container = document.getElementById('navbarProfileContainer');
  const name = document.querySelectorAll('.vendor-name');

  name.forEach((n) => (n.innerHTML = `${user.name}`));
  container.innerHTML = renderProfileDropdown(user);
  initProfileDropdown();
}

initNavbar();
