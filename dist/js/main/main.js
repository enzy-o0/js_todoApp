"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMain = initMain;

var _weather = _interopRequireDefault(require("./weather.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* main.js 첫화면 */
var body = document.querySelector('body');
var clockSection = document.querySelector('.clock'),
    clockContainer = clockSection.querySelector('.js-clock'),
    clockTitle = clockContainer.querySelector('.js-title'),
    main = document.querySelector('.main');
/* 타이머 */

function getTimeFormat(time) {
  return "".concat(time < 10 ? "0".concat(time) : time);
}

function getTime() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  clockTitle.innerText = "".concat(ampm, " ").concat(getTimeFormat(hours), ":").concat(getTimeFormat(minutes), ":").concat(getTimeFormat(seconds));
}
/* 배경 그리기 */


function paintImage() {
  var date = new Date();
  var hours = date.getHours();
  var image = new Image();
  var imageNumber = 1;

  if (hours < 6 || hours > 20) {
    imageNumber = 3;
  } else if (hours <= 11) {
    imageNumber = 1;
  } else if (hours <= 17) {
    imageNumber = 2;
  } else if (hours <= 20) {
    imageNumber = 4;
  }

  image.src = "/src/img/".concat(imageNumber, ".jpg");
  image.classList.add('bgImage');
  body.appendChild(image);
}

var form = document.querySelector('.js-form'),
    input = form.querySelector('input'),
    greeting = document.querySelector('.js-greetings');
var USER_LS = "currentUser",
    SHOWING_CN = "showing";
/* 이름  */

function saveName(text) {
  localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) {
  event.preventDefault();
  var currentValue = input.value;
  paintGreeting(currentValue);
  saveName(currentValue);
}

function askForName() {
  form.classList.add(SHOWING_CN);
  form.addEventListener("submit", handleSubmit);
}

function paintGreeting(text) {
  form.classList.remove(SHOWING_CN);
  greeting.classList.add(SHOWING_CN);
  greeting.innerText = "Hello! ".concat(text, " \uD83D\uDD90 \n ").concat(paintGreetingCase());
  var goTodoBt = document.createElement('button');
  goTodoBt.innerText = 'Todo 리스트 적으러 가기 🎈';
  clockSection.append(goTodoBt);
  goTodoBt.onclick = onGoTodoBtClick;
}

function paintGreetingCase() {
  var greetingText = '';
  var paintDate = new Date();
  var paintHour = paintDate.getHours();

  if (paintHour <= 6) {
    greetingText = '적적한 새벽이야.';
  } else if (paintHour <= 11) {
    greetingText = '안녕. 좋은 아침이야! ';
  } else if (paintHour <= 17) {
    greetingText = '나른한 오후야. 커피 한잔 어때?';
  } else if (paintHour <= 20) {
    greetingText = '벌써 저녁이네. 오늘 하루는 어땠어?';
  } else {
    greetingText = '잘 시간이네. 고생 많았어!';
  }

  return greetingText;
}

function loadName() {
  var currentUser = localStorage.getItem(USER_LS);

  if (currentUser === null) {
    askForName();
  } else {
    paintGreeting(currentUser);
  }
}
/* Go TodoList */


function onGoTodoBtClick() {
  clockSection.classList.add('hideClock');
  main.classList.remove('invisible');
}

function initMain() {
  paintImage();
  getTime();
  setInterval(getTime, 1000);
  loadName();
  (0, _weather["default"])();
}