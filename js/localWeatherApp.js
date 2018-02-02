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

//Run Functions
$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      coordsLong = position.coords.longitude;
      coordsLat = position.coords.latitude;
      $.ajax({
          url: api + '/conditions/forecast/q/' + coordsLat + ',' + coordsLong + '.json',
          method: 'GET'
        })
        .then(getFarData);
    });
  } else {
    idLocation.HTML = "Geolocation is not supported by this browser.";
  }
});

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
  var idDay2Name = $('#day2Name');
  var idDay2Text = $('#day2Text');
  var idDay3Name = $('#day3Name');
  var idDay3Text = $('#day3Text');
  var idDay4Name = $('#day4Name');
  var idDay4Text = $('#day4Text');
  var idDay5Name = $('#day5Name');
  var idDay5Text = $('#day5Text');
  var idDay6Name = $('#day6Name');
  var idDay6Text = $('#day6Text');
  var idDay7Name = $('#day7Name');
  var idDay7Text = $('#day7Text');
  var weatherForecastIcon = [],
    weatherForecastText = [],
    weatherForecastDay = [];

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

  //Plug API data into displayed HTML
  idLocation.html(cityName + ", " + stateName + ", " + countryName);
  idWeatherIcon.html("<img alt='" + farData.current_observation.icon + "' class='mx-auto img-fluid' src='img\\weather\\" + farData.current_observation.icon + ".png'>");
  idWeatherDesc.html(farData.current_observation.weather);
  idDay0TempHi.html("Hi: " + farData.forecast.simpleforecast.forecastday[0].high.fahrenheit + "°F");
  idDay0TempLo.html("Lo: " + farData.forecast.simpleforecast.forecastday[0].low.fahrenheit + "°F");
  idDay0TempNow.html("Now: " + Math.round(farData.current_observation.temp_f) + "°F");
  idDay0Name.html(weatherForecastDay[0]);
  idDay2Name.html("<h5>" + weatherForecastDay[2] + "</h5><img alt='" + weatherForecastIcon[2] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[2] + ".png'>");
  idDay2Text.html(weatherForecastText[2]);
  idDay3Name.html("<h5>" + weatherForecastDay[3] + "</h5><img alt='" + weatherForecastIcon[3] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[3] + ".png'>");
  idDay3Text.html(weatherForecastText[3]);
  idDay4Name.html("<h5>" + weatherForecastDay[4] + "</h5><img alt='" + weatherForecastIcon[4] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[4] + ".png'>");
  idDay4Text.html(weatherForecastText[4]);
  idDay5Name.html("<h5>" + weatherForecastDay[5] + "</h5><img alt='" + weatherForecastIcon[5] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[5] + ".png'>");
  idDay5Text.html(weatherForecastText[5]);
  idDay6Name.html("<h5>" + weatherForecastDay[6] + "</h5><img alt='" + weatherForecastIcon[6] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[6] + ".png'>");
  idDay6Text.html(weatherForecastText[6]);
  idDay7Name.html("<h5>" + weatherForecastDay[7] + "</h5><img alt='" + weatherForecastIcon[7] + "' class='mx-auto img-fluid' src='img\\weather\\" + weatherForecastIcon[7] + ".png'>");
  idDay7Text.html(weatherForecastText[7]);
}
