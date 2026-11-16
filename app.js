// Открытый API без ключа
const API_URL = 'https://jsonplaceholder.typicode.com/users';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('user-list');
const retryBtn = document.getElementById('retry-btn');

function showLoading() {
  statusEl.hidden = false;
  statusEl.textContent = 'Загрузка…';
  statusEl.classList.remove('error');
  listEl.replaceChildren(); // очищаем список
  retryBtn.hidden = true;
}

function showError(message) {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.classList.add('error');
  retryBtn.hidden = false;
}

function renderUsers(users) {
  statusEl.hidden = true;

  for (const user of users) {
    const li = document.createElement('li');
    li.className = 'card';

    const name = document.createElement('h2');
    name.textContent = user.name; // textContent, а не innerHTML — безопасно

    const email = document.createElement('a');
    email.href = `mailto:${user.email}`;
    email.textContent = user.email;

    const city = document.createElement('p');
    city.textContent = `Город: ${user.address.city}`;

    const site = document.createElement('a');
    site.href = `https://${user.website}`;
    site.target = '_blank';
    site.rel = 'noopener';
    site.textContent = user.website;

    li.append(name, email, city, site);
    listEl.append(li);
  }
}

async function loadUsers() {
  showLoading();

  try {
    const response = await fetch(API_URL); // GET-запрос

    // fetch НЕ считает 404/500 ошибкой — проверяем response.ok сами
    if (!response.ok) {
      throw new Error(`Сервер ответил ошибкой: ${response.status} ${response.statusText}`);
    }

    const users = await response.json(); // JSON → массив объектов
    renderUsers(users);
  } catch (error) {
    // TypeError = запрос вообще не ушёл (нет сети, сервер недоступен)
    if (error instanceof TypeError) {
      showError('Не удалось соединиться с сервером. Проверьте интернет и нажмите «Повторить».');
    } else {
      showError(error.message);
    }
  }
}

retryBtn.addEventListener('click', loadUsers);
loadUsers(); // запуск при открытии страницы