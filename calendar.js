// calendar.js - 달력 화면 구현.

import { todoItemArr } from './index.js'
import { setTodoItemList, displayClickDateTodoAdd } from './todolist.js'

//// 1. 달력 화면
// 1.1 달력 구조에 맞게 Set

let date= new Date();
export default function insertDaysInCalendar(todoItems, idx) {
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

    if (todoItems !== undefined) {
        todoItems.forEach((todoItem, index) => {
            if (viewYear == todoItem.clickDate.split(/[^0-9]/g)[0] && viewMonth + 1 == todoItem.clickDate.split(/[^0-9]/g)[1]) {
                const todoItemDate = todoItem.clickDate.split(/[^0-9]/g)[2];
                const isTodoDate = document.getElementById(todoItemDate);
                if(todoItemDate == isTodoDate.dataset.value) {
                isTodoDate.querySelector('.isTodo').classList.remove('invisible');
                } 
            }
        });
    }
};

function createDateHtmlString(date, i, idx) {
    if (idx == date) {
        return `<div class="date clickDate" data-key="${i}" data-value="${date}" id="${date}">${date}<span class="isTodo invisible"><i class="fas fa-heart"></i></span></div>`
    } else {
        return `<div class="date" data-key="${i}" data-value="${date}" id="${date}">${date}<span class="isTodo invisible"><i class="fas fa-heart"></i></span></div>`
    }
}

// 달력 이전달, 다음달 버튼 
function setClickPrevNextMonth(isPrev) {
    date.setMonth(date.getMonth() + isPrev);
    const getTodoItem = localStorage.getItem('todoItem');
    const getTodoItemJSON = JSON.parse(getTodoItem);

    if (getTodoItemJSON === null) {
        return;
    }

    insertDaysInCalendar(getTodoItemJSON);
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

    return b ? displayTodoList.classList.remove('invisible') : displayTodoList.classList.add('invisible');
}
