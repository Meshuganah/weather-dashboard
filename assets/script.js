var cityLat;
var cityLon;
var currentDayWeather = $(".current-day-weather");
var searchedCity;

//Function to get the latitude and longitude of a city, which will be passed to another API call later
var getCityLocation = function(city) {
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=cfa2d43ea9ac025bf9f3be2a8cd399ce`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                cityLat = data[0].lat;
                cityLon = data[0].lon;
                searchedCity = "";
                searchedCity = city;
                getCityWeather(cityLat, cityLon);
            });
        } else {
            alert("Error: City not found")
        };
    });
};

//Function that uses the lat/lon of searched city to find weather
var getCityWeather = function(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=e8cd9e5914172346c0997d3f67062c7d`;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);

                //Creates a header for the searched city and the date of the current weater
                var cityName = document.createElement("h3");
                cityName.textContent = `${searchedCity}: ${moment().format("MM")}/${moment().format("DD")}/${moment().format("YYYY")}`;

                //Creates a span for the current temperature
                var cityTemp = document.createElement("span");
                cityTemp.textContent = `Temp: ${data.current.temp} °F`;

                //Creates a span for the current wind force
                var cityWind = document.createElement("span");
                cityWind.textContent = `Wind: ${data.current.wind_speed} MPH`;

                //Creates a span for the current humidity
                var cityHumid = document.createElement("span");
                cityHumid.textContent = `Humidity: ${data.current.humidity}%`;

                //Creates a span for the current UV Index
                //TODO add conditional span to color code UV index
                var cityUv = document.createElement("span");
                cityUv.textContent = `UV Index: ${data.current.uvi}`;

                //Appends all of the data gathered into the current weather container
                currentDayWeather.append(cityName);
                currentDayWeather.append(cityTemp);
                currentDayWeather.append(cityWind);
                currentDayWeather.append(cityHumid);
                currentDayWeather.append(cityUv);

                //For loop to go through the forecasted data and create the necessary elements
                //TODO add if statements for icons
                for (i = 0; i < 5; i++) {
                    //Declares headers and spans that will be added
                    var futureDate = document.createElement("h4");
                    var futureTemp = document.createElement("span");
                    var futureWind = document.createElement("span");
                    var futureHumid = document.createElement("span");

                    //Sets new elements to data for the future dates
                    futureDate.textContent = `${moment().format("MM")}/${moment().add(i+1, "days").format("DD")}/${moment().format("YYYY")}`;
                    futureTemp.textContent = `Temp: ${data.daily[i].temp.day} °F`;
                    futureWind.textContent = `Wind: ${data.daily[i].wind_speed}`;
                    futureHumid.textContent = `Humidity: ${data.daily[i].humidity}%`;

                    document.querySelector(`#day-${i}`).append(futureDate);
                    document.querySelector(`#day-${i}`).append(futureTemp);
                    document.querySelector(`#day-${i}`).append(futureWind);
                    document.querySelector(`#day-${i}`).append(futureHumid);                
                };
            });
        } else {
            alert("Error: City not found");
        };
    });
};

getCityLocation("Cleveland");

