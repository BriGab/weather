var city = $("#city")
var container = $("#container")
var buttonContainer = $(".buttons")
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var mainweatherBox = $("#weatherDisplay");
var initialLoad = true;

//adding new buttons when a new city is entered 
function renderButtons() {
  buttonContainer.empty();

  for (var i = 0; i < cities.length; i++) {
    var newCity = $("<button>")
    newCity.addClass("btn btn-light btn-primary cityName")
    newCity.text(cities[i]);
    buttonContainer.append(newCity);

    // pulling weather for the last button added on page load
    if(i == cities.length -1){
      currentWeather(cities[i])
      getFiveDay(cities[i])
      initialLoad = false
    }
  }
}

// running functions when saved buttons are clicked
$(".vertButtons").on("click", ".cityName", function (event) {
  event.preventDefault();
  var cityName = $(this).text()
  $("#weatherDisplay").empty();
  $("#fiveDay").empty();
  currentWeather(cityName);
  getFiveDay(cityName)
});

//on click for adding new cities
$("#searchButton").on("click", function (event) {
  event.preventDefault();
  var cityName = city.val();
  cities.push(cityName);

  //setting local storage
  localStorage.setItem("cities", JSON.stringify(cities))
  
  //emptying divs for new search
  $("#weatherDisplay").empty();
  $("#fiveDay").empty();

  //rendering buttons which also calls the weather and five day functions
  renderButtons();
})

function currentWeather(cityName) {

  var apiKey = "6a28bd69913964144e4ccd8e1bb2d3d2";
  var urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;


  // call to get current weather information for a new city that has been added 
  $.ajax({
    url: urlQuery,
    method: "GET"
  }).then(function (response) {

    // pulling City Name 
    var citynameHeading = $("<h3>")
    citynameHeading.addClass("cityName")
    citynameHeading.text(response.name)
    mainweatherBox.append(citynameHeading)

    //Pulling and converting date
    var date = moment
      .unix(response.dt)
      .utc()
      .format("L");
    var mainDate = $("<h3>")
    mainDate.addClass("topDate")
    mainDate.append(date);
    mainweatherBox.append(mainDate)

    // Pulling icon 
    var iconID = response.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
    var iconImg = $("<img>")
    iconImg.attr("src", iconUrl)
    mainweatherBox.append(iconImg)

    // converting temperature
    var tempCon = response.main.temp
    var tempInFar = ((tempCon - 273.15) * 1.80 + 32).toFixed(0);

    // Pulling Temp
    var tempMain = $("<p>")
    tempMain.addClass("mainData")
    tempMain.text("Temperature (F): " + tempInFar)
    mainweatherBox.append(tempMain)

    // Pulling humidity
    var humidityMain = $("<p>")
    humidityMain.addClass("mainData")
    humidityMain.text("Humidity: " + response.main.humidity)
    mainweatherBox.append(humidityMain)

    // Pulling wind 
    var windMain = $("<p>")
    windMain.addClass("mainData")
    windMain.text("Wind: " + response.wind.speed)
    mainweatherBox.append(windMain)

    // Index Query
    var lat = response.coord.lat
    var long = response.coord.lon

    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + long + "&appid=" + apiKey;
    
    // seperate call to get the UV index for each new city added 
    $.ajax({
      url: uvQuery,
      method: "GET"
    }).then(function (response) {
      var index = $("<p>").text("UV Index: ")
      index.addClass("ovalCont")
      var oval = $("<p>").text(response.value)
      oval.addClass("ovalCont")
      var value = response.value

      // appending values to page
      mainweatherBox.append(index)
      mainweatherBox.append(oval)

      // color scale for UV index
      if (value <= 2.4) {
        oval.addClass("greenOval")
      } else if (value >= 2.5 && value <= 5.4) {
        oval.addClass("yellowOval")
      } else if (value >= 5.5 && value <= 7.4) {
        oval.addClass("orangeOval")
      } else if (value >= 7.5 && value <= 10.4) {
        oval.addClass("redOval")
      } else if (value >= 10.5) {
        oval.addClass("purpleOval")
      }

    })

  })
}

function getFiveDay(cityName) {

  // Call for 5 day weather forecast
  var apiKey = "6a28bd69913964144e4ccd8e1bb2d3d2";
  var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

  $.ajax({
    url: fiveDayUrl,
    method: "GET"
  }).then(function (response) {
    console.log(response)

    // sorting through response.list to get only information from 3pm each day 
    for (var i = 0; i < response.list.length; i++) {
      var date = moment
      .unix(response.list[i].dt)
      .utc()

      if (date.hour() === 3) {
        
        //Writing 5 day forecast information to the page
        var dayBox = $("<div>").addClass("dayCard")

        var dateOne = date.format("L");
        dayBox.append(dateOne);


        var iconID = response.list[i].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
        var temp1 = response.list[i].main.temp
        var tempInF = ((temp1 - 273.15) * 1.80 + 32).toFixed(0);

        var fiveIcon = $("<img>")
        var fiveTemp = $("<p>")
        fiveTemp.addClass("fiveData")
        var fiveHumid = $("<p>")
        fiveHumid.addClass("fiveData")
        
        fiveIcon.attr("src", iconUrl)
        fiveTemp.text("Temp: " + tempInF)
        fiveHumid.text("Humidity: " + response.list[i].main.humidity)

        dayBox.append(fiveIcon, fiveTemp, fiveHumid)
        $("#fiveDay").append(dayBox)
      }

    }

  })
}

renderButtons();