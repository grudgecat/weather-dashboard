var forecastTodayEl = $('#selectedCity');
var btnSearchEl = $('#btnSearch');
var prevCityListEl = $('#prevCityList');
 
// var cityName = "London";
var cityList = JSON.parse(localStorage.getItem("cities")) || [];
var apiKey = "81d886f9c96b4f8fd57e877f07512c85";
var iconcode = "fff";
var iconurl = "";
var today = moment().format("M/D/YYYY");

var lon_lat = {
    name: "",
    longitude: 0,
    latitude: 0 
};



function getCityName() {
    var cityName = $("#txtSearch").val();
    cityList.push(cityName);
    if(cityList.length > 5)
        cityList.slice(1,5);
    localStorage.setItem("cities", JSON.stringify(cityList));
    getCoords(cityName);
}

btnSearchEl.on('click', getCityName); 

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

            getWeatherTodayData();
            getFiveDayForecastData();
        });
}

// getCoords(cityName);

function getWeatherTodayData() {
    //dependant on getCoords running first to set longitude/latitude
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lon_lat.latitude}&lon=${lon_lat.longitude}&exclude=minutely,hourly,daily&appid=${apiKey}`;
    fetch(requestUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            iconurl = `"http://openweathermap.org/img/w/${data.current.weather[0].icon}.png"`
            var tempF = (((data.current.temp - 273.15) * 1.8) +32).toFixed(1);
    
            $('#selectedCity').html(`
            <h3>${lon_lat.name}  (${today}) </h3><img style="width:50px;height:50px" src=${iconurl} alt="Weather Icon">
            <p>Temp: ${tempF}&#8457</p>
            <p>Wind: ${data.current.wind_speed}</p>
            <p>Humidity: ${data.current.humidity}</p>
            <p>UV Index: ${data.current.uvi}</p>
            `);
           });
}
     
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
            $("#dailyForecasts").empty();
            for(i = 2; i < data.list.length; i+=8) {
                $("#dailyForecasts").append(`
                <div class="card w-20">
                <div class="card-body">
                <h5 class="card-title">${moment(data.list[i].dt,"X").format("MM/DD/YYYY")}</h5>
            	<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">
                <p class="card-text">Temp: ${data.list[i].main.temp}&#8457</p>
                <p class="card-text">Wind: ${data.list[i].wind.speed}</p>
                <p class="card-text">Humidity: ${data.list[i].main.humidity}</p>
              </div>
            </div>
                `)  
            } 
            $("#txtSearch").val("");
        });
}

function populateCitiesList() {
    //pull previously searched cities from localStorage
    for(i = 0; i < cityList.length; i++) {
        $( "#prevCityList" ).append( `<li>${cityList[i]}</li>` );
    } 
}

populateCitiesList();