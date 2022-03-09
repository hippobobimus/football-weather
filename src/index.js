import './style.css';
import Controller from './controller.js';

(async () => {
  let apiKey = '10d7b76aba9296ef529b2938eb2b6604';
  let latitude = 51.65765845679154;
  let longitude = -0.3658185661747193;
  let units = 'metric';

  let controller = new Controller(apiKey, latitude, longitude, units);
  controller.loadHomepage();
})();
