const tg = window.Telegram.WebApp;
const VERSION = "6.0";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

async function init() {
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

// Отправка данных в бот
function navigate(section) {
  tg.sendData(JSON.stringify({ 
    action: section,
    version: VERSION,
    timestamp: Date.now()
  }));

  let title = "";
  let message = "";

  switch(section) {
    case 'profile':
      title = "Мой аккаунт";
      message = "Данные профиля отправлены боту";
      break;
    case 'subscriptions':
      title = "Мои подписки";
      message = "Запрос списка подписок отправлен";
      break;
    case 'status':
      title = "Состояние соединения";
      message = "Запрос скорости и статуса отправлен";
      break;
    case 'support':
      title = "Поддержка";
      message = "Переход в поддержку";
      break;
  }

  tg.showPopup({
    title: title,
    message: message,
    buttons: [{type: "ok"}]
  });
}

document.addEventListener('DOMContentLoaded', init);
