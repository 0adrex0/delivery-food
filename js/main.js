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

const modalBody = document.querySelector('.modal-body');
const sectionHeading = document.querySelector('.menu .section-heading');
const modalPrice = document.querySelector('.modal-pricetag')
const buttonClearCart = document.querySelector('.clear-cart');
let login = localStorage.getItem('gloDelivery');

let cartList = [];

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
    cartBtn.style.display = '';
    btnOut.removeEventListener('click', logOut);
    checkAuth();
  }


  userName.textContent = login;
  authBtn.style.display = 'none';
  userName.style.display = 'inline';
  btnOut.style.display = 'flex';
  cartBtn.style.display = 'flex';

  
  btnOut.addEventListener('click', logOut);
}

function notAuthorized() {

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
            <div class="price">От ${price} ₴</div>
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
            <strong class="card-price-bold card-price">${price} ₴</strong>
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

      getData('./db/' + restaurant.dataset.products).then(function(data) {
        data.forEach(createCardGood);

        headingTitle.textContent = restaurantTitle.textContent;
        headingPrice.textContent = restaurantPrice.textContent;
        headingRating.textContent = restaurantRating.textContent;
        headingCategory.textContent = restaurantCategory.textContent;

      });
    }
  } else {
    toogelModalAuth();
  } 
}


function addToCart(event) {
  const target = event.target;

  const btnAddToCart = target.closest('.button-add-cart');

 if(btnAddToCart) {
   const card = target.closest('.card');
   const title = card.querySelector('.card-title-reg').textContent;
   const cost = card.querySelector('.card-price').textContent;
   const id = card.id;

   const food = cartList.find(function(item) {
      return item.id === id;
   });

   if (food) {
      food.count += 1;

   } else {
      cartList.push({
        id,
        title,
        cost,
        count: 1
      });
   }
 }
}

function renderCart() {
  modalBody.textContent = '';

  cartList.forEach(function({ id, title, cost, count }) {

    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button cout-minus" data-id='${id}'>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button count-plus" data-id='${id}'>+</button>
        </div>
      </div>`;

      modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  const totalPrice = cartList.reduce(function(result, item) {

    return result + (parseFloat(item.cost) * parseFloat(item.count)) ; 
  }, 0);

  
  modalPrice.textContent = totalPrice + '₴' ;
  
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {

    const food = cartList.find(function(item) {
      return item.id === target.dataset.id;
    });

    if(target.classList.contains('cout-minus')) {
      food.count--;
      if(food.count === 0) {
        cartList.splice(cartList.indexOf(food), 1);
      }
    }

    if(target.classList.contains('count-plus')) {
      food.count++;
    }

    renderCart();
  };
}

function init () {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant);
  });

  cartBtn.addEventListener('click', function() {
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener('click', changeCount);

  cardsRestaurants.addEventListener('click', openGoods);

  cardsMenu.addEventListener('click', addToCart);

  buttonClearCart.addEventListener('click', function() {
    cartList.length = 0;
    renderCart();
  });

  logo.addEventListener('click', function () {
      restaurants.classList.remove('hide');
      containerPromo.classList.remove('hide');
      menu.classList.add('hide');
  });

  cartClose.addEventListener("click", toggleModal);

  checkAuth();
}

init();


