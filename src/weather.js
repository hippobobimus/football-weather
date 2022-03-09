import './weather.css';
import ClearDayIcon from './icons/weather/clear-day.svg';
import CloudyIcon from './icons/weather/cloudy.svg';
import ExtremeRainIcon from './icons/weather/extreme-rain.svg';
import HumidityIcon from './icons/weather/humidity.svg';
import MistIcon from './icons/weather/mist.svg';
import OvercastIcon from './icons/weather/overcast.svg';
import PartlyCloudyIcon from './icons/weather/partly-cloudy-day.svg';
import RaindropIcon from './icons/weather/raindrop.svg';
import RainIcon from './icons/weather/rain.svg';
import SnowIcon from './icons/weather/snow.svg';
import ThunderstormIcon from './icons/weather/thunderstorms-extreme-rain.svg';
import UVIcon from './icons/weather/uv-index.svg';
import WindIcon from './icons/weather/windsock.svg';
import WindLowIcon from './icons/weather/windsock-weak.svg';

class WeatherView {
  static ICON_MAP = {
    '01d': ClearDayIcon,
    '02d': PartlyCloudyIcon,
    '03d': CloudyIcon,
    '04d': OvercastIcon,
    '09d': RainIcon,
    '10d': ExtremeRainIcon,
    '11d': ThunderstormIcon,
    '13d': SnowIcon,
    '50d': MistIcon,
  };

  constructor(root) {
    this.root = root;

    this.root.style.display = 'flex';

    this.root.querySelector('.rain-icon').src = RaindropIcon;
    this.root.querySelector('.humidity-icon').src = HumidityIcon;
    this.root.querySelector('.uvi-icon').src = UVIcon;
  }

  update(
    time,
    temperature,
    feelsLike,
    iconCode,
    description,
    subDescription,
    pop,
    humidity,
    windSpeed,
    gustSpeed,
    uvi
  ) {
    this.root.querySelector('.time').innerText = time;

    this.root.querySelector('.weather-icon').src =
      WeatherView.ICON_MAP[iconCode];

    this.root.querySelector('.temperature').innerText = Math.round(temperature);
    this.root.querySelector('.feels-like').innerText = Math.round(feelsLike);

    this.root.querySelector('.description').innerText = description;
    this.root.querySelector('.sub-description').innerText = subDescription;

    this.root.querySelector('.rain-chance').innerText = Math.round(pop * 100);

    this.root.querySelector('.humidity').innerText = Math.round(humidity);

    this.root.querySelector('.wind-speed').innerText = Math.round(windSpeed);
    this.root.querySelector('.gust-speed').innerText = Math.round(gustSpeed);
    if (windSpeed < 15) {
      this.root.querySelector('.wind-icon').src = WindLowIcon;
    } else {
      this.root.querySelector('.wind-icon').src = WindIcon;
    }

    let uviInt = Math.round(uvi);
    let uviText = '';
    if (uvi < 3) {
      uviText = uviInt + ' - Low';
    } else if (uviInt < 6) {
      uviText = uviInt + ' - Moderate';
    } else if (uviInt < 8) {
      uviText = uviInt + ' - High';
    } else if (uviInt < 11) {
      uviText = uviInt + ' - Very High';
    } else {
      uviText = uviInt + ' - Extreme';
    }
    this.root.querySelector('.uvi').innerText = uviText;
  }
}

export default WeatherView;
