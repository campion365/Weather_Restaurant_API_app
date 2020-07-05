'use strict'


$(".help").click(function () {
  alert("Input a zip code into the form below. Weather information and restaurants located in or near the zip code will.");
});


const weatherBaseURL = `https://api.weather.gov/points/`
const geoBaseURL = `https://open.mapquestapi.com/geocoding/v1/address?key=MCCppEt045mG3EoM97nQbYGGPv5SbKuw&location=`

function getLocInfo(zipInput) {
  fetch(geoBaseURL + zipInput)
    .then(response =>
      response.json().then(data => ({

        data: data,
        status: response.status


      })).then(function (getTemp) {
        let latLng = getTemp.data.results[0].locations[0].latLng
        let lat = parseFloat(latLng.lat.toFixed(4))
        let lng = parseFloat(latLng.lng.toFixed(4))
        let latfood= latLng.lat
        let lngfood= latLng.lng

        console.log("getLocInfo");
        console.log(getTemp.status, lat, lng, latfood, lngfood);
        getWeatherFromLatLng(lat, lng);
        getRestaurants(latfood, lngfood);
      }));
}


function getWeatherFromLatLng(lat, lng) {
  let url = `https://api.weather.gov/points/${lat}%2C${lng}`
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw new Error("Sorry, please try a different zip code")
    }).then(getTemp => {
      console.log("getWeatherFromLatLng")
      console.log(getTemp)
      if (getTemp && getTemp.properties && getTemp.properties.forecast) {
        getDetailedForecast(getTemp.properties.forecast)
      }
    })
    .catch(err => {
      $('#js-error-msg').removeClass('hidden');
      $('#js-error-msg').append(`${err.message}`);
    })
}


function getDetailedForecast(url) {
  fetch(url)
    .then(response => {
      return response.json()
    }).then(getTemp => {
      console.log("getDetailedForecast")
      if (getTemp && getTemp.properties && getTemp.properties.periods && getTemp.properties.periods[0]) {

        console.log(getTemp.properties.periods[0])
        console.log(getTemp.properties.periods[0].temperature)

        displayWeather(getTemp);

      }
    })
}


function getRestaurants(latfood, lngfood) {
  let Restauranturl = `https://developers.zomato.com/api/v2.1/geocode?lat=${latfood}&lon=${lngfood}`
  const options = {
    headers: {
      "user-key": "97671a2f10f5fada11e3c24ffcb8f74d"
    }
  };
  fetch(Restauranturl,options)
    .then(response => {
      return response.json()
    }).then(res => {
      console.log("getRestaurant" + latfood + lngfood)
      displayRestaurants(res)
    })
}


function displayWeather(weatherData) {
  console.log("showing final weather");
  $('#forecast-area').removeClass('hidden');
  $('#forecast-area').append(
    `<div class = "results-header">
    <p>Weather Info</p>
    </div>
    <h3>${weatherData.properties.periods[0].detailedForecast}</h3>`
  );
}


function displayRestaurants(res) {
  console.log("showing restaurants");
  $('#restaurant-area').removeClass('hidden');
    $('#restaurant-area').append(
    `<div class = "results-header">
        <p>Where to Eat</p>
        </div>`);

  for (let i=0; i<res.nearby_restaurants.length; i++) {
    if (i>=10) break

  $('#restaurant-area').append(
    ` <section class= "restaurant-boxes">
    <ul class="restaurants">
      <li><h3>${res.nearby_restaurants[i].restaurant.name}</h3>
      <li><h2>${res.nearby_restaurants[i].restaurant.location.address}</h2>
      <li><h2><a href="${res.nearby_restaurants[i].restaurant.url}" target="_blank">${res.nearby_restaurants[i].restaurant.name} Website</h2></a>
      </li>
    </ul>
    </section>`
  );
  }
}


$('#newSearch').click(function () {
  $('#Zip-Field').val("");
  $('#restaurant-area').empty();
  $('#forecast-area').empty();
  $('#newSearch').addClass('hidden');
  $('#newSearchbottom').addClass('hidden');
  $('#forecast-area').empty()
  $(window).scrollTop(0);
})

$('#newSearchbottom').click(function () {
  $('#Zip-Field').val("");
  $('#restaurant-area').empty();
  $('#forecast-area').empty();
  $('#newSearchbottom').addClass('hidden');
  $('#newSearch').addClass('hidden');
  $('#forecast-area').empty()
  $(window).scrollTop(0);
})

function validateZip(zipInput){
  for (var i = 0; i < zipCodeList.length; i++) {
        if (zipCodeList[i] == zipInput) {
          getLocInfo(zipInput);
          $('#newSearch').removeClass('hidden');
          $('#newSearchbottom').removeClass('hidden');
          return
        }
  }
      alert("Please enter a valid 5-digit zip code");
     $('#Zip-Field').val("");
     
}




function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#restaurant-area').empty()
    $('#forecast-area').empty()
    const zipInput = $('#Zip-Field').val();
    console.log("submit recorded");
    validateZip(zipInput);
  });
}

$(watchForm);

