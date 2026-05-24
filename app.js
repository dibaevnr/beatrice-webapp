const tg = window.Telegram.WebApp;
const VERSION = "6.2";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let currentSection = null;

// Инициализация пользователя
function init() {
  const user = tg.initDataUnsafe?.user;
 
  if (user) {
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Без username';
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('user-info').textContent = user.first_name;

    const photoEl = document.getElementById('user-photo');
    if (user.photo_url) {
      photoEl.src = user.photo_url;
    } else {
      photoEl.src = "https://via.placeholder.com/120/4B0082/FFFFFF?text=👤";
    }
  }
}

// Показать секцию
function showSection(section) {
  // Скрываем все секции
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  
  if (section === 'users') {
    документ.getElementById('раздел пользователей').стиль.отображать = 'блокировать';
    loadUsers(); // функция загрузки списка
  }
}

// Заглушка — здесь будет запрос списка пользователей
функция loadUsers() {
  константа список пользователей = документ.getElementById('список пользователей');
  список пользователей.внутреннийHTML = '<p class="loading">🔄 Запрос списка пользователей...</p>';

  // Отправляем запрос боту
  тг.отправитьДанные(JSON.стринглиф({
    действие: "get_users",
    версия: ВЕРСИЯ,
    отметка времени: Дата.сейчас()
  }));

  // Пока бот не ответит — можно показать заглушку
  // Реальные данные будут приходить от бота
}

// Основная функция навигации
функция навигация(раздел) {
  текущийРаздел = раздел;

  тг.отправитьДанные(JSON.стринглиф({
    действие: раздел,
    версия: ВЕРСИЯ,
    отметка времени: Дата.сейчас()
  }));

  если (раздел === «пользователи») {
    показатьРаздел(«пользователи»);
  } еще {
    // Для остальных разделов — всплывающее окно
    позволять заголовок = "Раздел открыт";
    позволять сообщение = `Вы открыли раздел: ${раздел}`;

    выключатель(раздел) {
      случай 'профиль':
        заголовок = "Мой аккаунт";
        сообщение = "Данные профиля отправлены боту";
        перерыв;
      случай 'статус':
        заголовок = "Состояние соединения";
        сообщение = "Запрос скорости и статуса отправлен";
        перерыв;
      случай 'поддержка':
        заголовок = "Поддержка";
        сообщение = "Переход в поддержку";
        перерыв;
    }

    тг.показатьВсплывающее окно({ заголовок, сообщение, кнопки: [{тип: "ок"}] });
  }
}

// Привязка кликов
документ.addEventListener(«DOMContentLoaded», () => {
  инициализировать();

  документ.querySelectorAll('.карта').дляКаждого(карта => {
    карта.addEventListener('нажмите', () => {
      константа раздел = карта.набор данных.раздел;
      если (раздел) {
        навигация(раздел);
      }
    });
  });
});
