import axios from "axios";
import { format } from "date-fns";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(coords.latitude, coords.longitude);
}

function positionError() {
  alert("There was an error!");
}

function getWeather(lat, lon) {
  axios
    .get("http://localhost:3001/weather", { params: { lat, lon } })
    .then((res) => {
      renderWeather(res.data);
    })
    .catch((e) => {
      console.log(e);
      alert("something went wrong");
    });
}

function renderWeather({ current, daily, hourly }) {
  document.body.classList.remove("blurred");
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
}

function getIconUrl(icon, { large = false } = {}) {
  const size = large ? "@2x" : "";
  return `http://openweathermap.org/img/wn/${icon}${size}.png`;
}

function setValue(selector, value, node) {
  node.querySelector(`[data-${selector}]`).textContent = value;
}

function renderCurrentWeather(current) {
  const currentIcon = document.querySelector("[data-current-icon]");
  currentIcon.src = getIconUrl(current.icon, { large: true });
  setValue("current-temp", current.currentTemp, document);
  setValue("current-high", current.highTemp, document);
  setValue("current-low", current.lowTemp, document);
  setValue("current-wind", current.windSpeed, document);
  setValue("current-fl-high", current.highFeelsLike, document);
  setValue("current-fl-low", current.lowFeelsLike, document);
  setValue("current-description", current.description, document);
}

function formatDate(timestamp, formatStr) {
  return format(new Date(timestamp), formatStr);
}

function renderDailyWeather(daily) {
  const dayTemplate = document.querySelector("#day-weather");
  const daySection = document.querySelector(".day-section");
  for (let day of daily) {
    const dayCard = dayTemplate.content.cloneNode(true);
    const dailyIcon = dayCard.querySelector("[data-daily-icon]");
    dailyIcon.src = getIconUrl(day.icon);
    setValue("daily-temp", day.temp, dayCard);
    setValue("daily-day", formatDate(day.timestamp, "EEEE"), dayCard);
    daySection.append(dayCard);
  }
}

function renderHourlyWeather(hourly) {
  const hourTemplate = document.querySelector("#hour-weather");
  const hourlySection = document.querySelector("[data-hours]");
  for (let hour of hourly) {
    const hourCard = hourTemplate.content.cloneNode(true);
    const hourlyIcon = hourCard.querySelector("[data-hour-icon]");
    hourlyIcon.src = getIconUrl(hour.icon);

    setValue("hour-day", formatDate(hour.timestamp, "EEEE"), hourCard);
    setValue("hour-hour", formatDate(hour.timestamp, "ha"), hourCard);
    setValue("hour-temp", hour.temp, hourCard);
    setValue("hour-fl-temp", hour.feelsLike, hourCard);
    setValue("hour-wind", hour.windSpeed, hourCard);
    setValue("hour-precip", hour.precip, hourCard);

    hourlySection.append(hourCard);
  }
}
