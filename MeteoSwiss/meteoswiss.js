WeatherProvider.register("meteoswiss", {
  providerName: "MeteoSwiss",

  // Basis-URL für MeteoSwiss API
  defaults: {
    apiBase: "https://app-prod-ws.meteoswiss-app.ch/v1",
    lat: null,
    lon: null,
    plz: null
  },

  // Aktuelles Wetter abrufen
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

  // Wettervorhersage abrufen
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

  // URL für API-Anfrage generieren
  getUrl() {
    return `${this.config.apiBase}/plzDetail?plz=${this.config.plz}00`;
  },

  // Wetterobjekt aus aktuellen Daten erstellen
  generateWeatherObjectFromCurrentWeather(data) {
    const currentWeather = new WeatherObject();
    
    if (data.currentWeather) {
      currentWeather.temperature = data.currentWeather.temperature;
      currentWeather.weatherType = this.convertWeatherType(data.currentWeather.icon);
      currentWeather.humidity = data.currentWeather.humidity;
      currentWeather.windSpeed = data.currentWeather.windSpeed;
    }
    
    return currentWeather;
  },

  // Wettervorhersage-Objekte erstellen
  generateWeatherObjectsFromForecast(data) {
    const forecasts = [];
    
    if (data.forecast) {
      data.forecast.forEach(day => {
        const forecast = new WeatherObject();
        forecast.date = moment(day.date);
        forecast.minTemperature = day.temperatureMin;
        forecast.maxTemperature = day.temperatureMax;
        forecast.weatherType = this.convertWeatherType(day.icon);
        forecast.precipitation = day.precipitation;
        forecasts.push(forecast);
      });
    }
    
    return forecasts;
  },

  // MeteoSwiss Icons zu MagicMirror Wettertypen konvertieren
  convertWeatherType(icon) {
    // Mapping der MeteoSwiss Icons zu MagicMirror Wettertypen
    const weatherTypes = {
      "1": "day-sunny",
      "2": "day-cloudy",
      "3": "cloudy",
      "4": "rain",
      "5": "snow",
      "6": "thunderstorm"
      // Weitere Mappings hinzufügen
    };
    
    return weatherTypes[icon] || "na";
  }
});