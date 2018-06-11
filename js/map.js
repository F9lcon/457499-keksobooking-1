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

var typesNames = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

var mapElement = document.querySelector('.map');
var templateElement = document.querySelector('template')
  .content;
var filterContainerElement = document.querySelector('.map__filters-container');
var pinsListElement = document.querySelector('.map__pins');


var getRandomValue = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getFeatures = function () {
  var featureList = [];
  var countFeature = getRandomValue(0, 5); /* а если так? одно вычисление за вызов функции  */
  for (var i = 0; i <= countFeature; i++) {
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

var getLocation = function () { /* спустя два дня раздумий я додумался только до этого */
  var locationXY = [];
  locationXY.push(getRandomValue(300, 900));
  locationXY.push(getRandomValue(130, 630));
  return locationXY;
};

var locationXY = getLocation();

var getSimilarItems = function () {
  var items = [];
  for (var i = 0; i < 8; i++) {
    items[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: titles[i],
        address: locationXY[0] + ', ' + locationXY[1],
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
        x: locationXY[0],
        y: locationXY[1]
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
  itemElement.querySelector('.popup__text--address').textContent = item.offer.address;
  itemElement.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
  itemElement.querySelector('.popup__text--capacity').textContent = 'Заезд после '
    + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  itemElement.querySelector('.popup__type').textContent = typesNames[item.offer.type];
  itemElement.querySelector('.popup__features').textContent = item.offer.features;
  itemElement.querySelector('.popup__description').textContent = item.offer.description;
  itemElement.querySelector('.popup__photos').removeChild(itemElement
    .querySelector('.popup__photo'));

  for (var i = 0; i < 3; i++) {
    var photoElement = document.createElement('img');
    photoElement.src = item.offer.photos[i];
    photoElement.classList.add('popup__photo');
    photoElement.width = 45;
    photoElement.height = 40;
    photoElement.alt = 'Фотография жилья';
    itemElement.querySelector('.popup__photos').insertBefore(photoElement, null);
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
