'use strict';

(function () {

  var typeName = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var filterContainerElement = document.querySelector('.map__filters-container');
  var mapElement = document.querySelector('.map');
  var templateElement = document.querySelector('template').content;

  var renderCard = function (item) {
    var itemElement = templateElement.querySelector('.map__card').cloneNode(true);
    var featuresListElement = itemElement.querySelector('.popup__features');
    itemElement.querySelector('.popup__avatar').src = item.author.avatar;
    itemElement.querySelector('.popup__title').textContent = item.offer.title;
    itemElement.querySelector('.popup__text--address').textContent = item.offer.address;
    itemElement.querySelector('.popup__text--price').textContent = item.offer.price + ' ₽/ночь';
    itemElement.querySelector('.popup__text--time').textContent = 'Заезд после '
      + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    itemElement.querySelector('.popup__text--capacity').textContent = item.offer.rooms
      + ' комнат для ' + item.offer.guests + ' гостей';
    itemElement.querySelector('.popup__type').textContent = typeName[item.offer.type];
    itemElement.querySelector('.popup__description').textContent = item.offer.description;
    itemElement.querySelector('.popup__photos').removeChild(itemElement
      .querySelector('.popup__photo'));

    for (var i = 0; i < item.offer.photos.length; i++) {
      var photoElement = document.createElement('img');
      photoElement.src = item.offer.photos[i];
      photoElement.classList.add('popup__photo');
      photoElement.width = 45;
      photoElement.height = 40;
      photoElement.alt = 'Фотография жилья';
      itemElement.querySelector('.popup__photos').insertBefore(photoElement, null);
    }

    featuresListElement.innerText = '';

    for (var j = 0; j < item.offer.features.length; j++) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');
      featureElement.classList.add('popup__feature--' + item.offer.features[j]);
      featuresListElement.insertBefore(featureElement, null);
    }
    return itemElement;
  };

  window.pushCard = function (item) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderCard(item));
    if (mapElement.querySelector('.map__card')) {
      mapElement.replaceChild(fragment, mapElement.querySelector('.map__card'));
    } else {
      mapElement.insertBefore(fragment, filterContainerElement);
    }
  };

})();
