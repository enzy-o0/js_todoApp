// index.js - 첫 로드 js. localstroage 관리.

'use strict';

import insertDaysInCalendar from './calendar.js'
import { setTodoItemList } from './todolist.js'
import { initMain } from './main.js'

class TodoItem { // Todo Item Arribute
  constructor(clickDate, title, time, notes) {
    this.clickDate = clickDate;
    this.title = title;
    this.time = time;
    this.notes = notes
  }
}

// 0. 로컬 스토리지 로드
function loadTodoItemLocalStroage() {
    const getTodoItem = localStorage.getItem('todoItem');
    const getTodoItemJSON = JSON.parse(getTodoItem);

    if (getTodoItemJSON === null) {
      return;
    }

    insertDaysInCalendar(getTodoItemJSON);
    setTodoItemList(getTodoItemJSON, true);
}


// 로컬 리스트에 추가
const todoItemArr = [];
const todoAddButton = document.querySelector('.todoAddbutton');
function saveLocalTodoItem(todoItem) {
    if (todoAddButton.classList.contains('modify')) {
        todoItemArr[todoAddButton.id] = todoItem; 
    } else {
        todoItemArr.push(todoItem);
    }
}

initMain();
loadTodoItemLocalStroage();

export { todoItemArr, TodoItem , saveLocalTodoItem} ;