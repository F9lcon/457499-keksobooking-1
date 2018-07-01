'use strict';

(function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 84;
  var ESC_KEYCODE = 27;

  var mapElement = document.querySelector('.map');
  var templateElement = document.querySelector('template')
    .content;
  var filterContainerElement = document.querySelector('.map__filters-container');
  var fieldsetElements = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  window.pinsListElement = document.querySelector('.map__pins'); /* сделал глобальной что бы не повторять в других модулях. или нужно полноценный экспорт делать с изменением названия модуля? */
  var formElement = document.querySelector('.ad-form');
  var pinMainElement = document.querySelector('.map__pin--main');

  var COORDS_MAP = {
    top: 162,
    left: 0,
    right: 1167,
    bottom: 706
  };

  var typesNames = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  window.isEscKeycode = function (evt) { /* с этим тоже не до конца понимаю. модуль map.js. но при этом отсюда есть экспорт функции. нужно ли менять название файла? */
    return evt.keyCode === ESC_KEYCODE;
  };

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
    for (var i = 0; i < window.similarItems.length; i++) {
      fragment.appendChild(renderSimilarPins(window.similarItems[i], i));
    }
    window.pinsListElement.appendChild(fragment);
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

  window.deactivatePage = function () { /* перенес сюда часть из конца которая перегружает страницу что бы брать отсюда только функцию по деактивации страницы. и снова непонятки по поводу именования файла */
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = true;
    }
    formElement.reset();
    pinMainElement.style.left = 570 + 'px';
    pinMainElement.style.top = 375 + 'px';
    inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_WIDTH / 2)
      + ', ' + (pinMainElement.offsetTop + MAIN_PIN_HEIGHT / 2);
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    for (var j = window.pinsListElement.children.length - 1; j >= 0; j--) {
      var currentElement = window.pinsListElement.children[j];
      if (currentElement.classList.contains('map__pin') && !currentElement.classList.contains('map__pin--main')) {
        window.pinsListElement.removeChild(currentElement);
      }
    }
    pinMainElement.addEventListener('mouseup', onPinMainElementMouseup);
  };

  window.deactivatePage();

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
    window.pinsListElement.addEventListener('click', onPinsElementClick);
    formElement.addEventListener('submit', window.onFormSubmit);
  };

  var onPinsElementClick = function (evt) {
    if (evt.target.dataset.index) {
      var currentIndex = evt.target.dataset.index;
      pushCard(window.similarItems[currentIndex]);
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
    if (window.isEscKeycode(evt)) {
      closePopup();
    }
  };
})();
