<template>
    <div>
      
      <div>
        <p id="search-history-title">[Your search history will be displayed here. <br> History will be erased with closing browser]</p>
        
        <div v-for="location in searchHistory" :key="location" id="search-history-result">
          <button class="button-history" @click="searchWeatherS(location)">{{ location }}</button>
        </div>
      </div>
      
      <input class="search-input"
      v-model="searchInput"
      type="text"
      placeholder="Enter Search Location"
      ref="searchInputField"
      
      @input="cancelResetTimer"
      />

      <button class="button-search" @click="searchWeather">Search</button><br><br>
      
      <!-- Display weather information -->
      <div id="div-result" v-if="weatherData">
        <p id="weather-title">Weather Information</p>
        <div style="display: inline-flex;">
          <div id="div-child">
            <img :src="getWeatherIconURL(weatherData.weather[0].icon)" :alt="weatherData.weather[0].description" />
          </div>
          <div id="div-child">
            {{ weatherData.main.temp }}°C
          </div>
        </div>
          
        <div id="div-desc">
          {{ weatherData.weather[0].description }} in {{ weatherData.name }}, {{ weatherData.sys.country }}
        </div>

        <div id="div-additional">
          Wind Speed: {{ weatherData.wind.speed }} m/s, Humidity: {{ weatherData.main.humidity }}%, Pressure: {{ weatherData.main.pressure }} hPa
        </div>
        <br>
      </div>

      <br><br>
      <!-- Display weather Hourly forecast -->
      <div id="div-hourly-forecast-parent" v-if="hourlyForecastData">
        <p id="weather-title">Hourly Forecast</p>
        <div v-for="(forecast, index) in sortedHourlyForecast" :key="forecast.dt" class="hourly-forecast-item" :class="{'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0}">
          <div id="div-hourly-forecast-child">
            {{ getTimeFromUnixTimestamp(forecast.dt) }} 
            <img :src="getWeatherIconURL(forecast.weather[0].icon)" :alt="forecast.weather[0].description" style="vertical-align:middle" />
            {{ forecast.main.temp }}°C
          </div>
        </div>
      </div>


    </div>
</template>
  
<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchInput: '',
        weatherData: null,
        searchHistory: [],
        resetTimer: null,
        hourlyForecastData: null,
      };
    },

    computed: {
      sortedHourlyForecast() {
        if (this.hourlyForecastData) {
          // Create a new sorted array based on the time
          const sortedArray = [...this.hourlyForecastData.list].sort((a, b) => a.dt - b.dt);
          return sortedArray;
        }
        return [];
      },
    },




    methods: {
      async searchWeather() {
        const searchLocation = this.searchInput.trim();
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=metric&APPID=51dbc04ccc1a7834537fc0fc1a86af8b`);
          const { lat, lon } = response.data.coord;

          this.weatherData = response.data;

          if (!this.searchHistory.includes(searchLocation)) {
            // Check if the search history exceeds the maximum limit (e.g., 3)
            if (this.searchHistory.length >= 3) {
              this.searchHistory.shift(); // Remove the first (oldest) search history entry
            }
            this.searchHistory.push(searchLocation);
            this.saveSearchHistory();
          }

          // Fetch and set hourly forecast data
          const hourlyForecastData = await this.getHourlyForecast(lat, lon);
          if (hourlyForecastData) {
            this.hourlyForecastData = hourlyForecastData;
          }
        } catch (error) {
          console.error(error);
        }
      },

      // This method to search and fetch weather data when click on the city name in the search history list
      async searchWeatherS(location) {
        const searchLocation = location;
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=metric&APPID=51dbc04ccc1a7834537fc0fc1a86af8b`);
          const { lat, lon } = response.data.coord;

          this.weatherData = response.data;

          if (!this.searchHistory.includes(searchLocation)) {
            this.searchHistory.push(searchLocation);
            this.saveSearchHistory();
          }

          // Fetch and set hourly forecast data
          const hourlyForecastData = await this.getHourlyForecast(lat, lon);
          if (hourlyForecastData) {
            this.hourlyForecastData = hourlyForecastData;
          }
        } catch (error) {
          console.error(error);
        }
      },

      async getHourlyForecast(lat, lon) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=51dbc04ccc1a7834537fc0fc1a86af8b`
          );
          return response.data;
        } catch (error) {
          console.error('Error fetching hourly forecast:', error);
        }
        return null;
      },

      getTimeFromUnixTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      },

      saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
      },
      
      loadSearchHistory() {
        const savedSearchHistory = localStorage.getItem('searchHistory');
        if (savedSearchHistory) {
          this.searchHistory = JSON.parse(savedSearchHistory);
        }
      },

      getWeatherIconURL(icon) {
        return `https://openweathermap.org/img/wn/${icon}.png`;
      },
      
      clearSearchHistoryOnClose() {
        window.addEventListener('beforeunload', () => {
          localStorage.removeItem('searchHistory');
        });
      },

      startResetTimer() {
        this.resetTimer = setTimeout(() => {
          this.resetSearchInput();
        }, 2000);
      },

      cancelResetTimer() {
        clearTimeout(this.resetTimer);
        this.startResetTimer();
      },

      resetSearchInput() {
        this.searchInput = '';
        this.$refs.searchInputField.placeholder = 'Enter Search Location';
      },

      handleLinkClick(event) {
        this.searchHistory.unshift(event.target.textContent.trim());
        if (this.searchHistory.length > 3) {
          this.searchHistory.splice(3); // Keep only the first 3 items
        }
        event.preventDefault();
      }
  
    },

    created() {
      this.loadSearchHistory();
      this.clearSearchHistoryOnClose();
    },
  };
</script>
  
<style>
#search-history-title {
  size: 18px;
  color: #333333;
}

#search-history-result{
  display: inline-flex;
  margin: 0 15px 10px 0;
  background-color: #333333;
  border-radius: 15px;
}

.button-history {
  background-color: #1c4f83;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 15px;
  min-width: 100px;
  height: 30px;
}

.button-search {
  background-color: #a7c8e8;
  border: none;
  color: #2c3e50;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 15px;
  height: 35px;
  width: 125px;
}

.search-input {
  background-color: #b3b3b3;
  color: #2c3e50;
  border: none;
  text-align: center;
  display: inline-block;
  font-size: 14px;
  border-radius: 15px;
  height: 35px;
  width: 350px;
}

#div-result{
  width: 450px;
  margin: auto;
  text-align: center;
  border: #2c3e50 solid 1px;
  border-radius: 15px;
  color: #2c3e50;
  background-color: #1f71ac42;
}

#weather-title{
  font-size: 22px;
  font-weight: bold;
}

#div-child{
  width:75px;
  margin: auto;
}

#div-desc{
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
}

#div-additional{
  font-size: 14px;
}

#div-hourly-forecast-parent{
  width: 450px;
  margin: auto;
  text-align: center;
  border: #2c3e50 solid 1px;
  border-radius: 15px;
  color: #2c3e50;
}

#div-hourly-forecast-child{
  width: 450px;
  color: #2c3e50;
  font-size: 14px;
  vertical-align: middle;
  border-top: #2c3e50 solid 1px;
  margin: auto;
}

.even-row {
  background-color: #1f71ac42;
}


</style>