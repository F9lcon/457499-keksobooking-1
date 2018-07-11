'use strict';

(function () {
  var features = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var Price = {
    middleMin: 10000,
    middleMax: 50000,
    low: 10000,
    high: 50000
  };

  var featuresFilter = {
    wifi: document.querySelector('#filter-wifi'),
    dishwasher: document.querySelector('#filter-dishwasher'),
    parking: document.querySelector('#filter-parking'),
    washer: document.querySelector('#filter-washer'),
    elevator: document.querySelector('#filter-elevator'),
    conditioner: document.querySelector('#filter-conditioner')
  };

  var getBooleanPrice = function (settedPrice, itPrice) {
    if (settedPrice === 'low') {
      return itPrice <= Price.low;
    } else if (settedPrice === 'high') {
      return itPrice >= Price.high;
    } else if (settedPrice === 'middle') {
      return (Price.middleMin <= itPrice) & (itPrice <= Price.middleMax);
    }
    return true;
  };


  window.setFilters = function (data) {
    var filterElement = document.querySelector('.map__filters');
    var filterData = {};
    var cloneData = data.slice();

    filterData.type = filterElement.querySelector('#housing-type').value;
    filterData.price = filterElement.querySelector('#housing-price').value;
    filterData.rooms = filterElement.querySelector('#housing-rooms').value;
    filterData.guests = filterElement.querySelector('#housing-guests').value;

    var checkType = function (it) {
      return it.offer.type === filterData.type || filterData.type === 'any';
    };

    var checkPrice = function (it) {
      return getBooleanPrice(filterData.price, it.offer.price) || filterData.price === 'any';
    };

    var checkRooms = function (it) {
      return +(it.offer.rooms) === Number(filterData.rooms) || filterData.rooms === 'any';
    };

    var checkGuests = function (it) {
      return it.offer.guests === Number(filterData.guests) || filterData.guests === 'any';
    };

    var getBoolean = function (it, value) {
      var check = it.offer.features.find(function (element) {
        return element === value;
      });
      return check;
    };

    var filterFeatures = function (it) {
      return features.every(function (feature) {
        return !featuresFilter[feature].checked || getBoolean(it, feature);
      });
    };

    var currentData = cloneData
       .filter(checkType)
      .filter(checkPrice)
       .filter(checkRooms)
       .filter(checkGuests)
      .filter(filterFeatures);
    return currentData;
  };
})();

