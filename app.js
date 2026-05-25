const tg = window.Telegram.WebApp;
const VERSION = "11.1";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = [];

// Инициализация пользователя
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
  tg.sendData(JSON.stringify({ 
    action: section, 
    version: VERSION,
    timestamp: Date.now() 
  }));

  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

  if (section === 'users') {
    document.getElementById('users-section').style.display = 'block';
    // Показываем загрузку
    document.getElementById('users-list').innerHTML = '<p class="loading">🔄 Запрос данных из 3x-UI...</p>';
  } else {
    tg.showPopup({
      title: "Уведомление",
      message: `Запрос в раздел "${section}" отправлен`,
      buttons: [{type: "ok"}]
    });
  }
}

// === ПРИЁМ ДАННЫХ ОТ БОТА ===
tg.onEvent('webAppDataReceived', (data) => {
  try {
    const response = JSON.parse(data.data);
    
    if (response.action === 'users_data') {
      allUsers = response.users || [];
      
      // Обновляем статистику
      document.getElementById('total-users').textContent = allUsers.length;
      
      const online = allUsers.filter(u => u.online === true).length;
      document.getElementById('online-users').textContent = online;

      // Рендер списка
      renderUsers(allUsers);
    }
  } catch (e) {
    console.error("Ошибка обработки данных:", e);
  }
});

function renderUsers(users) {
  const list = document.getElementById('users-list');
  if (!users || users.length === 0) {
    list.innerHTML = '<p class="empty">Список пользователей пуст</p>';
    return;
  }

  let html = '';
  users.forEach(u => {
    const expiry = u.expiry ? new Date(u.expiry).toLocaleDateString('ru-RU') : 'Без срока';
    html += `
      <div class="user-item">
        <div class="user-info">
          <strong>${u.email || u.username || 'Без имени'}</strong><br>
          <small>ID: ${u.id || '—'} • ${expiry}</small>
        </div>
        <div class="user-status ${u.online ? 'online' : 'offline'}">
          ${u.online ? '● Онлайн' : '○ Офлайн'}
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

// Инициализация кликов
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
