'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 84;
var ESC_KEYCODE = 27;
var COORDS_MAP = {
  top: 162,
  left: 0,
  right: 1167,
  bottom: 706
};

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
var successElement = document.querySelector('.success');

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

var deactivatePage = function () {
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = true;
  }

  inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_WIDTH / 2)
    + ', ' + (pinMainElement.offsetTop - MAIN_PIN_HEIGHT / 2);
};

deactivatePage();

var setAddress = function () {
  inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_WIDTH / 2)
    + ', ' + (pinMainElement.offsetTop + MAIN_PIN_HEIGHT);
};

var activatePage = function () {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = false;
  }

  pushPins();
  pinsListElement.addEventListener('click', onPinsElementClick);
  formElement.addEventListener('submit', onFormSubmit);
};


var onPinsElementClick = function (evt) {
  if (evt.target.dataset.index) {
    var currentIndex = evt.target.dataset.index;
    pushCard(similarItems[currentIndex]);
  }
  if (document.querySelector('.popup__close')) {
    document.querySelector('.popup__close').addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onCloseButtonPressEsc);
  }
};

var onPinMainElementMouseup = function () {
  activatePage();
};


pinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  activatePage();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    evt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var limits = {
      top: COORDS_MAP.top - MAIN_PIN_HEIGHT,
      left: COORDS_MAP.left - MAIN_PIN_WIDTH / 2,
      right: COORDS_MAP.right,
      bottom: COORDS_MAP.bottom - MAIN_PIN_HEIGHT
    };

    pinMainElement.style.top = (pinMainElement.offsetTop - shift.y) + 'px';
    pinMainElement.style.left = (pinMainElement.offsetLeft - shift.x) + 'px';
    if (pinMainElement.offsetLeft <= limits.left) {
      pinMainElement.style.left = (limits.left) + 'px';
    } else if (pinMainElement.offsetTop <= limits.top) {
      pinMainElement.style.top = (limits.top) + 'px';
    } else if (pinMainElement.offsetLeft >= limits.right) {
      pinMainElement.style.left = (limits.right) + 'px';
    } else if (pinMainElement.offsetTop >= limits.bottom) {
      pinMainElement.style.top = (limits.bottom) + 'px';
    }

    setAddress();
  };

  var onMouseUp = function (UpEvt) {
    UpEvt.preventDefault();
    setAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);


});


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

var setMinimalPrice = function () {
  var inputTypeElement = document.querySelector('#type');
  var inputPriceElement = document.querySelector('#price');
  inputTypeElement.addEventListener('change', function () {
    if (inputTypeElement.value === 'bungalo') {
      inputPriceElement.min = 0;
      inputPriceElement.placeholder = 0;
    } else if (inputTypeElement.value === 'flat') {
      inputPriceElement.min = 1000;
      inputPriceElement.placeholder = 1000;
    } else if (inputTypeElement.value === 'house') {
      inputPriceElement.min = 5000;
      inputPriceElement.placeholder = 5000;
    } else if (inputTypeElement.value === 'palace') {
      inputPriceElement.min = 10000;
      inputPriceElement.placeholder = 10000;
    }
  });
};

setMinimalPrice();

var setRoomNubmer = function () {
  var inputRoomNumberElement = document.querySelector('#room_number');
  var capacityElement = document.querySelector('#capacity');
  inputRoomNumberElement.addEventListener('change', function () {
    if (inputRoomNumberElement.value === '1') {
      capacityElement[0].disabled = true;
      capacityElement[1].disabled = true;
      capacityElement[2].selected = true;
      capacityElement[3].disabled = true;
    } else if (inputRoomNumberElement.value === '2') {
      capacityElement[0].disabled = true;
      capacityElement[1].disabled = false;
      capacityElement[2].disabled = false;
      capacityElement[3].disabled = true;
      capacityElement[2].selected = true;
    } else if (inputRoomNumberElement.value === '3') {
      capacityElement[0].disabled = false;
      capacityElement[1].disabled = false;
      capacityElement[2].disabled = false;
      capacityElement[3].disabled = true;
      capacityElement[2].selected = true;
    } else if (inputRoomNumberElement.value === '100') {
      capacityElement[0].disabled = true;
      capacityElement[1].disabled = true;
      capacityElement[2].disabled = true;
      capacityElement[3].disabled = false;
      capacityElement[3].selected = true;
    }
  });
};
setRoomNubmer();

var setTimeInOut = function () {
  var timeInElement = document.querySelector('#timein');
  var timeOutElement = document.querySelector('#timeout');

  timeInElement.addEventListener('change', function () {
    timeOutElement.value = timeInElement.value;
  });

  timeOutElement.addEventListener('change', function () {
    timeInElement.value = timeOutElement.value;
  });
};

setTimeInOut();

var closeSuccessElement = function () {
  successElement.classList.add('hidden');
  document.removeEventListener('keydown', onSuccessPressEsc);
};

var onSuccessPressEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeSuccessElement();
    formElement.reset();
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    for (var i = pinsListElement.children.length - 1; i >= 0; i--) {
      var currentElement = pinsListElement.children[i];
      if (currentElement.classList.contains('map__pin') && !currentElement.classList.contains('map__pin--main')) {
        pinsListElement.removeChild(currentElement);
      }
    }
    pinMainElement.style.left = 570 + 'px';
    pinMainElement.style.top = 375 + 'px';
    pinMainElement.addEventListener('mouseup', onPinMainElementMouseup);
  }
};

var renderSuccess = function () {
  successElement.classList.remove('hidden');
  document.addEventListener('keydown', onSuccessPressEsc);
};

var onFormSubmit = function (evt) {
  evt.preventDefault();
  renderSuccess();
};


