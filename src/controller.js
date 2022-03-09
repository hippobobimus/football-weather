import './style.css';
import './weather.css';
import { nextSaturday } from 'date-fns';
import DataModel from './data.js';
import HeaderView from './header-view.js';
import WeatherView from './weather-view.js';

class Controller {
  #dataModel;

  #headerView;

  constructor(apiKey, latitude, longitude, metric) {
    this.#dataModel = new DataModel(apiKey, latitude, longitude, metric);
    this.#headerView = new HeaderView();
  }

  async loadHomepage() {
    this.#loadGameDate();
    this.#loadForecasts();
  }

  async #loadForecasts() {
    let forecasts = [];

    if (DataModel.hourlyForecastsAreAvailable(Controller.#endTime)) {
      forecasts.push(
        ...(await this.#dataModel.getHourlyForecasts(
          Controller.#startTime,
          Controller.#endTime
        ))
      );
    } else {
      forecasts.push(
        await this.#dataModel.getMorningForecast(Controller.#startTime)
      );
    }

    Controller.#renderForecasts(forecasts);
  }

  static #renderForecasts(forecasts) {
    for (let i = 0; i < forecasts.length; i += 1) {
      let view = new WeatherView(document.getElementById(`weather-entry-${i}`));
      view.update(
        forecasts[i].time,
        forecasts[i].temperature,
        forecasts[i].feelsLike,
        forecasts[i].iconCode,
        forecasts[i].description,
        forecasts[i].subDescription,
        forecasts[i].pop,
        forecasts[i].humidity,
        forecasts[i].windSpeed,
        forecasts[i].gustSpeed,
        forecasts[i].uvi
      );
    }
  }

  #loadGameDate() {
    this.#headerView.update(Controller.#nextGameDateString);
  }

  static get #nextGameDateString() {
    let d = nextSaturday(new Date());

    return `${d.getDay().toString().padStart(2, '0')}-${d
      .getMonth()
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  }

  static get #startTime() {
    let start = nextSaturday(new Date());
    start.setHours(9);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    return start;
  }

  static get #endTime() {
    let end = nextSaturday(new Date());
    end.setHours(11);
    end.setMinutes(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    return end;
  }
}

export default Controller;
