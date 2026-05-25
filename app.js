const tg = window.Telegram.WebApp;
const VERSION = "11.0";

tg.expand();
tg.setHeaderColor("#0f001a");
tg.setBackgroundColor("#0f001a");

let allUsers = [];

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ
function init() {
  const user = tg.initDataUnsafe?.user;
  if (user) {
    document.getElementById('user-name').textContent = user.first_name || 'РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ';
    document.getElementById('user-username').textContent = user.username ? '@' + user.username : 'РќРµС‚ username';
    document.getElementById('user-id').textContent = `ID: ${user.id}`;
    document.getElementById('user-info').textContent = user.first_name || 'РђРґРјРёРЅ';

    const photo = document.getElementById('user-photo');
    photo.src = user.photo_url || "https://via.placeholder.com/120/4B0082/FFFFFF?text=рџ‘‘";
  }
}

// РќР°РІРёРіР°С†РёСЏ
function navigate(section) {
  tg.sendData(JSON.stringify({ action: section, version: VERSION, timestamp: Date.now() }));

  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');

  if (section === 'users') {
    document.getElementById('users-section').style.display = 'block';
    loadUsers();
  } else {
    tg.showPopup({
      title: "РЈРІРµРґРѕРјР»РµРЅРёРµ",
      message: `Р Р°Р·РґРµР» "${section}" РѕС‚РєСЂС‹С‚. РћР¶РёРґР°РµРј РѕС‚РІРµС‚ РѕС‚ Р±РѕС‚Р°...`,
      buttons: [{type: "ok"}]
    });
  }
}

// Р—Р°РіСЂСѓР·РєР° РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ (Р·Р°РіР»СѓС€РєР° + СЂРµР°Р»СЊРЅС‹Р№ Р·Р°РїСЂРѕСЃ)
function loadUsers() {
  const list = document.getElementById('users-list');
  list.innerHTML = '<p class="loading">рџ”„ Р—Р°РіСЂСѓР·РєР° РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№...</p>';

  tg.sendData(JSON.stringify({ action: "get_users", version: VERSION }));

  // Р—Р°РіР»СѓС€РєР° РґРѕ РѕС‚РІРµС‚Р° РѕС‚ Р±РѕС‚Р°
  setTimeout(() => {
    if (list.innerHTML.includes("Р—Р°РіСЂСѓР·РєР°")) {
      list.innerHTML = `
        <p class="empty">Р‘РѕС‚ РїРѕРєР° РЅРµ РѕС‚РїСЂР°РІРёР» РґР°РЅРЅС‹Рµ.<br>РќР°Р¶РјРёС‚Рµ "РћР±РЅРѕРІРёС‚СЊ"</p>
      `;
    }
  }, 3000);
}

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїСЂРёС‘РјР° РґР°РЅРЅС‹С… РѕС‚ Р±РѕС‚Р° (РІС‹Р·С‹РІР°С‚СЊ РёР· Р±РѕС‚Р° С‡РµСЂРµР· sendData)
function receiveUsers(users) {
  allUsers = users;
  renderUsers(users);
}

function renderUsers(users) {
  const list = document.getElementById('users-list');
  if (!users || users.length === 0) {
    list.innerHTML = '<p class="empty">РЎРїРёСЃРѕРє РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ РїСѓСЃС‚</p>';
    return;
  }

  let html = '';
  users.forEach(u => {
    html += `
      <div class="user-item">
        <div class="user-info">
          <strong>${u.username || 'Р‘РµР· РёРјРµРЅРё'}</strong><br>
          <small>ID: ${u.id} вЂў ${u.expiry || 'Р‘РµР· СЃСЂРѕРєР°'}</small>
        </div>
        <div class="user-status ${u.online ? 'online' : 'offline'}">
          ${u.online ? 'в—Џ РћРЅР»Р°Р№РЅ' : 'в—‹ РћС„Р»Р°Р№РЅ'}
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ СЃРѕР±С‹С‚РёР№
document.addEventListener('DOMContentLoaded', () => {
  init();

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.section;
      if (section) navigate(section);
    });
  });
});
