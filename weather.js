$(document).ready(function () {
    var apiKey = "309a0a427f8e7089b2ced2948e65e0de";
    var url = "http://api.openweathermap.org/data/2.5/weather?q=";
    var urlFor5Days = "https://api.openweathermap.org/data/2.5/forecast?id="

    function currentDay() {

        var now = moment();
        var currentDay = $(".currentday").text(now.format("dddd, MMMM Do YYYY, h:mm a"));
        console.log(currentDay);
        var hours = now.hour();

    }
    currentDay();
    loadCity();
    $("#searchbtn").on("click", function () {
        $("#earthforecast").empty();
        var inputValue = $("#searchinput").val();
        setcityName(inputValue);
        console.log(inputValue);
        var queryParam = url + inputValue + "&appid=" + apiKey;
        $.ajax({
            url: queryParam,
            method: "GET"

        }).then(function (response) {
            console.log(response);

            var currentCard = $("<div>");
            currentCard.attr("class", "card bg-light");
            $("#earthforecast").append(currentCard);
            var currentCardHeader = $("<div>");
            currentCardHeader.attr("class", "card-header");
            currentCardHeader.text(response.name);
            currentCard.append(currentCardHeader);
            console.log(currentCard);
            var currdate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
            var currentdatestorage = $("<p>");
            currentdatestorage.attr("class", "card-text");
            currentdatestorage.text(currdate);
            console.log(currentdatestorage);
            currentCard.append(currentdatestorage);
            var cardBody = $("<div>");
            cardBody.attr("class", "card-body");
            currentCard.append(cardBody);
            var temp = $("<p>");
            temp.attr("class", "card-text");
            temp.html("Temperature: " + response.main.temp + " &#8457;");
            cardBody.append(temp);

            var humidity = $("<p>");
            humidity.attr("class", "card-text");
            humidity.text("Humidity: " + response.main.humidity + "%");
            cardBody.append(humidity);


            var windSpeed = $("<p>");
            windSpeed.attr("class", "card-text");
            windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");
            cardBody.append(windSpeed);
            currentCard.append(cardBody);
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
                var uvdisp = $("<p>");
                uvdisp.attr("class", "card-text")
                uvdisp.text("UV Index: ");
                uvdisp.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
                cardBody.append(uvdisp);
            })

            currentCard.append(cardBody);
            getFiveDayForcast(response.id);

        })

    })
    //weather forcast for 5 days

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





})
//https://api.openweathermap.org/data/2.5/forecast?id=1269633&APPID=309a0a427f8e7089b2ced2948e65e0de&units=imperial
//https://openweathermap.org/img/wn/01n@2x.png
//moment(response.list[i].dt,"X"