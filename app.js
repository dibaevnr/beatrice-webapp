const tg = window.Telegram.WebApp;
const VERSION = "11.0";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = [];

// Инициализация
function init() {
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = user.first_name || 'Администратор';
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Нет username';
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('user-info').textContent = user.first_name || 'Админ';

    const photo = document.getElementById('user-photo');
    photo.src = user.photo_url || "https://via.placeholder.com/120/4B0082/FFFFFF?text=👑";
  }
}

// Навигация
function navigate(section) {
  tg.sendData(JSON.stringify({ action: section, version: VERSION, timestamp: Date.now() }));

  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

  if (section === 'users') {
    document.getElementById('users-section').style.display = 'block';
    loadUsers();
  } else {
    tg.showPopup({
      title: "Уведомление",
      message: `Раздел "${section}" открыт. Ожидаем ответ от бота...`,
      buttons: [{type: "ok"}]
    });
  }
}

// Загрузка пользователей (заглушка + реальный запрос)
function loadUsers() {
  const list = document.getElementById('users-list');
  list.innerHTML = '<p class="loading">🔄 Загрузка пользователей...</p>';

  tg.sendData(JSON.stringify({ action: "get_users", version: VERSION }));

  // Заглушка до ответа от бота
  setTimeout(() => {
    if (list.innerHTML.includes("Загрузка")) {
      list.innerHTML = `
        <p class="empty">Бот пока не отправил данные.<br>Нажмите "Обновить"</p>
      `;
    }
  }, 3000);
}

// Функция для приёма данных от бота (вызывать из бота через sendData)
function receiveUsers(users) {
  allUsers = users;
  renderUsers(users);
}

function renderUsers(users) {
  const list = document.getElementById('users-list');
  if (!users || users.length === 0) {
    list.innerHTML = '<p class="empty">Список пользователей пуст</p>';
    return;
  }

  let html = '';
  users.forEach(u => {
    html += `
      <div class="user-item">
        <div class="user-info">
          <strong>${u.username || 'Без имени'}</strong><br>
          <small>ID: ${u.id} • ${u.expiry || 'Без срока'}</small>
        </div>
        <div class="user-status ${u.online ? 'online' : 'offline'}">
          ${u.online ? '● Онлайн' : '○ Офлайн'}
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
