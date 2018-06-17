'use strict';


var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var MAIN_PIN_WIDTH = 40;
var MAIN_PIN_HEIGHT = 44;
var POINTER_PIN_HEIGHT = 22;
var ESC_KEYCODE = 27;

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
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
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
var formElement = document.querySelector('.ad-form');
var fieldsetElements = formElement.querySelectorAll('fieldset');
var pinMainElement = document.querySelector('.map__pin--main');
var inputAddressElement = formElement.querySelector('#address');

var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getFeatures = function () {
  var featureList = [];
  var countFeature = getRandomValue(0, 5);
  featureList = features.slice(0, countFeature + 1);
  return featureList;
};

var getPhotoItems = function () {
  var photoItems = [];
  for (var i = 1; i <= 3; i++) {
    photoItems.push('http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg');
  }
  return photoItems;
};

var getLocation = function () {
  var locationXY = [];
  locationXY.push(getRandomValue(300, 900));
  locationXY.push(getRandomValue(130, 630));
  return locationXY;
};

var getSimilarItems = function () {
  var items = [];
  for (var i = 0; i < 8; i++) {
    var locationXY = getLocation();
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

var renderSimilarPins = function (item, i) {
  var pinElement = templateElement.querySelector('.map__pin').cloneNode(true);
  pinElement.style.left = item.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = item.location.y - PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = item.author.avatar;
  pinElement.querySelector('img').alt = item.offer.title;
  pinElement.dataset.index = i;
  pinElement.children[0].dataset.index = i;
  return pinElement;
};

var pushPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarItems.length; i++) {
    fragment.appendChild(renderSimilarPins(similarItems[i], i));
  }
  pinsListElement.appendChild(fragment);
};

var renderCard = function (item) {
  var itemElement = templateElement.querySelector('.map__card').cloneNode(true);
  var featuresListElement = itemElement.querySelector('.popup__features');
  itemElement.querySelector('.popup__title').textContent = item.offer.title;
  itemElement.querySelector('.popup__text--address').textContent = item.offer.address;
  itemElement.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
  itemElement.querySelector('.popup__text--capacity').textContent = 'Заезд после '
    + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  itemElement.querySelector('.popup__type').textContent = typesNames[item.offer.type];
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

  while (featuresListElement.firstChild) {
    featuresListElement.removeChild(featuresListElement.firstChild);
  }

  for (var j = 0; j < item.offer.features.length; j++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + item.offer.features[j]);
    featuresListElement.insertBefore(featureElement, null);
  }
  return itemElement;
};

var pushCard = function (item) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderCard(item));
  if (mapElement.querySelector('.map__card')) {
    mapElement.replaceChild(fragment, mapElement.querySelector('.map__card'));
  } else {
    mapElement.insertBefore(fragment, filterContainerElement);
  }
};

var getInactivePage = function () {
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = true;
  }
  inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_WIDTH / 2)
    + ', ' + (pinMainElement.offsetTop - MAIN_PIN_HEIGHT / 2);
};

getInactivePage();

var getActivePage = function () {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = false;
  }
  inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_WIDTH / 2)
    + ', ' + (pinMainElement.offsetTop + POINTER_PIN_HEIGHT);
  pinMainElement.removeEventListener('mouseup', onPinMainElementMouseup);
  pushPins();
  pinsListElement.addEventListener('click', onPinsElementClick);

};

var onPinsElementClick = function (evt) {
  if (evt.target.dataset.index) {
    var currentIndex = evt.target.dataset.index;
    pushCard(similarItems[currentIndex]);
  }
  if (document.querySelector('.popup__close')) { /* при загрузке кода в консоли выдает ошибку что не может найти popup__close если нет проверки. как то криво, но лучше решения не нашел */
    document.querySelector('.popup__close').addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onCloseButtonPressEsc);
  }
};

var onPinMainElementMouseup = function () {
  getActivePage();
};

pinMainElement.addEventListener('mouseup', onPinMainElementMouseup);


var closePopup = function () {
  mapElement.removeChild(mapElement.querySelector('.map__card'));
  document.removeEventListener('keydown', onCloseButtonPressEsc);
};

var onCloseButtonClick = function () {
  closePopup();
};

var onCloseButtonPressEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};
