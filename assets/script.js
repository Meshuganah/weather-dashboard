var cityLat;
var cityLon;

//Function to get the latitude and longitude of a city, which will be passed to another API call later
var getCityLocation = function(city) {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=cfa2d43ea9ac025bf9f3be2a8cd399ce`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                cityLat = data[0].lat;
                cityLon = data[0].lon;
                getCityWeather(cityLat, cityLon);
            });
        } else {
            alert("Error: City not found")
        };
    });
};

//Function that uses the lat/lon of searched city to find weater
var getCityWeather = function(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=e8cd9e5914172346c0997d3f67062c7d`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            alert("Error: City not found");
        };
    });
};

getCityLocation("Cleveland");

