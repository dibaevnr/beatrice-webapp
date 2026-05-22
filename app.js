const tg = window.Telegram.WebApp;
const VERSION = "5.0";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

async function init() {
  const user = tg.initDataUnsafe?.user;
  
  if (user) {
    // Заполняем данные в "Мой аккаунт"
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Без username';
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('user-info').textContent = user.first_name;

    // Фото
    const photoEl = document.getElementById('user-photo');
    if (user.photo_url) {
      photoEl.src = user.photo_url;
    } else {
      photoEl.src = "https://via.placeholder.com/120/4B0082/FFFFFF?text=👤";
    }

    // Показываем кнопку "Пользователи" только админам (можно доработать)
    // document.getElementById('users-card').style.display = 'block';
  }
}

function navigate(section) {
  tg.sendData(JSON.stringify({ action: section }));

  let title = "";
  let msg = "";

  switch(section) {
    case 'profile':
      title = "Мой аккаунт";
      msg = "Имя, ID и фото загружены из Telegram";
      break;
    case 'subscriptions':
      title = "Мои подписки";
      msg = "Здесь будет список ваших подписок";
      break;
    case 'status':
      title = "Состояние соединения";
      msg = "Здесь будет скорость и статус подключения";
      break;
    case 'support':
      title = "Поддержка";
      msg = "Напишите сообщение администратору";
      break;
    case 'users':
      title = "Пользователи";
      msg = "Управление пользователями (только для админа)";
      break;
  }

  tg.showPopup({
    title: title,
    message: msg,
    buttons: [{type: "ok"}]
  });
}

document.addEventListener('DOMContentLoaded', init);
