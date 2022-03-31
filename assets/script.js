var cityLat;
var cityLon;
var currentDayWeather = $(".current-day-weather");
var searchedCity;
var cityNameEl = document.querySelector("#city-name");
var citySearchEl = document.querySelector("#city-search");
var recentSearchEl = document.querySelector(".recent-searches");
var recentSearchBtnEl = document.querySelector(".recentSearchBtn");

//Section of dynamic HTML elements to add to page 
var cityName = document.createElement("h3");
var cityTemp = document.createElement("span");
var cityWind = document.createElement("span");
var cityHumid = document.createElement("span");
var cityUv = document.createElement("span");
var colorUv = document.createElement("span");



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
                saveSearch();
                
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
                cityName.textContent = "";
                cityName.textContent = `${searchedCity}: ${moment().format("MM")}/${moment().format("DD")}/${moment().format("YYYY")}`;

                //Creates a span for the current temperature
                cityTemp.textContent = "";
                cityTemp.textContent = `Temp: ${data.current.temp} °F`;

                //Creates a span for the current wind force  
                cityWind.textContent = "";
                cityWind.textContent = `Wind: ${data.current.wind_speed} MPH`;

                //Creates a span for the current humidity           
                cityHumid.textContent = "";
                cityHumid.textContent = `Humidity: ${data.current.humidity}%`;

                //Creates a span for the current UV Index
                //TODO add conditional span to color code UV index      
                cityUv.textContent = "";
                colorUv.textContent = "";
                colorUv.textContent = `${data.current.uvi}`;

                if (data.current.uvi <= 3) {
                    $(colorUv).removeClass("bg-success bg-warning bg-danger");
                    colorUv.classList = "bg-success rounded";
                } else if (data.current.uvi > 3 && data.current.uvi <= 6) {
                    $(colorUv).removeClass("bg-success bg-warning bg-danger");
                    colorUv.classList = "bg-warning rounded";
                } else if (data.current.uvi > 6) {
                    $(colorUv).removeClass("bg-success bg-warning bg-danger");
                    colorUv.classList = "bg-danger rounded";
                };

                cityUv.textContent = `UV Index: `;
                cityUv.appendChild(colorUv);

                //Appends all of the data gathered into the current weather container
                currentDayWeather.append(cityName);
                currentDayWeather.append(cityTemp);
                currentDayWeather.append(cityWind);
                currentDayWeather.append(cityHumid);
                currentDayWeather.append(cityUv);

                $(".forecast-header").text("5-Day Forecast:");
                //For loop to go through the forecasted data and create the necessary elements
                //TODO add if statements for icons
                for (i = 0; i < 5; i++) {
                    $(`#day-${i}`).empty();

                    var futureDate = document.createElement("h4");
                    var futureIcon = document.createElement("img");
                    var futureTemp = document.createElement("span");
                    var futureWind = document.createElement("span");
                    var futureHumid = document.createElement("span");
               
                    //Sets new elements to data for the future dates
                    futureDate.textContent = `${moment().format("MM")}/${moment().add(i+1, "days").format("DD")}/${moment().format("YYYY")}`;
                    futureIcon.setAttribute("src", `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`)
                    futureTemp.textContent = `Temp: ${data.daily[i].temp.day} °F`;
                    futureWind.textContent = `Wind: ${data.daily[i].wind_speed}`;
                    futureHumid.textContent = `Humidity: ${data.daily[i].humidity}%`;

                    //Appends new items for future dates
                    document.querySelector(`#day-${i}`).append(futureDate);
                    document.querySelector(`#day-${i}`).append(futureIcon);
                    document.querySelector(`#day-${i}`).append(futureTemp);
                    document.querySelector(`#day-${i}`).append(futureWind);
                    document.querySelector(`#day-${i}`).append(futureHumid);  
                    
                };

                //$(".forecast").addClass("card");

                
            });
        } else {
            alert("Error: City not found");
        };
    });
};

//Secondary API call to use with recent search buttons, that does NOT re-save the search
//REMOVE THIS if better method is found
var recentSearchWeather = function(city) {
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

//Creates a list of buttons that represent recent searches
var saveSearch = function() {
        var recentSearchBtn = document.createElement("button");

        recentSearchBtn.textContent = `${searchedCity}`;
        recentSearchBtn.classList = "w-100 recentSearchBtn";
        recentSearchBtn.setAttribute("data-city", `${searchedCity}`);

        recentSearchEl.appendChild(recentSearchBtn);
};

//Handles the recent searches button logic
var recentSearchHandler = function(event) {
    var searchAgain = event.target.getAttribute("data-city");
    
    recentSearchWeather(searchAgain);
};

//Handles the submission form data to pass it along to the getCityLocation function
var citySearchHandler = function(event) {
    event.preventDefault();

    var search = cityNameEl.value;

    if (search) {
        getCityLocation(search);
        cityNameEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};

citySearchEl.addEventListener("submit", citySearchHandler);
recentSearchEl.addEventListener("click", recentSearchHandler);