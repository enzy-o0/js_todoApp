"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayTodoAddAndBackButton = displayTodoAddAndBackButton;
exports.setDisplayClickDateTodoModify = setDisplayClickDateTodoModify;

var _index = require("../index.js");

var _todolist = require("./todolist.js");

var _calendar = _interopRequireDefault(require("../calendar/calendar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var backToListButton = document.querySelector('.todo .todo_title .back');
var todoAddButton = document.querySelector('.todoAddbutton');
var addTodoTimeAlldayCheckbox = document.querySelector('.todo .todo_content .time-title .alldayCheck #allday');
var addTodoTimeInput = document.querySelector('.todo .todo_content .time input.time');
var titleInput = document.querySelector('.section.title input'); // 추가(수정) 화면 - 뒤로가기 버튼

backToListButton.addEventListener('click', function () {
  displayTodoAddAndBackButton(false);
}); // 추가(수정) 화면 - 추가 버튼

todoAddButton.addEventListener('click', function () {
  var form = document.forms.todo;

  if (form.date.value === '') {
    // primary key (date) 가 없으므로 return
    return;
  }

  var todoItem = new _index.TodoItem(form.date.value, form.title.value, form.time.value, form.notes.value);
  var date = form.date.value.split(/[^0-9]/g)[2];

  if (form.title.value === '') {
    titleInput.placeholder = "제목은 입력해주세요.";
    titleInput.classList.add('warning');
  } else {
    (0, _index.saveLocalTodoItem)(todoItem);
    displayTodoAddAndBackButton(false);
    (0, _todolist.setTodoItemList)(_index.todoItemArr);
    (0, _calendar["default"])(_index.todoItemArr, date);
    localStorage.setItem('todoItem', JSON.stringify(_index.todoItemArr));
    todoAddButton.classList.remove('modify');
    titleInput.classList.remove('warning');
  }
}); // 추가(수정) 화면 - 시간 - 종일 버튼

addTodoTimeAlldayCheckbox.addEventListener('change', function () {
  if (addTodoTimeAlldayCheckbox.checked) {
    addTodoTimeInput.readOnly = true;
    addTodoTimeInput.value = '';
  } else {
    addTodoTimeInput.readOnly = false;
  }
}); // 추가 화면 뒤로가기 visible, input값 reset

function displayTodoAddAndBackButton(isAdd) {
  (0, _todolist.displayClickDateTodoAdd)(isAdd);
  var form = document.forms.todo;

  if (isAdd) {
    backToListButton.classList.remove('invisible');

    if (!todoAddButton.classList.contains('modify')) {
      form.title.value = '';
      addTodoTimeInput.value = '';
      form.time.vaule = '';
      form.notes.value = '';
    }
  } else {
    backToListButton.classList.add('invisible');
  }
} // 리스트화면 - 수정 버튼 - 기존 데이터셋


function setDisplayClickDateTodoModify(todoArrIndex) {
  var todoItem = _index.todoItemArr[todoArrIndex];
  var form = document.forms.todo;
  form.date.value = todoItem.clickDate;
  form.title.value = todoItem.title;
  form.time.value = todoItem.time;
  form.notes.value = todoItem.notes;

  if (form.time.value === '') {
    addTodoTimeAlldayCheckbox.checked = true;
    addTodoTimeInput.readOnly = true;
    addTodoTimeInput.value = '';
  } else {
    addTodoTimeAlldayCheckbox.checked = false;
    addTodoTimeInput.readOnly = false;
    addTodoTimeInput.value = form.time.value;
  }
}