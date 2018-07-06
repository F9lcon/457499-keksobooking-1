'use strict';

/* пожалуйста не ругайтесьс сильно.. чуть чуть не хватило времени исправить баг с отображением
дополнительных пинов по нажатию на мэин пин после применения фильтров. к финальной проверке
все сделаю в лучшем виде, включая устранение дребезга. */

(function () {
  var PIN_HALF_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var MAIN_PIN_HALF_WIDTH = 31;
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_HALF_HEIGHT = 42;
  var ESC_KEYCODE = 27;
  var MAIN_PIN_START_X = 570;
  var MAIN_PIN_START_Y = 375;
  var COORDS_MAP = {
    top: 162,
    left: 0,
    right: 1167,
    bottom: 706
  };

  var mapElement = document.querySelector('.map');
  var templateElement = document.querySelector('template').content;
  var pinsListElement = document.querySelector('.map__pins');
  var fieldsetElements = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var formElement = document.querySelector('.ad-form');
  var pinMainElement = document.querySelector('.map__pin--main');
  var formFilter = document.querySelector('#map__filters');

  window.isEscKeycode = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var renderSimilarPins = function (item) {
    var pinElement = templateElement.querySelector('.map__pin').cloneNode(true);
    pinElement.style.left = item.location.x - PIN_HALF_WIDTH + 'px';
    pinElement.style.top = item.location.y - PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = item.author.avatar;
    pinElement.querySelector('img').alt = item.offer.title;
    pinElement.children[0].dataset.index = item.index;
    pinElement.dataset.index = item.index;
    return pinElement;
  };

  var pushPins = function (items) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < items.length; i++) {
      fragment.appendChild(renderSimilarPins(items[i]));
    }
    pinsListElement.appendChild(fragment);
  };

  var removePins = function () {
    for (var j = pinsListElement.children.length - 1; j >= 0; j--) {
      var currentElement = pinsListElement.children[j];
      if (currentElement.classList.contains('map__pin') && !currentElement
        .classList.contains('map__pin--main')) {
        pinsListElement.removeChild(currentElement);
      }
    }
  };

  var updatePins = function () {
    removePins();
    var updatedSimilarItems = window.setFilters(window.similarItems);
    pushPins(updatedSimilarItems.slice(0, 5));
  };

  var onLoad = function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].index = i;
    }
    window.similarItems = data;
    activatePage();
  };

  window.deactivatePage = function () {
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = true;
    }
    formElement.reset();
    pinMainElement.style.left = MAIN_PIN_START_X + 'px';
    pinMainElement.style.top = MAIN_PIN_START_Y + 'px';
    inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_HALF_WIDTH)
      + ', ' + (pinMainElement.offsetTop + MAIN_PIN_HALF_HEIGHT);
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    removePins();
    pinMainElement.addEventListener('mouseup', onPinMainElementMouseup);
  };

  window.deactivatePage();

  var setAddress = function () {
    inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_HALF_WIDTH)
      + ', ' + (pinMainElement.offsetTop + MAIN_PIN_HEIGHT);
  };

  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = false;
    }

    pushPins(window.similarItems.slice(0, 5));
    pinsListElement.addEventListener('click', onPinsElementClick);
    formElement.addEventListener('submit', window.onFormSubmit);
    formFilter.addEventListener('change', updatePins);
  };

  var onPinsElementClick = function (evt) {
    if (evt.target.dataset.index) {
      var currentIndex = evt.target.dataset.index;
      window.pushCard(window.similarItems[currentIndex]);
    }
    if (document.querySelector('.popup__close')) {
      document.querySelector('.popup__close')
        .addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onCloseButtonPressEsc);
    }
  };

  var onPinMainElementMouseup = function () {
    window.backend.download(onLoad, window.onError);
    pinMainElement.removeEventListener('mouseup', onPinMainElementMouseup);
  };

  pinMainElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
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
        left: COORDS_MAP.left - MAIN_PIN_HALF_WIDTH,
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
      window.backend.download(onLoad, window.onError);
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


