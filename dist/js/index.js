// index.js - 첫 로드 js. localstroage 관리.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveLocalTodoItem = saveLocalTodoItem;
exports.TodoItem = exports.todoItemArr = void 0;

var _calendar = _interopRequireDefault(require("../js/calendar/calendar.js"));

var _todolist = require("../js/todo/todolist.js");

var _main = require("../js/main/main.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TodoItem = // Todo Item Arribute
function TodoItem(clickDate, title, time, notes) {
  _classCallCheck(this, TodoItem);

  this.clickDate = clickDate;
  this.title = title;
  this.time = time;
  this.notes = notes;
}; // 0. 로컬 스토리지 로드


exports.TodoItem = TodoItem;

function loadTodoItemLocalStroage() {
  var getTodoItem = localStorage.getItem('todoItem');
  var getTodoItemJSON = JSON.parse(getTodoItem);

  if (getTodoItemJSON === null) {
    return;
  }

  (0, _calendar["default"])(getTodoItemJSON);
  (0, _todolist.setTodoItemList)(getTodoItemJSON, true);
} // 로컬 리스트에 추가


var todoItemArr = [];
exports.todoItemArr = todoItemArr;
var todoAddButton = document.querySelector('.todoAddbutton');

function saveLocalTodoItem(todoItem) {
  if (todoAddButton.classList.contains('modify')) {
    todoItemArr[todoAddButton.id] = todoItem;
  } else {
    todoItemArr.push(todoItem);
  }
}

(0, _main.initMain)();
loadTodoItemLocalStroage();