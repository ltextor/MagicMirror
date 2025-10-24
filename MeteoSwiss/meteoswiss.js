/*
 * This class is a provider for MeteoSwiss,
 * see https://www.meteoschweiz.admin.ch
 */

const METEO_SWISS_BASE = "https://app-prod-ws.meteoswiss-app.ch/v1";

WeatherProvider.register("meteoswiss", {
  providerName: "MeteoSwiss",

	// Set the default config properties that are specific to this provider
  defaults: {
    apiBase: METEO_SWISS_BASE,
    plz: null
  },

  // Fetch current weather
  fetchCurrentWeather() {
    this.fetchData(this.getUrl())
      .then(data => {
        const currentWeather = this.generateWeatherObjectFromCurrentWeather(data);
        this.setCurrentWeather(currentWeather);
      })
      .catch(error => {
        Log.error("Could not load MeteoSwiss data: ", error);
      });
  },

  // Fetch weather forecast
  fetchWeatherForecast() {
    this.fetchData(this.getUrl())
      .then(data => {
        const forecast = this.generateWeatherObjectsFromForecast(data);
        this.setWeatherForecast(forecast);
      })
      .catch(error => {
        Log.error("Could not load MeteoSwiss forecast: ", error);
      });
  },

  // Generate URL for API request
  getUrl() {
    //return `${this.config.apiBase}/plzDetail?plz=${this.config.plz}00`;
    return `https://corsproxy.io/?${encodeURIComponent(this.config.apiBase + this.config.plz + '00')}`
  },

  // Create weather object from current data
  generateWeatherObjectFromCurrentWeather(data) {
    const currentWeather = new WeatherObject();
    
    if (data.currentWeather) {
      currentWeather.temperature = data.currentWeather.temperature;
      currentWeather.weatherType = this.convertWeatherType(data.currentWeather.icon);
      currentWeather.windSpeed = WeatherUtils.convertWindToMs(data.graph.windSpeed3h[0]);
      currentWeather.windDirection = data.graph.windDirection3h[0];
    }
    
    return currentWeather;
  },

  // Create weather forecast objects
  generateWeatherObjectsFromForecast(data) {
    const forecasts = [];
    
    if (data.forecast) {
      data.forecast.forEach(day => {
        const forecast = new WeatherObject();
        forecast.date = moment(day.dayDate);
        forecast.minTemperature = day.temperatureMin;
        forecast.maxTemperature = day.temperatureMax;
        forecast.weatherType = this.convertWeatherType(day.iconDay);
        forecast.precipitation = day.precipitation;
        forecasts.push(forecast);
      });
    }
    
    return forecasts;
  },

  // Convert MeteoSwiss icons to MagicMirror weather types
  convertWeatherType(icon) {
    // Mapping of MeteoSwiss icons to MagicMirror weather types
    // https://www.meteoswiss.admin.ch/weather/weather-and-climate-from-a-to-z/weather-symbols.html
    const weatherTypes = {
      "1": "day-sunny",
      "2": "day-cloudy",
      "3": "day-cloudy",
      "4": "day-cloudy",
      "5": "day-cloudy",
      "6": "day-rain",
      "7": "day-sleet",
      "8": "day-snow",
      "9": "day-rain",
      "10": "day-sleet",
      "11": "day-snow",
      "12": "day-thunderstorm",
      "13": "day-thunderstorm",
      "14": "day-rain",
      "15": "day-sleet",
      "16": "day-snow",
      "17": "day-rain",
      "18": "day-sleet",
      "19": "day-snow",
      "20": "day-rain",
      "21": "day-sleet",
      "22": "day-snow",
      "23": "day-thunderstorm",
      "24": "day-thunderstorm",
      "25": "day-thunderstorm",
      "26": "day-cloudy",
      "27": "day-cloudy",
      "28": "day-fog",
      "29": "day-rain",
      "30": "day-snow",
      "31": "day-sleet",
      "32": "day-rain",
      "33": "day-rain",
      "34": "day-snow",
      "35": "day-cloudy",
      "36": "day-thunderstorm",
      "37": "day-thunderstorm",
      "38": "day-thunderstorm",
      "39": "day-thunderstorm",
      "40": "day-thunderstorm",
      "41": "day-thunderstorm",
      "42": "day-thunderstorm",
      "101": "night-clear",
      "102": "night-cloudy",
      "103": "nicht-cloudy",
      "104": "night-cloudy",
      "105": "night-cloudy",
      "106": "night-rain",
      "107": "night-sleet",
      "108": "night-snow",
      "109": "night-rain",
      "110": "night-sleet",
      "111": "night-snow",
      "112": "night-thunderstorm",
      "113": "night-thunderstorm",
      "114": "night-rain",
      "115": "night-sleet",
      "116": "night-snow",
      "117": "night-rain",
      "118": "night-sleet",
      "119": "night-snow",
      "120": "night-rain",
      "121": "night-sleet",
      "122": "night-snow",
      "123": "night-thunderstorm",
      "124": "night-thunderstorm",
      "125": "night-thunderstorm",
      "126": "night-cloudy",
      "127": "night-cloudy",
      "128": "night.fog",
      "129": "night-rain",
      "130": "night-snow",
      "131": "night-sleet",
      "132": "night-rain",
      "133": "night-rain",
      "134": "night-snow",
      "135": "night-cloudy",
      "136": "night-thunderstorm",
      "137": "night-thunderstorm",
      "138": "night-thunderstorm",
      "139": "night-thunderstorm",
      "140": "night-thunderstorm",
      "141": "night-thunderstorm",
      "142": "night-thunderstorm"
    };
    
    return weatherTypes[icon] || "na";
  }
});