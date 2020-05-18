'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const LoginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');


let login = localStorage.getItem('parol');


const cart =  [];

const loadCart = function () {
  if (localStorage.getItem(login)) {
    JSON.parse(localStorage.getItem(login)).forEach(function(item){
      cart.push(item);
    })
  }

}

const saveCart = function () {
  localStorage.setItem(login, JSON.stringify(cart))
}

const getData = async function (url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибка ${response.status}`);
  }

  return await response.json();
};

//console.log(getData('./db/partners.json'));

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open')
}

function autorized() {

  function logOut() {
    login = ''; // фбщ null 
    cart.length = 0;
    localStorage.removeItem('parol');
    LoginInput.style.borderColor = '';
    buttonAuth.style.display = ''; // вернеться в норму як в css 
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  //console.log('авторизован +++');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
  loadCart();
}

function notAutorized() {
  // console.log('--- авторизован ');

  function logIn(event) {
    event.preventDefault();
    if (LoginInput.value !== '' && LoginInput.value !== ' ') {

      login = LoginInput.value; //логин введемо при входе 

      localStorage.setItem('parol', login);
      toogleModalAuth();

      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      console.log('не закрию');

      LoginInput.style.borderColor = 'red';
      alert('Нужно ввести логин');


    }
  }

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    autorized()
  } else {
    notAutorized()
  }
}

function createCardrestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {
  // function createCardrestaurant(restaurant) {
  // const {
  //   image,
  //   kitchen,
  //   name,
  //   price,
  //   stars,
  //   products,
  //   time_of_delivery: timeOfDelivery
  // } = restaurant;


  let card = `
          <a  class="card card-restaurant" 
          data-products="${products}"
          data-info="${[name, price, stars, kitchen]}">
          <img src="${image}" alt="image" class="card-image" />
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">${name}</h3>
              <span class="card-tag tag">${timeOfDelivery} мин</span>
            </div>
            <!-- /.card-heading -->
            <div class="card-info">
              <div class="rating">
              ${stars}
              </div>
              <div class="price">От ${price} ₽</div>
              <div class="category">${kitchen}</div>
            </div>    
          </div>
        </a>
                  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

function createcardGood({
  description,
  id,
  image,
  name,
  price
}) {
  //console.log(goods);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `       
                  <img src="${image}" alt="${name}" class="card-image" />
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title card-title-reg">${name}</h3>
                    </div>
                    <div class="card-info">
                      <div class="ingredients">${description}
                      </div>
                    </div>
                    <div class="card-buttons">
                      <button class="button button-primary button-add-cart" id="${id}">
                        <span class="button-card-text">В корзину</span>
                        <span class="button-cart-svg"></span>
                      </button>
                      <strong class="card-price card-price-bold">${price} ₽</strong>
                    </div>
                  </div>
  `;

  cardsMenu.insertAdjacentElement('beforeend', card);

}

function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest('.card-restaurant');

  if (login) {
    if (restaurant) {
      const info = restaurant.dataset.info.split(',');
      const [name, price, stars, kitchen] = info;

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = 'От ' + price + ' P'; // ` От ${price} Рублей`
      category.textContent = kitchen;


      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createcardGood);
      });

      //console.log(restaurant);
    }
  } else {
    toogleModalAuth();

  }
}

//добавим в корзину
function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    //console.log(title, cost, id);
    const food = cart.find(function (item) {
      return item.id === id;
    })

    // console.log(food);
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
  saveCart();
}


// console.log(cart);
function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function ({
    id,
    title,
    cost,
    count
  }) {
    const itemCart = `
               <div class="food-row">
                  <span class="food-name">${title}</span>
                  <strong class="food-price">${cost}</strong>
                  <div class="food-counter">
                    <button class="counter-button counter-minus" data-id=${id}>-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button counter-plus" data-id=${id}>+</button>
                  </div>
                </div>  
  `;

    modalBody.insertAdjacentHTML('beforeend', itemCart);

  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost)) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' Руб';

}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains('counter-minus')) {
      food.count--;

      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();
  }

  saveCart();
}



function init() {


  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardrestaurant)
  });

  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })
  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });
  cardsMenu.addEventListener('click', addToCart);
  close.addEventListener("click", toggleModal);

  checkAuth();


};

init();