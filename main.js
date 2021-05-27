/* main.js 첫화면 */
import weatherInit from './weather.js'

const body = document.querySelector('body');
const clockSection = document.querySelector('.clock'), 
    clockContainer = clockSection.querySelector('.js-clock'),
    clockTitle = clockContainer.querySelector('.js-title'),
    main = document.querySelector('.main');


/* 타이머 */
function getTimeFormat(time) {
    return `${time < 10 ? `0${time}` : time}`;
}

function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    clockTitle.innerText = `${ampm} ${getTimeFormat(hours)}:${getTimeFormat(minutes)}:${getTimeFormat(seconds)}`;
}

/* 배경 그리기 */
function paintImage() {
    const date = new Date();
    const hours = date.getHours();
    const image = new Image();
    let imageNumber = 1;

    if ( hours < 6 || hours > 20)  {
        imageNumber = 3;
    } else if ( hours <= 11) {
        imageNumber = 1;
    } else if ( hours <= 17) {
        imageNumber = 2;
    } else if ( hours <= 20) {
        imageNumber = 4;
    } 

    image.src = `/images/${imageNumber}.jpg`
    image.classList.add('bgImage');
    body.appendChild(image);
}

const form = document.querySelector('.js-form'),
        input = form.querySelector('input'),
        greeting = document.querySelector('.js-greetings');

const USER_LS = "currentUser",
    SHOWING_CN = "showing";

/* 이름  */
function saveName(text) {
    localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = input.value;
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
    greeting.innerText = `Hello! ${text} 🖐 \n ${paintGreetingCase()}`
    const goTodoBt = document.createElement('button')
    goTodoBt.innerText = 'Todo 리스트 적으러 가기 🎈'
    clockSection.append(goTodoBt);

    goTodoBt.onclick = onGoTodoBtClick;
}

function paintGreetingCase() {
    let greetingText = '';
    const paintDate = new Date();
    const paintHour = paintDate.getHours();

    if ( paintHour <= 6 ) {
        greetingText = '적적한 새벽이야.';
    } else if ( paintHour <= 11) {
        greetingText = '안녕. 좋은 아침이야! ';
    } else if ( paintHour <= 17) {
        greetingText = '나른한 오후야. 커피 한잔 어때?';
    } else if ( paintHour <= 20) {
        greetingText = '벌써 저녁이네. 오늘 하루는 어땠어?';
    } else {
        greetingText = '잘 시간이네. 고생 많았어!';
    }
    console.log(paintHour, greetingText)

    return greetingText;
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if (currentUser === null) {
        askForName();
    } else {
        paintGreeting(currentUser)
    }
}

/* Go TodoList */ 
function onGoTodoBtClick () {
    clockSection.classList.add('hideClock');
    main.classList.remove('invisible');
}

function initMain() {
    paintImage();
    getTime();
    setInterval(getTime, 1000);
    loadName();
    weatherInit();
}

export { initMain }