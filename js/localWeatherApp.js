//Note: 'days' are in truth either nighttime or daytime.
//For example, if script is loaded Monday @ Noon then the following is true:
//Day 0 : Monday
//Day 1 : Monday Night
//Day 2 : Tuesday
//Day 3 : Tuesday Night
//Etc.
//Declare Global Variables
var idLocation = $('#location');
var coordsLat, coordsLong;
var api = 'https://api.wunderground.com/api/80363c0eada12400';
var currentDate = new Date();
var month = currentDate.getMonth();
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var idDate = $('#date');
var degree = "F";
var weatherForecastIcon = [],
  weatherForecastText = [],
  weatherForecastDay = [];
//Run Functions
$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      coordsLong = position.coords.longitude;
      coordsLat = position.coords.latitude;
      $.ajax({
        url: api + '/conditions/forecast/q/' + coordsLat + ',' + coordsLong + '.json',
        method: 'GET'
      }).then(getFarData);
    });
  } else {
    idLocation.HTML = "Geolocation is not supported by this browser.";
  }
});
//Switch between Farenheit or Celcius
function changeDegree() {
  switch (degree) {
    case 'F':
      degree = 'C';
      break;
    case 'C':
      degree = 'F';
      break;
  }
}
//Get Farenheit data from fetched API
function getFarData(farData) {
  //Plug date into HTML
  idDate.html(month + 1 + " | " + day + " | " + year);
  //Declare Local Variables
  var cityName = farData.current_observation.display_location.city;
  var stateName = farData.current_observation.display_location.state;
  var countryName = farData.current_observation.display_location.country;
  var idWeatherIcon = $('#weatherIcon');
  var idWeatherDesc = $('#weatherDesc');
  var idDay0TempHi = $('#day0TempHi');
  var idDay0TempLo = $('#day0TempLo');
  var idDay0TempNow = $('#day0TempNow');
  var idDay0Name = $('#day0Name');
  //Plug API data into displayed HTML
  idLocation.html(cityName + ", " + stateName + ", " + countryName);
  idWeatherIcon.html("<img alt='" + farData.current_observation.icon + "' class='mx-auto img-fluid' src='img\\weather\\" + farData.current_observation.icon + ".png'>");
  idWeatherDesc.html(farData.current_observation.weather);
  idDay0TempHi.html("Hi: " + farData.forecast.simpleforecast.forecastday[0].high.fahrenheit + "°F");
  idDay0TempLo.html("Lo: " + farData.forecast.simpleforecast.forecastday[0].low.fahrenheit + "°F");
  idDay0TempNow.html("Now: " + Math.round(farData.current_observation.temp_f) + "°F");
  idDay0Name.html(weatherForecastDay[0]);
  //Build forecast arrays from API data
  buildForecastArrays(farData);
  //Push API forecast data to HTML DOM
  displayForecast();
}

function buildForecastArrays(farData) {
  //Build arrays with data from API
  for (var i = 0; i < 8; i++) {
    var iconStr = farData.forecast.txt_forecast.forecastday[i].icon;
    var textStr = farData.forecast.txt_forecast.forecastday[i].fcttext;
    var dayStr = farData.forecast.txt_forecast.forecastday[i].title;
    //Remove nt_ from pulled API icon names to avoid loading night icons
    if (iconStr.startsWith('nt_')) {
      weatherForecastIcon.push(iconStr.substring(3));
    } else {
      weatherForecastIcon.push(iconStr);
    }
    weatherForecastText.push(textStr);
    weatherForecastDay.push(dayStr);
  }
}

function displayForecast() {
  for (var i = 2; i < 8; i++) {
    //Declare Local Variables
    var dayNameElement = "day" + i + "Name";
    var dayIconElement = "day" + i + "Icon";
    var dayTextElement = "day" + i + "Text";
    var src = "img\\weather\\" + weatherForecastIcon[i] + ".png";
    var idDayName = document.getElementById(dayNameElement);
    var idDayIcon = document.getElementById(dayIconElement);
    var idDayText = document.getElementById(dayTextElement);
    //Build img tag
    var img = document.createElement("img");
    img.setAttribute("alt", weatherForecastIcon[i]);
    img.setAttribute("class", "mx-auto img-fluid");
    img.setAttribute("src", src);
    //Push Day name to HTML
    var foo = document.createTextNode(weatherForecastDay[i]);
    idDayName.removeChild(idDayName.firstChild);
    idDayName.appendChild(foo);
    //Push Day icon to HTML
    idDayIcon.removeChild(idDayIcon.firstChild);
    idDayIcon.appendChild(img);
    //Push Day text to HTML
    foo = document.createTextNode(weatherForecastText[i]);
    idDayText.removeChild(idDayText.firstChild);
    idDayText.appendChild(foo);
  }
}
