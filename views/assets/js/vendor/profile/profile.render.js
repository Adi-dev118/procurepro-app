import { logoutUser } from './profile.api.js';
export function renderProfileDropdown(user) {
  const initials = user.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return `
  
    <div class="vendor-user-profile" id="profileTrigger">

      <div class="vendor-user-avatar">
        <span>${initials}</span>
      </div>

      <span class="vendor-user-name">
        ${user.name}
      </span>

      <i class="bi bi-chevron-down" id="profileChevron"></i>

    </div>

    <div class="vendor-profile-dropdown" id="profileDropdown">

      <div class="vendor-profile-dropdown-header">

        <div class="vendor-profile-dropdown-avatar">
          <span>${initials}</span>
        </div>

        <div class="vendor-profile-dropdown-info">
          <strong>${user.name}</strong>
          <small>${user.email}</small>
        </div>

      </div>

      <div class="vendor-profile-dropdown-divider"></div>

      <a href="/signup"
         class="vendor-profile-dropdown-signout"
          id="signoutButton">

        <i class="bi bi-box-arrow-right"></i>
        Sign Out

      </a>

    </div>
  `;
}

export function initProfileDropdown() {
  const profileTrigger = document.getElementById('profileTrigger');

  const profileDropdown = document.getElementById('profileDropdown');

  const profileChevron = document.getElementById('profileChevron');

  const signOut = document.getElementById('signoutButton');

  if (!profileTrigger) return;

  profileTrigger.addEventListener('click', function (e) {
    e.stopPropagation();

    const isOpen = profileDropdown.classList.toggle('open');

    profileChevron.classList.toggle('rotated', isOpen);
  });

  document.addEventListener('click', function () {
    profileDropdown.classList.remove('open');

    profileChevron.classList.remove('rotated');
  });

  if (signOut) {
    signOut.addEventListener('click', logoutUser);
  }
}
