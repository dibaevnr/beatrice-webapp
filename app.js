const tg = window.Telegram.WebApp;

// Инициализация
tg.expand();
tg.setHeaderColor("#1a0033");
tg.setBackgroundColor("#1a0033");

async function init() {
  const user = tg.initDataUnsafe?.user;
  
  if (user) {
    document.getElementById('user-info').textContent = 
      `@${user.username || user.first_name}`;
  }
}

// Навигация (здесь будешь подключать к боту позже)
function navigate(section) {
  tg.showPopup({
    title: "Раздел открыт",
    message: `Вы открыли раздел: ${section}`,
    buttons: [{type: "ok"}]
  });

  // Здесь в будущем будешь отправлять данные боту
  tg.sendData(JSON.stringify({ action: section }));
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
