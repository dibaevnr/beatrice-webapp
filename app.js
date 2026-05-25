const tg = window.Telegram.WebApp;
const VERSION = "11.3";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = [];
let selectedUser = null;

// Инициализация Telegram пользователя
function initTelegramUser() {
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
    document.getElementById('users-list').innerHTML = '<p class="loading">🔄 Загрузка пользователей...</p>';
  } 
  else if (section === 'support') {
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('support-users-list').innerHTML = '<p class="loading">🔄 Загрузка списка для поддержки...</p>';
    loadSupportUsers();
  } 
  else {
    tg.showPopup({
      title: "Запрос отправлен",
      message: `Раздел "${section}" открыт`,
      buttons: [{type: "ok"}]
    });
  }
}

// Загрузка пользователей для поддержки
function loadSupportUsers() {
  tg.sendData(JSON.stringify({ action: "get_users", version: VERSION }));
}

// Приём данных от бота
tg.onEvent('webAppDataReceived', (event) => {
  try {
    const response = JSON.parse(event.data);
    
    if (response.action === 'users_data' || response.type === 'users') {
      allUsers = response.users || response.data || [];
      
      // Обновляем статистику на главном экране
      document.getElementById('total-users').textContent = allUsers.length;
      const online = allUsers.filter(u => u.online).length;
      document.getElementById('online-users').textContent = online;

      // Если открыт раздел поддержки — показываем список
      if (document.getElementById('support-section').style.display !== 'none') {
        renderSupportUsers(allUsers);
      }
    }
  } catch (e) {
    console.error(e);
  }
});

function renderSupportUsers(users) {
  const container = document.getElementById('support-users-list');
  if (!users || users.length === 0) {
    container.innerHTML = '<p class="empty">Нет пользователей</p>';
    return;
  }

  let html = '';
  users.forEach(user => {
    html += `
      <div class="user-item" onclick="selectUser(${JSON.stringify(user)})">
        <div class="user-info">
          <strong>${user.email || user.username || 'Без имени'}</strong><br>
          <small>ID: ${user.id || '—'}</small>
        </div>
        <div class="user-status ${user.online ? 'online' : 'offline'}">
          ${user.online ? '● Онлайн' : '○ Офлайн'}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function selectUser(user) {
  selectedUser = user;
  document.getElementById('selected-user').textContent = user.email || user.username || 'Пользователь';
  document.getElementById('message-box').style.display = 'block';
  document.getElementById('support-message').focus();
}

function sendSupportMessage() {
  const message = document.getElementById('support-message').value.trim();
  if (!message || !selectedUser) return;

  tg.sendData(JSON.stringify({
    action: "send_support_message",
    user_id: selectedUser.id || selectedUser.email,
    username: selectedUser.email || selectedUser.username,
    message: message,
    timestamp: Date.now()
  }));

  tg.showPopup({
    title: "Сообщение отправлено",
    message: `Сообщение пользователю ${selectedUser.email || selectedUser.username} отправлено`,
    buttons: [{type: "ok"}]
  });

  // Очистка
  document.getElementById('support-message').value = '';
  document.getElementById('message-box').style.display = 'none';
}

function cancelMessage() {
  document.getElementById('message-box').style.display = 'none';
  document.getElementById('support-message').value = '';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  initTelegramUser();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
