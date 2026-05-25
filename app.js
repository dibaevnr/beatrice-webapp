const tg = window.Telegram.WebApp;
const VERSION = "10.0";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

function initUser() {
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = user.first_name || 'Пользователь';
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Нет username';
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('user-info').textContent = user.first_name || 'Пользователь';

    const photo = document.getElementById('user-photo');
    photo.src = user.photo_url || "https://via.placeholder.com/120/4B0082/FFFFFF?text=👤";
  }
}

function navigate(section) {
  tg.sendData(JSON.stringify({ action: section, version: VERSION }));

  if (section === 'users') {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('users-section').style.display = 'block';
  } else {
    tg.showPopup({
      title: "Раздел открыт",
      message: `Вы открыли: ${section}`,
      buttons: [{type: "ok"}]
    });
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  initUser();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
