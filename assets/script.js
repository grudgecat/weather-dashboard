var forecastTodayEl = document.getElementById('selectedCity');
var btnSearchEl = document.getElementById('btnSearch');

var cityName = "London";
var apiKey = "81d886f9c96b4f8fd57e877f07512c85";
var iconcode = "fff";
var iconurl = "";
var today = moment().format("M/D/YY");

var lon_lat = {
    name: "",
    longitude: 0,
    latitude: 0 
};

function getCoords(cityName) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            lon_lat.name = data.name;
            lon_lat.longitude = data.coord.lon;
            lon_lat.latitude = data.coord.lat;
        });
}

getCoords(cityName);

function getWeatherTodayData(cityName) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lon_lat.latitude}&lon=${lon_lat.longitude}&exclude=minutely,hourly,daily&appid=${apiKey}`;

    console.log(requestUrl); 
      
    fetch(requestUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            console.log(data);
            iconurl = `"http://openweathermap.org/img/w/${data.current.weather[0].icon}.png"`
            var tempF = (((data.current.temp - 273.15) * 1.8) +32).toFixed(1);
    
            $('#selectedCity').append(`
            <h3>${lon_lat.name}  (${today}) </h3><img style="width:30px;height:30px" src=${iconurl} alt="Weather Icon">
            <p>Temp: ${tempF}&#8457</p>
            <p>Wind: ${data.current.wind_speed}</p>
            <p>Humidity: ${data.current.humidity}</p>
            <p>UV Index: ${data.current.uvi}</p>
            `);
    });
}
     
setTimeout(getWeatherTodayData, 1000);

// getTodayWeather(cityName);  //this works, but building URL via EVENT LISTENER the cityName in URL fails???
//btnSearchEl.addEventListener('click', getTodayWeather); //Generates error in URL, cityName displays as mouse event???
//when defined with 'onclick' at button, fxn runs but city is undefined in URL???
//btnSearchEl.click(getTodayWeather);  //also fails with undefined.


function getFiveDayForecastData(cityName) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lon_lat.latitude}&lon=${lon_lat.longitude}&units=imperial&appid=${apiKey}`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("5 day data: ")
            console.log(data);
            var i = 0;
            for(i = 0; i < data.list.length; i+=8) {
                console.log(data.list[i].main.temp);
                console.log(data.list[i].wind.speed);
                console.log(data.list[i].main.humidity);
            } 

        });
}

setTimeout(getFiveDayForecastData, 1000);


