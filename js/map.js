'use strict';

(function () {
  var PIN_HALF_WIDTH = 25;
  var PIN_HEIGHT = 69;
  var MAIN_PIN_HALF_WIDTH = 33;
  var MAIN_PIN_HEIGHT = 81;
  var MAIN_PIN_HALF_HEIGHT = 42;
  var ESC_KEYCODE = 27;
  var MAIN_PIN_START_X = 570;
  var MAIN_PIN_START_Y = 375;

  var Limit = {
    TOP: 130 - MAIN_PIN_HEIGHT,
    LEFT: 0 - MAIN_PIN_HALF_WIDTH,
    RIGHT: 1200 - MAIN_PIN_HALF_WIDTH,
    BOTTOM: 630 - MAIN_PIN_HEIGHT
  };

  var mapElement = document.querySelector('.map');
  var templateElement = document.querySelector('template').content;
  var pinsListElement = document.querySelector('.map__pins');
  var fieldsetElements = document.querySelectorAll('fieldset');
  var inputAddressElement = document.querySelector('#address');
  var formElement = document.querySelector('.ad-form');
  var pinMainElement = document.querySelector('.map__pin--main');
  var formFilter = document.querySelector('#map__filters');
  var resetButton = document.querySelector('.ad-form__reset');


  window.isEscKeycode = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var renderSimilarPins = function (item) {
    var pinElement = templateElement.querySelector('.map__pin').cloneNode(true);
    pinElement.style.left = item.location.x - PIN_HALF_WIDTH + 'px';
    pinElement.style.top = item.location.y - PIN_HEIGHT + 'px'; /* пиксель следующий за окончанием метки является искомой точкой */
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
    for (var i = pinsListElement.children.length - 1; i >= 0; i--) {
      var currentElement = pinsListElement.children[i];
      if (currentElement.classList.contains('map__pin') && !currentElement
        .classList.contains('map__pin--main')) {
        pinsListElement.removeChild(currentElement);
      }
    }
  };

  var onFilterChange = window.debounce(function () {
    window.closePopup();
    removePins();
    var updatedSimilarItems = window.setFilters(window.similarItems);
    pushPins(updatedSimilarItems.slice(0, 5));
  });

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
    resetButton.removeEventListener('click', window.onResetClick);
    pinMainElement.addEventListener('mouseup', onPinMainElementMouseup);
    formFilter.removeEventListener('change', onFilterChange);
    pinsListElement.removeEventListener('click', onPinsElementClick);

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
    formFilter.addEventListener('change', onFilterChange);
    resetButton.addEventListener('click', window.onResetClick);
  };

  window.deactivatePage();

  var setAddress = function () {
    inputAddressElement.value = (pinMainElement.offsetLeft + MAIN_PIN_HALF_WIDTH)
      + ', ' + (pinMainElement.offsetTop + MAIN_PIN_HEIGHT);
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
    var startClickCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var startPinCoords = {
      x: pinMainElement.offsetLeft,
      y: pinMainElement.offsetTop
    };

    var onMouseMove = function (moveEvt) {
      evt.preventDefault();
      var shift = {
        x: startClickCoords.x - moveEvt.clientX,
        y: startClickCoords.y - moveEvt.clientY
      };

      var newCoords = {
        x: startPinCoords.x - shift.x,
        y: startPinCoords.y - shift.y
      };
      newCoords.x = Math.min(Limit.RIGHT, Math.max(Limit.LEFT, newCoords.x));
      newCoords.y = Math.min(Limit.BOTTOM, Math.max(Limit.TOP, newCoords.y));
      pinMainElement.style.top = newCoords.y + 'px';
      pinMainElement.style.left = newCoords.x + 'px';
      setAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.backend.download(onLoad, window.onError);
      setAddress();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.closePopup = function () {
    var activeCard = mapElement.querySelector('.map__card');
    if (activeCard) {
      mapElement.removeChild(activeCard);
    }
    document.removeEventListener('keydown', onCloseButtonPressEsc);
  };

  var onCloseButtonClick = function () {
    window.closePopup();
  };

  var onCloseButtonPressEsc = function (evt) {
    if (window.isEscKeycode(evt)) {
      window.closePopup();
    }
  };
})();


