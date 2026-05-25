const tg = window.Telegram.WebApp;
const VERSION = "11.5";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = [];
let selectedUser = null;

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
  tg.sendData(JSON.stringify({ 
    action: section, 
    version: VERSION,
    timestamp: Date.now() 
  }));

  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

  if (section === 'users') {
    document.getElementById('users-section').style.display = 'block';
    document.getElementById('users-list').innerHTML = '<p class="loading">🔄 Запрос данных из 3x-UI...</p>';
  } 
  else if (section === 'support') {
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('support-users-list').innerHTML = '<p class="loading">🔄 Загрузка списка...</p>';
    tg.sendData(JSON.stringify({ action: "get_users", version: VERSION }));
  }
}

// Получение данных от бота
tg.onEvent('webAppDataReceived', (event) => {
  try {
    const response = JSON.parse(event.data);
    
    if (response.action === 'users_data' || response.type === 'users') {
      allUsers = response.users || response.data || [];

      document.getElementById('total-users').textContent = allUsers.length;
      const online = allUsers.filter(u => u.online === true).length;
      document.getElementById('online-users').textContent = online;

      if (document.getElementById('users-section').style.display !== 'none') {
        renderUsers(allUsers);
      }
      if (document.getElementById('support-section').style.display !== 'none') {
        renderSupportUsers(allUsers);
      }
    }
  } catch (e) {
    console.error("Ошибка данных:", e);
  }
});

function renderUsers(users) {
  const container = document.getElementById('users-list');
  if (!users || users.length === 0) {
    container.innerHTML = '<p class="empty">Нет пользователей</p>';
    return;
  }

  let html = '';
  users.forEach(u => {
    html += `
      <div class="user-item">
        <div class="user-info">
          <strong>${u.email || u.username || 'Без имени'}</strong><br>
          <small>${u.expiry ? new Date(u.expiry*1000).toLocaleDateString('ru-RU') : 'Без срока'}</small>
        </div>
        <div class="user-status ${u.online ? 'online' : 'offline'}">
          ${u.online ? '● Онлайн' : '○ Офлайн'}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function renderSupportUsers(users) {
  const container = document.getElementById('support-users-list');
  if (!users || users.length === 0) {
    container.innerHTML = '<p class="empty">Нет пользователей</p>';
    return;
  }

  let html = '';
  users.forEach(u => {
    html += `
      <div class="user-item" onclick='selectUser(${JSON.stringify(u)})'>
        <div class="user-info">
          <strong>${u.email || u.username || 'Без имени'}</strong>
        </div>
        <div class="user-status ${u.online ? 'online' : 'offline'}">
          ${u.online ? '●' : '○'}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function selectUser(user) {
  selectedUser = user;
  document.getElementById('selected-user').textContent = user.email || user.username;
  document.getElementById('message-box').style.display = 'block';
}

function sendSupportMessage() {
  const msg = document.getElementById('support-message').value.trim();
  if (!msg || !selectedUser) return;

  tg.sendData(JSON.stringify({
    action: "send_support_message",
    user: selectedUser.email || selectedUser.username,
    message: msg
  }));

  tg.showPopup({title: "Отправлено", message: "Сообщение отправлено", buttons: [{type:"ok"}]});
  cancelMessage();
}

function cancelMessage() {
  document.getElementById('message-box').style.display = 'none';
  document.getElementById('support-message').value = '';
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
