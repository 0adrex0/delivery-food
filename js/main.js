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
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

const sectionHeading = document.querySelector('.menu .section-heading');

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`);
  }

  return await response.json();
};

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

function createCardRestaurant(resraurant) {

  //Деструктурищация данных
  const { name, 
          image, 
          kitchen,
          price, 
          products, 
          stars, 
          time_of_delivery: timeOfDelivery // Переименовываем переменную
        } = resraurant;

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" class="card-image"/>
      <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">${stars}</div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

//Деструктурищация при получении
function createCardGood({ description, id, image, name, price, }) {

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="${name}" class="card-image"/>

        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
          </div>

          <div class="card-info">
            <div class="ingredients">${description}</div>
          </div>

          <div class="card-buttons">
            <button class="button button-primary button-add-cart">
              <span class="button-card-text">В корзину</span>
              <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
          </div>
        </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target =  event.target;
  //Поиск вверх по дом дереву до .card-restaurant
  const restaurant = target.closest('.card-restaurant');
  
  const restaurantTitle = restaurant.querySelector('.card-title');
  const restaurantRating = restaurant.querySelector('.rating');
  const restaurantPrice = restaurant.querySelector('.price');
  const restaurantCategory = restaurant.querySelector('.category');

  const headingTitle = sectionHeading.querySelector('.section-title');
  const headingRating = sectionHeading.querySelector('.rating');
  const headingPrice = sectionHeading.querySelector('.price');
  const headingCategory = sectionHeading.querySelector('.category');

  if(login) {
    if(restaurant) {
      cardsMenu.textContent = '';

      restaurants.classList.add('hide');
      containerPromo.classList.add('hide');
      menu.classList.remove('hide');
      console.log(restaurant)
      getData('./db/' + restaurant.dataset.products).then(function(data) {
        data.forEach(createCardGood);

        headingTitle.innerText = restaurantTitle.innerText;
        headingPrice.innerText = restaurantPrice.innerText;
        headingRating.innerText = restaurantRating.innerText;
        headingCategory.innerText = restaurantCategory.innerText;

        console.log(sectionHeading);
      });
    }
  } else {
    toogelModalAuth();
  } 
}
getData('./db/partners.json').then(function(data) {
  data.forEach(createCardRestaurant);
});


function init () {
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
      restaurants.classList.remove('hide');
      containerPromo.classList.remove('hide');
      menu.classList.add('hide');
  })

  cartBtn.addEventListener("click", toggleModal);
  cartClose.addEventListener("click", toggleModal);

  checkAuth();
}

init();


