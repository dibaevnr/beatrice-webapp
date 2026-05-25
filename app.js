const tg = window.Telegram.WebApp;
const VERSION = "11.2";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = []; // Сюда будут приходить пользователи из 3x-UI

// Инициализация (текущий Telegram пользователь)
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
    document.getElementById('users-list').innerHTML = '<p class="loading">🔄 Запрашиваю пользователей из 3x-UI...</p>';
  } else {
    тг.показатьВсплывающее окно({
      заголовок: "Запрос отправлен",
      сообщение: `Раздел "${раздел}" — данные отправлены боту`,
      кнопки: [{тип: "ок"}]
    });
  }
}

// === Получение данных из 3x-UI от бота ===
тг.onEvent('webAppDataReceived', (событие) => {
  пытаться {
    константа ответ = JSON.анализировать(событие.данные);

    если (ответ.действие === 'данные_пользователей' || ответ.тип === «пользователи») {
      всеПользователи = ответ.пользователи || ответ.данные || [];

      // Обновляем статистику
      документ.getElementById('всего пользователей').текстСодержание = всеПользователи.длина;
      
      константа онлайнСчет = всеПользователи.фильтр(u => u.онлайн === истинный || u.статус === "онлайн").длина;
      документ.getElementById(«онлайн-пользователи»).текстСодержание = онлайнСчет;

      // Рендерим список
      renderUsers(всеПользователи);
    }
  } ловить (e) {
    консоль.ошибка("Ошибка при обработке данных от бота:", e);
    документ.getElementById('список пользователей').внутреннийHTML = '<p class="empty">Ошибка обработки данных</p>';
  }
});

функция renderUsers(пользователи) {
  константа контейнер = документ.getElementById('список пользователей');
  
  если (!пользователи || пользователи.длина === 0) {
    контейнер.внутреннийHTML = '<p class="empty">Нет подробнее в 3x-UI подробнее</p>';
    возвращаться;
  }

  позволять html = '';
  пользователи.дляКаждого(пользователь => {
    константа истечение срока действия = пользователь.дата_истечения_ || пользователь.истечение срока действия ? новый Дата(пользователь.дата_истечения_ || пользователь.истечение срока действия * 1000).toLocaleDateString('ру-РУ') : 'Без срока';
    
    html += `
      <div class= "user-item">
        <div class= "user-info">
          <сильный>${пользователь.электронная почта || пользователь.имя пользователя || «Без электронная почта»}</сильный><br>
          <маленький>${пользователь.ууид ? 'UUID: ' + пользователь.ууид.подстрока(0,8)+'...' : ''}</маленький>
        </див>
        <div class="статус пользователя ${пользователь.онлайн || пользователь.статус === «онлайн» ? «онлайн» : 'офлайн'}">
          ${пользователь.онлайн || пользователь.статус === «онлайн» ? '● Онлайн' : '○ Офлайн'}
        </див>
      </див>
    `;
  });
  
  контейнер.внутреннийHTML = html;
}

// Запуск
документ.addEventListener(«DOMContentLoaded», () => {
  initTelegramUser();

  документ.querySelectorAll('.карта').дляКаждого(карта => {
    карта.addEventListener('нажмите', () => {
      константа раздел = карта.набор данных.раздел;
      если (раздел) навигация(раздел);
    });
  });
});
