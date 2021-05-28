"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTodoItemList = exports["default"] = setTodoItemList;
exports.displayClickDateTodoAdd = displayClickDateTodoAdd;
Object.defineProperty(exports, "saveLocalTodoItem", {
  enumerable: true,
  get: function get() {
    return _index.saveLocalTodoItem;
  }
});

var _index = require("../index.js");

var _addlist = require("./addlist.js");

var _calendar = _interopRequireDefault(require("../calendar/calendar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//// 2. 리스트 화면
// 2-1. 로드된 리스트 아이템 셋
function setTodoItemList(todoItems) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var clickDate = document.querySelector('.todo .todo_title .todo_click_day').textContent;
  var clickDateFormat = clickDate.replace(/\s/g, '').replace(/[^0-9]/g, '-').slice(0, -1);
  var todoListUl = document.querySelector('.todo .todo_content .todo_list');
  var inTodoListString = '';
  var isList = false;
  todoItems.forEach(function (todoItem, index) {
    if (b) {
      (0, _index.saveLocalTodoItem)(todoItem);
    }

    if (todoItem.clickDate == clickDateFormat) {
      inTodoListString += createInTodoItemHTML(todoItem, index);
      isList = true;
    }
  });

  if (!isList) {
    inTodoListString += "<span class=\"defalutUl\"> \uC77C\uC815\uC744 \uCD94\uAC00\uD574\uC8FC\uC138\uC694. </span>";
  }

  todoListUl.innerHTML = inTodoListString;

  if (isList) {
    moreClickListener();
    modifyClickListener();
    deleteClickListener();
  }
} // 로드된 리스트 아이템 html string


function createInTodoItemHTML(todoItem, index) {
  if (todoItem.time === '') {
    todoItem.time = '종일';
  }

  return " \n        <li class=\"list\">\n            <div class=\"list-content\">\n                <span class=\"list-title\">".concat(todoItem.title, "</span>\n                <span class=\"list-notes\">").concat(todoItem.notes, "</span>\n                <span class=\"list-time\">").concat(todoItem.time, "</span>\n            </div>\n            <div class=\"list-more\">\n                <i id=\"listMore\" class=\"fas fa-ellipsis-h\"></i>\n                <div id=\"").concat(index, "\" class=\"drop-content invisible\">\n                <button class=\"drop-modify\"> \uC218\uC815 </button>\n                <button class=\"drop-delete\"> \uC0AD\uC81C </button>\n                </div>\n            </div>\n        </li>");
} // 리스트 화면 - 더보기 버튼 클릭리스너


function moreClickListener() {
  var moreTodoListMenu = document.querySelectorAll('#listMore');
  moreTodoListMenu.forEach(function (more, index) {
    more.addEventListener('click', function () {
      more.classList.toggle('clicked');
      var isClick = false;

      if (more.classList.contains('clicked')) {
        isClick = true;
      }

      invisibleMoreMenu(index, isClick);
    });
  });
}

var todoListUl = document.querySelector('.todo .todo_content .list-add'); // 리스트 화면 - 추가 버튼

todoListUl.addEventListener('click', function () {
  (0, _addlist.displayTodoAddAndBackButton)(true);
}); // 더보기 누르면 수정/삭제 보이기

function invisibleMoreMenu() {
  var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var isClick = arguments.length > 1 ? arguments[1] : undefined;
  var moreTodoListMenuItem = document.querySelectorAll('.drop-content');
  moreTodoListMenuItem.forEach(function (moreMenu) {
    moreMenu.classList.add('invisible');
  });

  if (isClick) {
    moreTodoListMenuItem[index].classList.remove('invisible');
  } else {
    moreTodoListMenuItem[index].classList.add('invisible');
  }
} // 리스트화면 - 더보기 - 수정 버튼클릭 리스너


var todoAddButton = document.querySelector('.todoAddbutton');

function modifyClickListener() {
  var modifyTodoListMenu = document.querySelectorAll('.drop-modify');
  modifyTodoListMenu.forEach(function (modifyBt) {
    modifyBt.addEventListener('click', function () {
      var todoArrIndex = modifyBt.parentNode.id;
      var idx = todoArrfindIndex(todoArrIndex);
      todoAddButton.classList.add('modify');
      todoAddButton.id = idx;
      displayClickDateTodoAdd(true);
      (0, _addlist.displayTodoAddAndBackButton)(true);
      (0, _addlist.setDisplayClickDateTodoModify)(idx);
    });
  });
} // 리스트화면 - 더보기 - 삭제 버튼 클릭 리스너


function deleteClickListener() {
  var deleteTodoListMenu = document.querySelectorAll('.drop-delete');
  deleteTodoListMenu.forEach(function (deleteBt) {
    deleteBt.addEventListener('click', function () {
      var todoArrIndex = deleteBt.parentNode.id;
      var idx = todoArrfindIndex(todoArrIndex);

      var date = _index.todoItemArr[idx].clickDate.split(/[^0-9]/g)[2];

      console.log(date);

      _index.todoItemArr.splice(idx, 1);

      setTodoItemList(_index.todoItemArr);
      (0, _calendar["default"])(_index.todoItemArr, date);
      localStorage.setItem('todoItem', JSON.stringify(_index.todoItemArr));
    });
  });
} // 수정, 삭제시 index을 위한 로컬 배열 (todoItemArr), 리스트 아이디 (setInTodoItemHTML 할때, index 변동) 비교


function todoArrfindIndex(todoArrIndex) {
  var idx = _index.todoItemArr.findIndex(function (item, index) {
    return index == todoArrIndex;
  });

  return idx;
} // 리스트화면 - 추가 버튼 - 리스트화면 or 추가화면


function displayClickDateTodoAdd(b) {
  var todoList = document.querySelector('.todo .todo_content_list');
  var todoAdd = document.querySelector('.todo .todo_content_add');

  if (b) {
    todoList.classList.add('invisible');
    todoAdd.classList.remove('invisible');
  } else {
    todoAdd.classList.add('invisible');
    todoList.classList.remove('invisible');
  }
}