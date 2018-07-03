'use strict';

(function () {
  var formElement = document.querySelector('.ad-form');
  var successElement = document.querySelector('.success');
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

  var renderSuccess = function () {
    successElement.classList.remove('hidden');
    document.addEventListener('keydown', onSuccessPressEsc);
  };

  var onLoad = function () {
    renderSuccess();
  };

  window.onFormSubmit = function (evt) {
    var formData = new FormData(formElement);
    window.backEnd.upLoad(formData, onLoad, window.onError);
    evt.preventDefault();

  };

  var closeSuccessElement = function () {
    successElement.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessPressEsc);
  };

  var onSuccessPressEsc = function (evt) {
    if (window.isEscKeycode(evt)) {
      closeSuccessElement();
      window.deactivatePage();
    }
  };

})();
