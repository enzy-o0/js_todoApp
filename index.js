'use strict';

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

//// 1. 달력 화면
// 1.1 달력 구조에 맞게 Set
let date= new Date();
function insertDaysInCalendar(todoItems, idx) {
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();
  document.querySelector('.calendar-year-month').textContent = `${viewYear}년 ${viewMonth + 1}월`;
  
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const PLDay = prevLast.getDay();
  const TLDate = thisLast.getDate();

  const prevDates = [];
  const thisDates = [...Array(TLDate+1).keys()].slice(1); /* array를 생성하고, 배열의 인덱스를 키 값으로 가지는 새로운 Array Iterator 반환  */

  if (PLDay !== 6) {
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.push('');
    }
  }

  // innerHTML 속성이 보안에 취약 (XSS). -> 차선책 //TODO createDocumentFragment 
  /* const datesul = document.querySelector('.calendar .calendar-main .dates');
  while (datesul.firstChild) {
    datesul.removeChild(datesul.firstChild);
  } */ 

  const dates = prevDates.concat(thisDates);

  /* dateDiv = document.createElement('div');
      dateDiv.dataset.key = i;
      dateDiv.dataset.value = date;
      dateDiv.textContent = date;
      dateDiv.className = 'date';
      datesul.appendChild(dateDiv); */
      
  document.querySelector('.calendar .calendar-main .dates').innerHTML = dates.map((date, i) => createDateHtmlString(date, i, idx)).join('');

  // 오늘 날짜 포커스
  const today = new Date();
  if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) {
    var tv = document.getElementsByClassName("date")[PLDay + today.getDate()];
    tv.classList.add('today');
  } 

  todoItems.forEach((todoItem, index) => {
    const todoItemDate = todoItem.clickDate.split(/[^0-9]/g)[2];
    const isTodoDate = document.getElementById(todoItemDate);
    if(todoItemDate == isTodoDate.dataset.value) {
      isTodoDate.querySelector('.isTodo').classList.remove('invisible');
    } 
  });
};

function createDateHtmlString(date, i, idx) {
  if (idx == date) {
    console.log(idx, date, i);
    return `<div class="date clickDate" data-key="${i}" data-value="${date}" id="${date}">${date}<span class="isTodo invisible"><i class="fas fa-heart"></i></span></div>`
  } else {
    return `<div class="date" data-key="${i}" data-value="${date}" id="${date}">${date}<span class="isTodo invisible"><i class="fas fa-heart"></i></span></div>`
  }
}

// 달력 이전달, 다음달 버튼 
function setClickPrevNextMonth(isPrev) {
  date.setMonth(date.getMonth() + isPrev);
  insertDaysInCalendar();
}

const calendarPrevMonth = document.querySelector('.calendar-nav-btn.go-prev');
const calendarNextMonth = document.querySelector('.calendar-nav-btn.go-next');
const calendarDates = document.querySelector('.calendar .calendar-main .dates');

// 달력 이전달 버튼
calendarPrevMonth.addEventListener('click', () => {
    setClickPrevNextMonth(-1);
});

// 달력 다음달 버튼
calendarNextMonth.addEventListener('click', () => {
    setClickPrevNextMonth(1);
});

// 달력 날짜 버튼
calendarDates.addEventListener('click', (event) => {
  const clickDate = event.target;
  const clickDateValue = clickDate.dataset.value;
  const clickDateKey = clickDate.dataset.key;

  if(clickDateValue === '' || clickDateValue === undefined) {
    return;
  }

  calendarDateClick(clickDateKey);
  displayClickDateTodoAdd(false);
  displayClickDateTodoList(true, clickDateValue);
  setTodoItemList(todoItemArr);
});

// 달력 날짜 버튼 클릭 - 이전에 선택된 날짜들 제거
function calendarDateClick(clickDateKey) {
  const clickedDateAll = calendarDates.querySelectorAll('.clickDate');
    clickedDateAll.forEach(clickedDate => {
      clickedDate.classList.remove('clickDate');
  });

  const calendarDate = calendarDates.children[clickDateKey];
  calendarDate.classList.add('clickDate');
}

// 첫화면은 Calendar만, Date 클릭시 List 화면 보여짐
function displayClickDateTodoList(b, value = new Date().getDate()) {
  const displayTodoList = document.querySelector('.todo');
  const displayClickDate = document.querySelector('.todo .todo_title .todo_click_day');
  displayClickDate.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${value}일`;

  // form - date값 hidden input에 추가
  const clickDateFormInput = document.querySelector('.clickDateFormInput');
  clickDateFormInput.value = [date.getFullYear(), date.getMonth() + 1, value].join('-');

  console.log(clickDateFormInput.value);
  return b ? displayTodoList.classList.remove('invisible') : displayTodoList.classList.add('invisible');
}

//// 2. 리스트 화면

// 2-1. 로드된 리스트 아이템 셋
function setTodoItemList(todoItems, b = false) {
  const clickDate = document.querySelector('.todo .todo_title .todo_click_day').textContent;
  const clickDateFormat = clickDate.replace(/\s/g, '').replace(/[^0-9]/g, '-').slice(0, -1); 
  const todoListUl = document.querySelector('.todo .todo_content .todo_list');

  let inTodoListString ='';
  let isList = false;

  todoItems.forEach((todoItem, index) => {
    if (b) {
      saveLocalTodoItem(todoItem);
    }

    if(todoItem.clickDate == clickDateFormat) {
      inTodoListString += createInTodoItemHTML(todoItem, index);
      isList = true;
    } 
  });

  if (!isList) {
    inTodoListString += `<span class="defalutUl"> 일정을 추가해주세요. </span>`
  }
  
  todoListUl.innerHTML = inTodoListString;

  if (isList) {
    moreClickListener();
    modifyClickListener();
    deleteClickListener();
  }
}

// 로컬 리스트에 추가
const todoItemArr = [];
function saveLocalTodoItem(todoItem) {
  if (todoAddButton.classList.contains('modify')) {
    todoItemArr[todoAddButton.id] = todoItem; 
  } else {
    todoItemArr.push(todoItem);
  }
}

// 로드된 리스트 아이템 html string
function createInTodoItemHTML(todoItem, index) {
  if (todoItem.time === '') {
    todoItem.time = '종일';
  }
  return ` 
  <li class="list">
    <div class="list-content">
      <span class="list-title">${todoItem.title}</span>
      <span class="list-notes">${todoItem.notes}</span>
      <span class="list-time">${todoItem.time}</span>
    </div>
    <div class="list-more">
      <i id="listMore" class="fas fa-ellipsis-h"></i>
      <div id="${index}" class="drop-content invisible">
        <button class="drop-modify"> 수정 </button>
        <button class="drop-delete"> 삭제 </button>
      </div>
    </div>
  </li>` 
}

// 리스트 화면 - 더보기 버튼 클릭리스너
function moreClickListener() {
    const moreTodoListMenu = document.querySelectorAll('#listMore');
    moreTodoListMenu.forEach((more, index) => {
      more.addEventListener('click', () => {
        more.classList.toggle('clicked');
        let isClick = false;

        if (more.classList.contains('clicked')) {
          isClick = true;
        }
        invisibleMoreMenu(index, isClick);
      }); 
    });
}

// 더보기 누르면 수정/삭제 보이기
function invisibleMoreMenu(index = null, isClick) {
  const moreTodoListMenuItem = document.querySelectorAll('.drop-content');
  moreTodoListMenuItem.forEach(moreMenu => {
    moreMenu.classList.add('invisible');
  });
  
  if (isClick) {
    moreTodoListMenuItem[index].classList.remove('invisible');
  } else {
    moreTodoListMenuItem[index].classList.add('invisible');
  }
}

// 수정, 삭제시 index을 위한 로컬 배열 (todoItemArr), 리스트 아이디 (setInTodoItemHTML 할때, index 변동) 비교
function todoArrfindIndex(todoArrIndex) {
  const idx = todoItemArr.findIndex(function(item, index) { 
    return index == todoArrIndex; 
  });
  return idx;
}

// 리스트화면 - 더보기 - 수정 버튼클릭 리스너
function modifyClickListener() {
  const modifyTodoListMenu = document.querySelectorAll('.drop-modify');
  modifyTodoListMenu.forEach((modifyBt) => {
    modifyBt.addEventListener('click', () => {
          const todoArrIndex = modifyBt.parentNode.id;
          const idx = todoArrfindIndex(todoArrIndex);
          todoAddButton.classList.add('modify');
          todoAddButton.id = idx;

          displayClickDateTodoAdd(true);
          displayTodoAddAndBackButton(true);
          setDisplayClickDateTodoModify(idx);
    });
  });
}

// 리스트화면 - 더보기 - 삭제 버튼 클릭 리스너
function deleteClickListener() {
  const deleteTodoListMenu = document.querySelectorAll('.drop-delete');
  deleteTodoListMenu.forEach((deleteBt) => {
    deleteBt.addEventListener('click', () => {
        const todoArrIndex = deleteBt.parentNode.id;
        const idx = todoArrfindIndex(todoArrIndex);
        const date = todoItemArr[idx].clickDate.split(/[^0-9]/g)[2];
        console.log(date);

        todoItemArr.splice(idx, 1);
        setTodoItemList(todoItemArr);
        insertDaysInCalendar(todoItemArr, date);
        localStorage.setItem('todoItem', JSON.stringify(todoItemArr));
      }); 
    });
}

const todoListUl = document.querySelector('.todo .todo_content .list-add');
const backToListButton = document.querySelector('.todo .todo_title .back');
const todoAddButton = document.querySelector('.todoAddbutton');
const addTodoTimeAlldayCheckbox = document.querySelector('.todo .todo_content .time-title .alldayCheck #allday');
const addTodoTimeInput = document.querySelector('.todo .todo_content .time input.time');

// 리스트 화면 - 추가 버튼
todoListUl.addEventListener('click', ()=> {
    displayTodoAddAndBackButton(true);
});

// 추가(수정) 화면 - 뒤로가기 버튼
backToListButton.addEventListener('click', ()=> {
    displayTodoAddAndBackButton(false);
});

// 추가(수정) 화면 - 추가 버튼
todoAddButton.addEventListener('click', () => {
  const form = document.forms.todo;

  if(form.date.value === '') { // primary key (date) 가 없으므로 return
    return;
  }

  const todoItem = new TodoItem(form.date.value, form.title.value, form.time.value, form.notes.value);
  const date = form.date.value.split(/[^0-9]/g)[2];

  saveLocalTodoItem(todoItem);
  displayTodoAddAndBackButton(false);
  setTodoItemList(todoItemArr);
  insertDaysInCalendar(todoItemArr, date);

  localStorage.setItem('todoItem', JSON.stringify(todoItemArr));
  todoAddButton.classList.remove('modify');

});

// 추가(수정) 화면 - 시간 - 종일 버튼
addTodoTimeAlldayCheckbox.addEventListener('change', () => {
    if (addTodoTimeAlldayCheckbox.checked) {
      addTodoTimeInput.readOnly = true;
      addTodoTimeInput.value = '';
    } else {
      addTodoTimeInput.readOnly = false;
    }
});

// 리스트화면 - 추가 버튼 - 리스트화면 or 추가화면
function displayClickDateTodoAdd(b) {
  const todoList = document.querySelector('.todo .todo_content_list');
  const todoAdd = document.querySelector('.todo .todo_content_add');
  
  if (b) {
    todoList.classList.add('invisible');
    todoAdd.classList.remove('invisible');
  } else {
    todoAdd.classList.add('invisible');
    todoList.classList.remove('invisible');
  }
}

// 리스트화면 - 수정 버튼 - 기존 데이터셋
function setDisplayClickDateTodoModify(todoArrIndex) {
  const todoItem = todoItemArr[todoArrIndex];
  const form = document.forms.todo;

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

// 추가 화면 뒤로가기 visible, input값 reset
function displayTodoAddAndBackButton(isAdd) {
  displayClickDateTodoAdd(isAdd);
  const form = document.forms.todo;

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
}

loadTodoItemLocalStroage();

