'use strict';

(function () {
  var Price = {
    middleMin: 10000,
    middleMax: 50000,
    low: 10000,
    high: 50000
  };

  var FeaturesFilter = { /* это корректно? */
    wifi: document.querySelector('#filter-wifi'),
    dishwasher: document.querySelector('#filter-dishwasher'),
    parking: document.querySelector('#filter-parking'),
    washer: document.querySelector('#filter-washer'),
    elevator: document.querySelector('#filter-elevator'),
    conditioner: document.querySelector('#filter-conditioner')
  };

  var getBooleanWifi = function (list) {
    if (FeaturesFilter.wifi.checked) {
      var checkWifi = list.find(function (element) {
        return element === 'wifi';
      });
      return checkWifi;
    } else {
      return true;
    }
  };

  var getBooleanDishwasher = function (list) {
    if (FeaturesFilter.dishwasher.checked) {
      var checkDishwasher = list.find(function (element) {
        return element === 'dishwasher';
      });
      return checkDishwasher;
    } else {
      return true;
    }
  };

  var getBooleanParking = function (list) {
    if (FeaturesFilter.parking.checked) {
      var checkParking = list.find(function (element) {
        return element === 'parking';
      });
      return checkParking;
    } else {
      return true;
    }
  };

  var getBooleanWasher = function (list) {
    if (FeaturesFilter.washer.checked) {
      var checkWasher = list.find(function (element) {
        return element === 'washer';
      });
      return checkWasher;
    } else {
      return true;
    }
  };

  var getBooleanElevator = function (list) {
    if (FeaturesFilter.elevator.checked) {
      var checkElevator = list.find(function (element) {
        return element === 'elevator';
      });
      return checkElevator;
    } else {
      return true;
    }
  };

  var getBooleanConditioner = function (list) {
    if (FeaturesFilter.conditioner.checked) {
      var checkConditioner = list.find(function (element) {
        return element === 'conditioner';
      });
      return checkConditioner;
    } else {
      return true;
    }
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
    var currentData = cloneData
       .filter(function (it) {
         return it.offer.type === filterData.type || filterData.type === 'any';
       })
      .filter(function (it) {
        return getBooleanPrice(filterData.price, it.offer.price) || filterData.price === 'any';
      })
       .filter(function (it) {
         return +(it.offer.rooms) === Number(filterData.rooms) || filterData.rooms === 'any';
       })
       .filter(function (it) {
         return it.offer.guests === Number(filterData.guests) || filterData.guests === 'any';
       })
      .filter(function (it) {
        return it.offer.guests === Number(filterData.guests) || filterData.guests === 'any';
      })
      .filter(function (it) {
        return getBooleanWifi(it.offer.features);
      })
      .filter(function (it) {
        return getBooleanDishwasher(it.offer.features);
      })
      .filter(function (it) {
        return getBooleanParking(it.offer.features);
      })
      .filter(function (it) {
        return getBooleanWasher(it.offer.features);
      })
      .filter(function (it) {
        return getBooleanElevator(it.offer.features);
      })
      .filter(function (it) {
        return getBooleanConditioner(it.offer.features);
      });
    return currentData;


  };
})();

