export function renderUserCard(user) {
  const container = document.getElementById('userCard');
  const firstname = user.name.split(' ')[0];
  if (!container) return;
  document.querySelectorAll('.first-name').forEach((n) => (n.textContent = firstname));
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  container.innerHTML = `
  
    <div class="user-avatar">
      ${initials}
    </div>

    <div>

      <div class="user-name">
        ${user.name}
      </div>

      <div class="user-role">
        Buyer Account
      </div>

    </div>

    <i class="
      bi bi-chevron-up
      user-chevron
    "></i>

  `;
}
