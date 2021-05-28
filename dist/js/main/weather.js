"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = weatherInit;

var _config = require("../config.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var COORDS = 'coords';
var API_KEY = _config.config.API_KEY;
var weather = document.querySelector('.js-date');

function getWeather(_x, _x2) {
  return _getWeather.apply(this, arguments);
}

function _getWeather() {
  _getWeather = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(lat, lng) {
    var endpoint, response, temp, place;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("https://api.openweathermap.org/data/2.5/weather?lat=".concat(lat, "&lon=").concat(lng, "&appid=").concat(API_KEY, "&units=metric"));

          case 2:
            endpoint = _context.sent;
            _context.next = 5;
            return endpoint.json();

          case 5:
            response = _context.sent;
            temp = Math.floor(response.main.temp);
            place = response.name;
            weather.innerHTML = "<i class=\"fas fa-map-marker-alt\"></i> ".concat(place, ", ").concat(temp, "\u2103");

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getWeather.apply(this, arguments);
}

function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var coordsObj = {
    latitude: latitude,
    longitude: longitude
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
}

function handleGeoError() {
  console.log("Can't Access Geo location");
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
  var loadedCords = localStorage.getItem(COORDS);

  if (loadedCords === null) {
    askForCoords();
  } else {
    var parseCoords = JSON.parse(loadedCords);
    getWeather(parseCoords.latitude, parseCoords.longitude);
  }
}

function weatherInit() {
  loadCoords();
}