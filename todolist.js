import { todoItemArr, saveLocalTodoItem } from './index.js'
import { displayTodoAddAndBackButton, setDisplayClickDateTodoModify} from './addlist.js'
import insertDaysInCalendar from './calendar.js'

//// 2. 리스트 화면
// 2-1. 로드된 리스트 아이템 셋

export default function setTodoItemList(todoItems, b = false) {
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

const todoListUl = document.querySelector('.todo .todo_content .list-add');

// 리스트 화면 - 추가 버튼
todoListUl.addEventListener('click', ()=> {
    displayTodoAddAndBackButton(true);
});


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


// 리스트화면 - 더보기 - 수정 버튼클릭 리스너
const todoAddButton = document.querySelector('.todoAddbutton');

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

// 수정, 삭제시 index을 위한 로컬 배열 (todoItemArr), 리스트 아이디 (setInTodoItemHTML 할때, index 변동) 비교
function todoArrfindIndex(todoArrIndex) {
    const idx = todoItemArr.findIndex(function(item, index) { 
        return index == todoArrIndex; 
    });
    return idx;
}

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

export { setTodoItemList,  saveLocalTodoItem, displayClickDateTodoAdd}