import { loadCurrentUser } from './profile.api.js';
import { renderUserCard } from './profile.render.js';

async function initUserCard() {
  try {
    const user = await loadCurrentUser();

    renderUserCard(user);
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', initUserCard);
