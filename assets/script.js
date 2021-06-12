var btnSearchEl = $('#btnSearch');
var prevCityListEl = $('#prevCityList');
 
// var cityName = "London";
var cityList = JSON.parse(localStorage.getItem("cities")) || [];
var apiKey = "81d886f9c96b4f8fd57e877f07512c85";
var numOfCities = 5;
var iconcode = "fff";
var iconurl = "";
var today = moment().format("M/D/YYYY");
var uviNumber = 0;
var lon_lat = {
    name: "",
    longitude: 0,
    latitude: 0 
};

function getCityName() {
    var cityName = $("#txtSearch").val();
    cityList.push(cityName);
    checkList();
    getCoords(cityName);
}

function checkList() {
    if(cityList.length > numOfCities) {
        cityList.splice(0,1);     
    }
    localStorage.setItem("cities", JSON.stringify(cityList));
    populateCitiesList(); 
}

btnSearchEl.on('click', getCityName); 

$('#txtSearch').keyup(function(event) {
    if (event.which === 13) {
        getCityName();
    }
});

$("#prevCityList").on("click", "li", function (event) {
    cityName = this.textContent;
    getCoords(cityName);
});

function getCoords(cityName) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    fetch(requestUrl)
        .then(function (response) {
            if(response.ok)
                return response.json();
            else {
                cityList.pop();
                checkList();
                $("#txtSearch").val("");
                alert("Unable to find city in database, please try again."); 
                return ""; 
            }
        })
        .then(function (data) {
            lon_lat.name = data.name;
            lon_lat.longitude = data.coord.lon;
            lon_lat.latitude = data.coord.lat;

            getWeatherTodayData();
            getFiveDayForecastData();
        });
}

function init() {
    $("#selectedCity").html(`Enter the city you want to display in the text box on the left, 
    then click 'Search' button or Enter key.`)
    populateCitiesList();
}


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
            uviNumber = data.current.uvi;
            console.log(data);
    
            $('#selectedCity').html(`
            <h3>${lon_lat.name}  (${today}) </h3><img style="width:50px;height:50px" src=${iconurl} alt="Weather Icon">
            <p>Temp: ${tempF}&#8457</p>
            <p>Wind: ${data.current.wind_speed}</p>
            <p>Humidity: ${data.current.humidity}</p>
            <p id="uvi">UV Index: ${data.current.uvi}</p>
            `);
        setUVI();
        });
}

function setUVI() {
    if(uviNumber < 3)
        $("#uvi").css("background-color", "green");
    else if(uviNumber < 6)
        $("#uvi").css("background-color", "yellow");
    else if(uviNumber < 8)
        $("#uvi").css("background-color", "orange");
    else
        $("#uvi").css("background-color", "red");
}

function getFiveDayForecastData(cityName) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lon_lat.latitude}&lon=${lon_lat.longitude}&units=imperial&appid=${apiKey}`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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
    $("#prevCityList").empty();
    //pull previously searched cities from localStorage
    for(i = 0; i < cityList.length; i++) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        $( "#prevCityList" ).append( `<li>${cityList[i].toUpperCase()}</li>` );
    } 
}

