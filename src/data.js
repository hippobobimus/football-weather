import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMilliseconds,
  hoursToMilliseconds,
} from 'date-fns';

class Data {
  #apiKey;

  #latitude;

  #longitude;

  #units;

  constructor(apiKey, latitude, longitude, units) {
    this.#apiKey = apiKey;
    this.#latitude = latitude;
    this.#longitude = longitude;
    this.#units = units;
  }

  async #getRawForecast() {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${
      this.#latitude
    }&lon=${this.#longitude}&appid=${this.#apiKey}&units=${this.#units}`;

    let response = await fetch(url, { mode: 'cors' });
    let json = await response.json();

    return json;
  }

  async getMorningForecast(date) {
    let rawData = await this.#getRawForecast();

    let retrievalTime = new Date(0);
    retrievalTime.setUTCSeconds(rawData.current.dt);

    let daysUntilStart = differenceInCalendarDays(date, retrievalTime, {
      roundingMethod: 'ceil',
    });

    return Data.#parseMorningForecast(rawData.daily[daysUntilStart]);
  }

  async getHourlyForecasts(startTime, endTime) {
    let result = [];

    let rawData = await this.#getRawForecast();

    let retrievalTime = new Date(0);
    retrievalTime.setUTCSeconds(rawData.current.dt);

    let hoursUntilStart = differenceInHours(startTime, retrievalTime, {
      roundingMethod: 'ceil',
    });
    let hoursUntilEnd = differenceInHours(endTime, retrievalTime, {
      roundingMethod: 'ceil',
    });

    for (let i = hoursUntilStart; i <= hoursUntilEnd; i += 1) {
      result.push(Data.#parseHourlyForecast(rawData.hourly[i]));
    }

    return result;
  }

  static hourlyForecastsAreAvailable(endTime) {
    let now = new Date();
    return differenceInMilliseconds(endTime, now) < hoursToMilliseconds(48);
  }

  static #parseMorningForecast(d) {
    return {
      time: 'Morning',
      temperature: d.temp.morn,
      feelsLike: d.feels_like.morn,
      iconCode: d.weather[0].icon,
      description: d.weather[0].main,
      subDescription: d.weather[0].description,
      pop: d.pop,
      humidity: d.humidity,
      windSpeed: d.wind_speed,
      gustSpeed: d.wind_gust,
      uvi: d.uvi,
    };
  }

  static #parseHourlyForecast(d) {
    let time = new Date(0);
    time.setUTCSeconds(d.dt);

    time =
      time.getHours() +
      ':' +
      time.getMinutes().toString().padStart(2, '0') +
      'am';

    return {
      time,
      temperature: d.temp,
      feelsLike: d.feels_like,
      iconCode: d.weather[0].icon,
      description: d.weather[0].main,
      subDescription: d.weather[0].description,
      pop: d.pop,
      humidity: d.humidity,
      windSpeed: d.wind_speed,
      gustSpeed: d.wind_gust,
      uvi: d.uvi,
    };
  }
}

export default Data;
