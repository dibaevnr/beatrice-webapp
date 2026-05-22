const tg = window.Telegram.WebApp;

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

// Принудительное обновление версии
console.log("Web App v2.1 loaded");

async function init() {
  const user = tg.initDataUnsafe?.user;
  
  if (user) {
    // Имя
    document.getElementById('user-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'Без username';
    document.getElementById('user-info').textContent = user.first_name;

    // Фото пользователя
    if (user.photo_url) {
      document.getElementById('user-photo').src = user.photo_url;
    } else {
      // Если нет фото — можно поставить заглушку
      document.getElementById('user-photo').src = "https://via.placeholder.com/110?text=👤";
    }
  }
}

function navigate(section) {
  tg.sendData(JSON.stringify({ action: section }));
  
  let msg = "";
  switch(section) {
    case 'profile': msg = "Открыт раздел Мой аккаунт"; break;
    case 'subscriptions': msg = "Открыт раздел Мои подписки"; break;
    case 'status': msg = "Открыт раздел Состояние соединения"; break;
    case 'support': msg = "Открыт раздел Поддержка"; break;
  }
  
  tg.showPopup({ title: "Раздел", message: msg, buttons: [{type: "ok"}] });
}

document.addEventListener('DOMContentLoaded', init);
