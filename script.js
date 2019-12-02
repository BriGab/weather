var city = $("#city")
var container = $("#container")
var buttonContainer = $(".buttons")
var cities = [];


//adding new buttons when a new city is entered 
function renderButtons(){
buttonContainer.empty();

for (var i = 0; i < cities.length; i++) {
    var newCity =  $("<button>")
    newCity.addClass("btn btn-light btn-primary vertButtons")
    newCity.text(cities[i]);

    buttonContainer.append(newCity);
}
}

//on click for adding new cities
$("#searchButton").on("click", function(event){
   event.preventDefault();
   var cityName = city.val();
   cities.push(cityName)

   var apiKey = "6a28bd69913964144e4ccd8e1bb2d3d2";
   var urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;


   // call to get basic weather information for a new city that has been added 
   $.ajax({
    url: urlQuery,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var iconID = response.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"

    $(".cityName").text(response.name) 
    $("#icon").attr("src", iconUrl)
    $(".humidity").text("Humidity: " + response.main.humidity)
    $(".wind").text("Wind: " + response.wind.speed)

    console.log(response.weather[0].icon)
    var tempCon = response.main.temp
    var tempInFar = ((tempCon- 273.15) * 1.80 + 32).toFixed(0);

    $(".temperature").text("Temperature (F): " + tempInFar)

    var lat = response.coord.lat
    var long = response.coord.lon

  var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + long +"&appid=" + apiKey;
    // seperate call to get the UV index for each new city added 
    $.ajax({
        url: uvQuery,
        method: "GET"
    }).then(function(response) {
        console.log(response)
       
        // $("#date").text(response.date_iso)
        var oval = $("#scale").text(response.value)
        var value = response.value
        console.log(value)
        if (value <= 2.4){
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
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

$.ajax ({
  url: fiveDayUrl,
  method: "GET"
}).then(function(response) {
  console.log(response)
})

  })  
   renderButtons();
})

renderButtons();