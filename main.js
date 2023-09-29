
    const api = {
      key: "bf1b70d8296ebad7927b74f26efb574e",
      base: "https://api.openweathermap.org/data/2.5/"
    };

    currentLocationWeather();

    function currentLocationWeather() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          $.ajax({
            url: `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`,
            method: "GET",
            success: function (weather) {
              if (weather.cod !== 200) {
                $("#invalid-message").text("Enter a valid city name/pincode");
                $("#main-content").addClass('hidden');
              } else {
                $("#main-content").removeClass('hidden');
              }
              displayResults(weather);
            },
            error: function () {
              console.error("Error fetching weather data");
              // Handle errors here
            }
          });
        });
      }
    }


    const temp = $(".temp");
    const type = $("#temp-selection");

    type.on('change', setTemperature);

    function setTemperature() {
      let selectedType = type.val();
      if (selectedType === 'fahrenheit') {
        temp.html(`${Math.round((tempVal * 9/5) + 32)}<span>°F</span>`);
      } else if (selectedType === 'kelvin') {
        temp.html(`${Math.round(tempVal + 273.15)}<span>K</span>`);
      } else {
        temp.html(`${tempVal}<span>°C</span>`);
      }
    }

    const search = $(".search");
    const searchbox = $(".search-box");

    search.on('click', setQuery);

    function setQuery() {
      getResults(searchbox.val());
    }

    function getResults(query) {
      $.ajax({
        url: `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`,
        method: "GET",
        success: function (data) {
          $("#invalid-message").text("");
          $("#main-content").removeClass('hidden');
          displayResults(data);
        },
        error: function () {
          $("#invalid-message").text("Enter a valid city name/pincode");
          $("#main-content").addClass('hidden');
          console.error("Error fetching weather data");
        }
      });
    }

    function displayResults(weather) {
      $(".location .city").text(`${weather.name}, ${weather.sys.country}`);
      let now = new Date();
      $(".location .date").text(dateBuilder(now));
      tempVal = Math.round(weather.main.temp);
      setTemperature();
      $(".current .weather").text(weather.weather[0].description.toUpperCase());
      $(".percentage").text(`${weather.main.humidity} %`);
      $(".km-hr").text(`${weather.wind.speed} km/h`);
    }

    function dateBuilder(d) {
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${date} ${month} ${year}`;
    }