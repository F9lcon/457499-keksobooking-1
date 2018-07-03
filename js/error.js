'use strict';

(function () {
  var ERROR_Y = 0;
  var ERROR_X = 0;
  var ERROR_WIDTH = 100;
  var ERROR_HEIGHT = 30;
  var COLOR_RED = 'rgba(255, 86, 53, 0.7)';
  var COLOR_WHITE = '#fff';
  var ERROR_PADDING_TOP = 5;
  var ERROR_HIDE_DELAY = 3400;

  window.onError = function (message) {
    var errorElement = document.createElement('div');
    errorElement.innerText = message;
    errorElement.style.position = 'fixed';
    errorElement.style.top = ERROR_Y;
    errorElement.style.left = ERROR_X;
    errorElement.style.width = ERROR_WIDTH + '%';
    errorElement.style.height = ERROR_HEIGHT + 'px';
    errorElement.style.backgroundColor = COLOR_RED;
    errorElement.style.color = COLOR_WHITE;
    errorElement.style.textAlign = 'center';
    errorElement.style.paddingTop = ERROR_PADDING_TOP + 'px';
    document.querySelector('body').appendChild(errorElement);
    var hideError = function () {
      errorElement.classList.add('hidden');
    };
    setTimeout(hideError, ERROR_HIDE_DELAY);
  };
})();


