'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var types = ['palace', 'flat', 'house', 'bungalo'];
var checkTimes = ['12:00', '13:00', '14:00'];
var features = [
  'wifi',
  ' dishwasher',
  ' parking',
  ' washer',
  ' elevator',
  ' conditioner'
];
var mapElement = document.querySelector('.map');
var templateElement = document.querySelector('template')
  .content;
var filterContainerElement = document.querySelector('.map__filters-container');
var pinsListElement = document.querySelector('.map__pins');


var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getFeatures = function () {
  var featureList = [];
  for (var i = 0; i <= getRandomValue(0, 5); i++) {
    featureList.push(features[i]);
  }
  return featureList;
};

var getPhotoItems = function () {
  var photoItems = [];
  for (var i = 1; i <= 3; i++) {
    photoItems.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return photoItems;
};

var getType = function (card, place) {
  if (place.offer.type === 'flat') {
    card.querySelector('.popup__type').textContent = 'Квартира';
  } else if (place.offer.type === 'bungalo') {
    card.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (place.offer.type === 'house') {
    card.querySelector('.popup__type').textContent = 'Дом';
  } else if (place.offer.type === 'palace') {
    card.querySelector('.popup__type').textContent = 'Дворец';
  }
};

var getSimilarItems = function () {
  var items = [];
  for (var i = 0; i < 8; i++) {
    items[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titles[i],
        addres: getRandomValue(100, 800) + ', ' + getRandomValue(100, 400),
        price: getRandomValue(1000, 1000000),
        type: types[getRandomValue(0, 3)],
        rooms: getRandomValue(1, 5),
        guests: getRandomValue(1, 15),
        checkin: checkTimes[getRandomValue(0, 2)],
        checkout: checkTimes[getRandomValue(0, 2)],
        features: getFeatures(),
        description: ' ',
        photos: getPhotoItems()
      },
      location: {
        x: getRandomValue(300, 900),
        y: getRandomValue(130, 630)
      }
    };
  }
  return items;
};

var similarItems = getSimilarItems();

document.querySelector('.map').classList.remove('map--faded');

var renderSimilarPins = function (item) {
  var pinElement = templateElement.querySelector('.map__pin').cloneNode(true);
  pinElement.style.left = item.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = item.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = item.author.avatar;
  pinElement.querySelector('img').alt = item.offer.title;
  return pinElement;
};

var pushPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarItems.length; i++) {
    fragment.appendChild(renderSimilarPins(similarItems[i]));
  }
  pinsListElement.appendChild(fragment);
};

pushPins();

var renderMap = function (item) {
  var itemElement = templateElement.querySelector('.map__card').cloneNode(true);
  itemElement.querySelector('.popup__title').textContent = item.offer.title;
  itemElement.querySelector('.popup__text--address').textContent = item.offer.addres;
  itemElement.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
  itemElement.querySelector('.popup__text--capacity').textContent = 'Заезд после '
    + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  itemElement.querySelector('.popup__type').textContent = getType(itemElement, item);
  itemElement.querySelector('.popup__features').textContent = item.offer.features;
  itemElement.querySelector('.popup__description').textContent = item.offer.description;
  itemElement.querySelector('.popup__photos').removeChild(itemElement
    .querySelector('.popup__photo'));

  for (var i = 0; i < 3; i++) { /* Есть ли смысл выносить этот цикл в отдельную функцию? */
    itemElement.querySelector('.popup__photos').insertAdjacentHTML('afterbegin',
        '<img src="" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    itemElement.querySelector('.popup__photo').src = item.offer.photos[i];
  }
  return itemElement;
};

var pushMap = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 1; i++) {
    fragment.appendChild(renderMap(similarItems[i]));
  }
  mapElement.insertBefore(fragment, filterContainerElement);
};

pushMap();
