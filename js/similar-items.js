'use strict';

(function () {
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

  window.similarItems = getSimilarItems();

})();
