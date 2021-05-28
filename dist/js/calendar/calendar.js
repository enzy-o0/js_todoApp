"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = insertDaysInCalendar;

var _index = require("../index.js");

var _todolist = require("../todo/todolist.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//// 1. 달력 화면
// 1.1 달력 구조에 맞게 Set
var date = new Date();

function insertDaysInCalendar(todoItems, idx) {
  var viewYear = date.getFullYear();
  var viewMonth = date.getMonth();
  document.querySelector('.calendar-year-month').textContent = "".concat(viewYear, "\uB144 ").concat(viewMonth + 1, "\uC6D4");
  var prevLast = new Date(viewYear, viewMonth, 0);
  var thisLast = new Date(viewYear, viewMonth + 1, 0);
  var PLDay = prevLast.getDay();
  var TLDate = thisLast.getDate();
  var prevDates = [];

  var thisDates = _toConsumableArray(Array(TLDate + 1).keys()).slice(1);
  /* array를 생성하고, 배열의 인덱스를 키 값으로 가지는 새로운 Array Iterator 반환  */


  if (PLDay !== 6) {
    for (var i = 0; i < PLDay + 1; i++) {
      prevDates.push('');
    }
  } // innerHTML 속성이 보안에 취약 (XSS). -> 차선책 //TODO createDocumentFragment 

  /* const datesul = document.querySelector('.calendar .calendar-main .dates');
  while (datesul.firstChild) {
      datesul.removeChild(datesul.firstChild);
  } */


  var dates = prevDates.concat(thisDates);
  /* dateDiv = document.createElement('div');
      dateDiv.dataset.key = i;
      dateDiv.dataset.value = date;
      dateDiv.textContent = date;
      dateDiv.className = 'date';
      datesul.appendChild(dateDiv); */

  document.querySelector('.calendar .calendar-main .dates').innerHTML = dates.map(function (date, i) {
    return createDateHtmlString(date, i, idx);
  }).join(''); // 오늘 날짜 포커스

  var today = new Date();

  if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) {
    var tv = document.getElementsByClassName("date")[PLDay + today.getDate()];
    tv.classList.add('today');
  }

  if (todoItems !== undefined) {
    todoItems.forEach(function (todoItem, index) {
      if (viewYear == todoItem.clickDate.split(/[^0-9]/g)[0] && viewMonth + 1 == todoItem.clickDate.split(/[^0-9]/g)[1]) {
        var todoItemDate = todoItem.clickDate.split(/[^0-9]/g)[2];
        var isTodoDate = document.getElementById(todoItemDate);

        if (todoItemDate == isTodoDate.dataset.value) {
          isTodoDate.querySelector('.isTodo').classList.remove('invisible');
        }
      }
    });
  }
}

;

function createDateHtmlString(date, i, idx) {
  if (idx == date) {
    return "<div class=\"date clickDate\" data-key=\"".concat(i, "\" data-value=\"").concat(date, "\" id=\"").concat(date, "\">").concat(date, "<span class=\"isTodo invisible\"><i class=\"fas fa-heart\"></i></span></div>");
  } else {
    return "<div class=\"date\" data-key=\"".concat(i, "\" data-value=\"").concat(date, "\" id=\"").concat(date, "\">").concat(date, "<span class=\"isTodo invisible\"><i class=\"fas fa-heart\"></i></span></div>");
  }
} // 달력 이전달, 다음달 버튼 


function setClickPrevNextMonth(isPrev) {
  date.setMonth(date.getMonth() + isPrev);
  var getTodoItem = localStorage.getItem('todoItem');
  var getTodoItemJSON = JSON.parse(getTodoItem);

  if (getTodoItemJSON === null) {
    return;
  }

  insertDaysInCalendar(getTodoItemJSON);
}

var calendarPrevMonth = document.querySelector('.calendar-nav-btn.go-prev');
var calendarNextMonth = document.querySelector('.calendar-nav-btn.go-next');
var calendarDates = document.querySelector('.calendar .calendar-main .dates'); // 달력 이전달 버튼

calendarPrevMonth.addEventListener('click', function () {
  setClickPrevNextMonth(-1);
}); // 달력 다음달 버튼

calendarNextMonth.addEventListener('click', function () {
  setClickPrevNextMonth(1);
}); // 달력 날짜 버튼

calendarDates.addEventListener('click', function (event) {
  var clickDate = event.target;
  var clickDateValue = clickDate.dataset.value;
  var clickDateKey = clickDate.dataset.key;

  if (clickDateValue === '' || clickDateValue === undefined) {
    return;
  }

  calendarDateClick(clickDateKey);
  (0, _todolist.displayClickDateTodoAdd)(false);
  displayClickDateTodoList(true, clickDateValue);
  (0, _todolist.setTodoItemList)(_index.todoItemArr);
}); // 달력 날짜 버튼 클릭 - 이전에 선택된 날짜들 제거

function calendarDateClick(clickDateKey) {
  var clickedDateAll = calendarDates.querySelectorAll('.clickDate');
  clickedDateAll.forEach(function (clickedDate) {
    clickedDate.classList.remove('clickDate');
  });
  var calendarDate = calendarDates.children[clickDateKey];
  calendarDate.classList.add('clickDate');
} // 첫화면은 Calendar만, Date 클릭시 List 화면 보여짐


function displayClickDateTodoList(b) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getDate();
  var displayTodoList = document.querySelector('.todo');
  var displayClickDate = document.querySelector('.todo .todo_title .todo_click_day');
  displayClickDate.textContent = "".concat(date.getFullYear(), "\uB144 ").concat(date.getMonth() + 1, "\uC6D4 ").concat(value, "\uC77C"); // form - date값 hidden input에 추가

  var clickDateFormInput = document.querySelector('.clickDateFormInput');
  clickDateFormInput.value = [date.getFullYear(), date.getMonth() + 1, value].join('-');
  return b ? displayTodoList.classList.remove('invisible') : displayTodoList.classList.add('invisible');
}