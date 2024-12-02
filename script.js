
const apiKey = ""; // Replace with your OpenWeatherMap API key
const getWeatherBtn = document.getElementById("getWeatherBtn");
const geoLocationBtn = document.getElementById("geoLocationBtn");
const cityInput = document.getElementById("city");
const unitSelect = document.getElementById("unit");
const forecastContainer = document.getElementById("forecast");
const forecastCards = document.getElementById("forecastCards");
const weatherResult = document.getElementById("weatherResult");

getWeatherBtn.addEventListener("click", () => {
  const cityName = cityInput.value;
  if (cityName === "") {
    alert("Please enter a city name");
    return;
  }
  const unit = unitSelect.value;
  getWeather(cityName, unit);
});

geoLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const unit = unitSelect.value;
      getWeatherByCoordinates(latitude, longitude, unit);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

async function getWeather(city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
    getForecast(city, unit);
  } catch (error) {
    alert(error.message);
  }
}

async function getWeatherByCoordinates(lat, lon, unit) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to fetch weather data");

    const data = await response.json();
    displayWeather(data);
    getForecastByCoordinates(lat, lon, unit);
  } catch (error) {
    alert(error.message);
  }
}

async function getForecast(city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forecast not found");

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function getForecastByCoordinates(lat, lon, unit) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Forecast not found");

    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error(error.message);
  }
}

function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;
  document.getElementById("cityName").textContent = `${name}, ${sys.country}`;
  document.getElementById("temp").textContent = `Temperature: ${main.temp}°`;
  document.getElementById(
    "description"
  ).textContent = `Condition: ${weather[0].description}`;
  document.getElementById(
    "humidity"
  ).textContent = `Humidity: ${main.humidity}%`;
  document.getElementById("wind").textContent = `Wind Speed: ${wind.speed} m/s`;

  weatherResult.style.display = "block";
}

function displayForecast(data) {
  forecastContainer.style.display = "block";
  forecastCards.innerHTML = "";

  // Filter forecast data to show only one forecast per day (use 3-hour interval data)
  const forecastData = data.list.filter((item, index) => index % 8 === 0); // This grabs one reading every 8th data point (every 24 hours)

  forecastData.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    // Format the date properly
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(); // This will show the date (e.g., "12/1/2024")

    const temp = item.main.temp;
    const icon = item.weather[0].icon; // Weather icon

    // Set up the card content
    card.innerHTML = `
            <p>${day}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${item.weather[0].description}" />
            <p>${temp}°</p>
        `;

    forecastCards.appendChild(card);
  });
}
