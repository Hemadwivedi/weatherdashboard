$(document).ready(function () {
    var apiKey = "309a0a427f8e7089b2ced2948e65e0de";
    var url = "http://api.openweathermap.org/data/2.5/weather?q=";
    var urlFor5Days = "https://api.openweathermap.org/data/2.5/forecast?id="

    loadCity();
    getLocation();

    $("#searchbtn").on("click", function () {
        var inputValue = $("#searchinput").val();
        setcityName(inputValue);
        loadWeather(inputValue);
    })


    function loadWeather(city) {
        $("#earthforecast").empty();
        var queryParam = url + city + "&appid=" + apiKey;
        $.ajax({
            url: queryParam,
            method: "GET"

        }).then(function (response) {
            console.log(response);
            var currdate = moment(response.dt, "X").format("MM/DD/YYYY");
            $("#currentCardHeader").html(`${response.name} ( ${currdate} ) <img id="weatherIcon" src='https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png' width="50px" height="50px"">`);
            $("#temperature").html(`Temperature: ${response.main.temp} &#8457;`);
            $("#humidity").text(`Humidity: ${response.main.humidity} %`);
            $("#windSpeed").text(`Wind Speed: ${response.wind.speed} MPH`);
            getUvIndex(response);
            getFiveDayForcast(response.id);

        })
    }

    function getUvIndex(response) {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lat;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            var uvindex = response.value;
            var bgcolor;
            if (uvindex <= 3) {
                bgcolor = "green";
            } else if (uvindex >= 3 || uvindex <= 6) {
                bgcolor = "yellow";
            } else if (uvindex >= 6 || uvindex <= 8) {
                bgcolor = "orange";
            } else {
                bgcolor = "red";
            }
            var uvdisp = $("#uvIndex");
            uvdisp.text("UV Index: ");
            uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
        })
    }

    function getFiveDayForcast(cityId) {
        console.log(cityId);
        var queryParam1 = urlFor5Days + cityId + "&APPID=" + apiKey + "&units=imperial";
        $.ajax({
            url: queryParam1,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            console.log(response.list.length);
            console.log(response.list[1].dt_txt.indexOf("15:00:00"));
            var newrow = $("<div>")
            newrow.attr("class", "forecast");
            $("#earthforecast").append(newrow);
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("00:00:00") != -1) {
                    var newCol = $("<div>")
                    newCol.attr("class", "fifth");
                    newrow.append(newCol);
                    var newCard = $("<div>")
                    newCard.attr("class", "card text-white bg-primary ");
                    newCol.append(newCard);
                    var cardHead = $("<div>")
                    cardHead.attr("class", "card-header")
                    console.log(response.list[i].dt)
                    cardHead.text(moment(response.list[i].dt, "X").format("MMM Do"));
                    newCard.append(cardHead);
                    var cardImg = $("<img>")
                    cardImg.attr("class", "card-img-top")
                    var iCon = response.list[i].weather[0].icon;
                    console.log(iCon);
                    cardImg.attr("src", "https://openweathermap.org/img/wn/" + iCon + "@2x.png");
                    newCard.append(cardImg);
                    var bodyDiv = $("<div>")
                    bodyDiv.attr("class", "card-body");
                    newCard.append(bodyDiv);
                    bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + response.list[i].main.temp + " &#8457;"));
                    bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));

                }
            }

        })


    }

    function setcityName(cityName) {
        localStorage.setItem("city", cityName);
        addCity(cityName);
    }

    function loadCity() {
        var storeCity = localStorage.getItem("city");
        addCity(storeCity);
    }

    function addCity(cityName) {
        if (cityName != undefined && cityName.trim().length != 0) {
            var listItem = $("<li>");
            listItem.attr("class", "list-group-item");
            listItem.text(cityName);
            var item = $(".list-group").append(listItem)
        }
    }

    var urlForGeo = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
    var apiKeyforgeo = "AIzaSyBhaOB_RxMMOdHuGg6tAQH4sQDrtcNxGK8";
    function getLocation() {
        if (navigator.geolocation) {
            console.log("true");
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("location available");
                console.log(position.coords.latitude + "," + position.coords.longitude);
                $.ajax({
                    url: urlForGeo + position.coords.latitude + "," + position.coords.longitude + "&key=" + apiKeyforgeo,
                    method: "GET"
                }).then(function (response) {
                    var current_location = response.results[0].formatted_address;
                    $("#current_location").text(current_location);
                    loadWeather(response.results[8].address_components[0].long_name);
                })
            })
        }
    }

})