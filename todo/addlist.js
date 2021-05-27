import { todoItemArr, TodoItem , saveLocalTodoItem } from '../index.js'
import { displayClickDateTodoAdd, setTodoItemList } from './todolist.js'
import insertDaysInCalendar from '../calendar/calendar.js'

const backToListButton = document.querySelector('.todo .todo_title .back');
const todoAddButton = document.querySelector('.todoAddbutton');
const addTodoTimeAlldayCheckbox = document.querySelector('.todo .todo_content .time-title .alldayCheck #allday');
const addTodoTimeInput = document.querySelector('.todo .todo_content .time input.time');
const titleInput = document.querySelector('.section.title input');

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

    if (form.title.value === '') {
        titleInput.placeholder = "제목은 입력해주세요.";
        titleInput.classList.add('warning');
    } else {
        saveLocalTodoItem(todoItem);
        displayTodoAddAndBackButton(false);
        setTodoItemList(todoItemArr);
        insertDaysInCalendar(todoItemArr, date);
    
        localStorage.setItem('todoItem', JSON.stringify(todoItemArr));
        todoAddButton.classList.remove('modify');
        titleInput.classList.remove('warning');
    }
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

export { displayTodoAddAndBackButton, setDisplayClickDateTodoModify}