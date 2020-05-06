const cartBtn = document.querySelector("#cart-button");
const cartModal = document.querySelector(".modal");
const cartClose = document.querySelector(".close");

// authorithation
const authBtn = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth')
const modalCloseAuth = document.querySelector('.close-auth');
const logInForm  = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const btnOut = document.querySelector('.button-out');

// cards 
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const resraurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModal() {
  cartModal.classList.toggle("is-open");
}

function toogelModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    authBtn.style.display = '';
    userName.style.display = '';
    btnOut.style.display = '';
    btnOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('Авторизован');

  userName.textContent = login;
  authBtn.style.display = 'none';
  userName.style.display = 'inline';
  btnOut.style.display = 'block';
  
  btnOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('Не авторизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    if (login) {
      localStorage.setItem('gloDelivery', login);
      loginInput.classList.remove('border-error');
      logInForm.querySelector('.error').style.display = '';

      toogelModalAuth();
    } else {
      loginInput.classList.add('border-error');
      logInForm.querySelector('.error').style.display = 'block';
    }

    authBtn.removeEventListener('click', toogelModalAuth);
    modalCloseAuth.removeEventListener('click', toogelModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();

    checkAuth();
    
  }

  authBtn.addEventListener('click', toogelModalAuth);
  modalCloseAuth.addEventListener('click', toogelModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if(login) {
    authorized();
  }else {
    notAuthorized();
  }
}

function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">Тануки</h3>
            <span class="card-tag tag">60 мин</span>
          </div>
          <div class="card-info">
            <div class="rating">
              4.5
            </div>
            <div class="price">От 1 200 ₽</div>
            <div class="category">Суши, роллы</div>
          </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
        <img src="img/pizza-plus/pizza-hawaiian.jpg" alt="image" class="card-image"/>

        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">Пицца Гавайская</h3>
          </div>

          <div class="card-info">
            <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, ананасы</div>
          </div>

          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">440 ₽</strong>
          </div>
        </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target =  event.target;
  const restaurant = target.closest('.card-restaurant');
 
  
  if(login) {
    if(restaurant) {
      cardsMenu.textContent = '';

      resraurants.classList.add('hide');
      containerPromo.classList.add('hide');
      menu.classList.remove('hide');

      createCardGood();
      createCardGood();
    }
  } else {
    toogelModalAuth();
  } 
}

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function () {
    resraurants.classList.remove('hide');
    containerPromo.classList.remove('hide');
    menu.classList.add('hide');
})

cartBtn.addEventListener("click", toggleModal);
cartClose.addEventListener("click", toggleModal);

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

