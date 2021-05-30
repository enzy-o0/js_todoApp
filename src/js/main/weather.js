
const COORDS = 'coords';
const weather = document.querySelector('.js-date')

async function getWeather(lat, lng) {
    const endpoint = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.API_KEY}&units=metric`)
    const response = await endpoint.json();
    
    const temp = Math.floor(response.main.temp);
    const place = response.name;
    weather.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${place}, ${temp}℃`;
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj =  {
        latitude,
        longitude
    };

    saveCoords(coordsObj);
    getWeather(latitude, longitude)
}

function handleGeoError() {
    console.log(`Can't Access Geo location`);
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError)
}

function loadCoords() {
    const loadedCords = localStorage.getItem(COORDS);

    if (loadedCords === null) {
        askForCoords();
    } else {
        const parseCoords = JSON.parse(loadedCords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

export default function weatherInit() {
    loadCoords();
}
