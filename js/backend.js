'use strict';

(function () {
  window.backEnd = {
    downLoad: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Статус ответ ' + xhr.status + ' ' + xhr.statusText);
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 1000;

      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    },
    upLoad: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad();
        } else {
          onError('Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Статус ответ ' + xhr.status + ' ' + xhr.statusText);
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 1000;

      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    }
  };
  var onLoad = function (data) {
    window.similarItems = data;
  };
  window.onError = function (message) {
    var errorElement = document.createElement('div');
    errorElement.innerText = message;
    errorElement.style.position = 'fixed';
    errorElement.style.top = 0;
    errorElement.style.left = 0;
    errorElement.style.width = 100 + '%';
    errorElement.style.height = 30 + 'px';
    errorElement.style.backgroundColor = 'rgba(255, 86, 53, 0.7)';
    errorElement.style.color = '#fff';
    errorElement.style.textAlign = 'center';
    errorElement.style.paddingTop = 5 + 'px';
    document.querySelector('body').appendChild(errorElement);
    var hideError = function () {
      errorElement.classList.add('hidden');
    };
    setTimeout(hideError, 3400);
  };
  window.backEnd.downLoad(onLoad, window.onError);
})();
