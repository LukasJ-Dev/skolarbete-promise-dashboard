
import axios from 'axios';



const currentTimeElement = document.getElementById("current-time");
const currentDateElement = document.getElementById("current-date");

const tempElement = document.getElementById("temp");
const locationElement = document.getElementById("location");

const creditElement = document.getElementById("credit");

const api1Element = document.getElementById("api-1");
const api2Element = document.getElementById("api-2");

let image_data = null;

function getImage() {
    axios.get(`https://api.unsplash.com/photos/random/?client_id=${image_key}&query=landscape`).then((response) => {
        preloadImage(response.data.urls.raw).then(src => {
            document.body.style.backgroundImage = `url('${src}')`;
            creditElement.innerHTML = `Image by ${response.data.user.name}`;
        });
    }).catch(() => {
      
    });
}

const weather_key = "e8429a32592271dca8c4d08d1fbd20ae";
const image_key = "E-HJlRKLsZx8r9McZlGmA12NZ9GO5wsiHnwcdVoeF1Y";

const preloadImage = src => new Promise((resolve, reject) => {
    const img = new Image(src);
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = () => reject();
});

  function getWeather(position) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${weather_key}`).then(response => {

        const temp = Math.round((response.data.main.temp - 273.15) * 100) / 100;
        tempElement.innerHTML = temp + " degree celcius";
        locationElement.innerHTML = response.data.name;
    }).catch(() => {
      console.error("Couldn't get weather");
      tempElement.innerHTML = "Couldn't get weather";
      locationElement.innerHTML = "";
    });
  }

  function getCurrency() {
    axios.get("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/sek.json").then(response => {
      api1Element.innerHTML = `1 EURO = ${Math.round(response.data.sek * 100) / 100} SEK`;
      console.log("a");
    }).catch(() => {
      api1Element.innerHTML = "Couldn't access the exchange rate";
    });
  }

  function getAdvice() {
    axios.get("https://api.adviceslip.com/advice").then(response => {
      api2Element.innerHTML = response.data.slip.advice;
    }).catch(() => {
      api2Element.innerHTML = "No advice avaliable";
    });
  }

  let pictureChanged = new Date();

  function updateTime() {
    const curr = new Date();
    currentTimeElement.innerHTML = curr.toLocaleTimeString();
    currentDateElement.innerHTML = curr.toLocaleDateString();

    if(curr-pictureChanged >= 30000) {
      pictureChanged = new Date();
      getImage();
    }
  }

  navigator.geolocation.getCurrentPosition(getWeather, () => {
    console.error("Couldn't get user location");
    tempElement.innerHTML = "Couldn't get your position";
  });


  getImage();
  updateTime();
  
  getCurrency();
  
  getAdvice();
  

setInterval(updateTime, 1000);
