'use strict';

//Install jQuery and Moment.js using npm or
//if using require.js manage the paths as you see fit

//Notes
//Could use ES6 promises (and polyfill)
//rather than jQuery

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['moment', 'es6-promise'], function(moment) {
			return (root.ForecastIO = factory(moment));
		});
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = (root.ForecastIO = factory(require('moment'), require('es6-promise').Promise));
	} else {
		// Browser globals (root is window)
		root.ForecastIO = factory(root.moment);
	}
}(this, function(moment) {

	/* 	By Ian Tearle
		github.com/iantearle

		Other contributors
		Richard Bultitude
		github.com/rjbultitude
		Brandon Love
		github.com/brandonlove
	*/

	//Error strings
	var fioServiceError = 'There was a problem accessing forecast.io. Make sure you have a valid key';

	//Forecast Class
	/**
	 * Will construct a new ForecastIO object
	 *
	 * @param string $config
	 * @return boolean
	 */
	function ForecastIO(config) {
		//var PROXY_SCRIPT = '/proxy.php';
		if (!config) {
			console.log('You must pass ForecastIO configurations');
		}
		if (!config.PROXY_SCRIPT) {
			if (!config.API_KEY) {
				console.log('API_KEY or PROXY_SCRIPT must be set in ForecastIO config');
			}
		}
		this.API_KEY = config.API_KEY;
		this.url = (typeof config.PROXY_SCRIPT !== 'undefined') ? config.PROXY_SCRIPT + '?url=': 'https://api.forecast.io/forecast/' + config.API_KEY + '/';
	}

	function makeRequest(method, url) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.onload = function() {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror = function() {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			xhr.send();
		});
	}

	/**
	 * Checks the location object
	 * passed into the app
	 * and wraps it in an array
	 * if it wasn't one already
	 *
	 * @param object $locObject
	 * @return array
	 */
	function checkObject(locObject) {
		var locationsObjWrap = [];
		if (!Array.isArray(locObject)) {
			//console.log('locations was not an array');
			locationsObjWrap.push(locObject);
			return locationsObjWrap;
		}
		else {
			return locObject;
		}
	}

	/**
	 * Will build a url string from the lat long coords
	 * and return a promise with the json
	 *
	 * @param number $latitude
	 * @param number $longitude
	 * @return promise object
	 */
	ForecastIO.prototype.requestData = function requestData(latitude, longitude) {
		var requestUrl = this.url + latitude + ',' + longitude;
		return makeRequest('GET', requestUrl);
	};

	ForecastIO.prototype.requestAllLocData = function requestAllLocData(locations) {
		var locDataArr = [];
		for (var i = 0; i < locations.length; i++) {
			var content = this.requestData(locations[i].latitude, locations[i].longitude);
			locDataArr.push(content);
		}
		return locDataArr;
	};

	/**
	 * Will take a locations object and a callback function
	 * and pass the current conditions into the callback
	 *
	 * @param object $locations
	 * @param function $appFn
	 * @return boolean
	 */
	ForecastIO.prototype.getCurrentConditions = function getCurrentConditions(locations, appFn) {
		var locationsArr = checkObject(locations);
		var allLocDataArr = this.requestAllLocData(locationsArr);
		Promise.all(allLocDataArr).then(function(values) {
			if (values.length === 0 || values[0] === '' || values[0] === null || values[0] === undefined) {
				console.log(fioServiceError);
				return;
			}
			else {
				var dataSets = [];
				for (var i = 0; i < values.length; i++) {
						var jsonData = JSON.parse(values[i]);
						var currently = new ForecastIOConditions(jsonData.currently);
						dataSets.push(currently);
					}
				appFn(dataSets);
				return dataSets;
			}
		}, function(rejectObj) {
			console.log(rejectObj.status);
			console.log(rejectObj.statusText);
		});
	};
    
    /**
	 * Will take a locations object and a callback function
	 * and pass the conditions on hourly basis for an indefinite amount of time
	 *
	 * @param object $locations
	 * @param function $appFn
	 * @return boolean
	 */
	ForecastIO.prototype.getForecastHourly = function getForecastHourly (locations, appFn) {
		var locationsArr = checkObject(locations);
		var allLocDataArr = this.requestAllLocData(locationsArr);
		Promise.all(allLocDataArr).then(function(values) {
				if (values.length === 0 || values[0] === '' || values[0] === null || values[0] === undefined) {
					console.log(fioServiceError);
					return;
				}
				else {
					var dataSets = [];
					for (var i = 0; i < values.length; i++) {
						var today = moment().format('YYYY-MM-DD');
						var jsonData = JSON.parse(values[i]);
						for (var j = 0; j < jsonData.hourly.data.length; j++) {
							var hourlyData = jsonData.hourly.data[j];
							dataSets.push(new ForecastIOConditions(hourlyData));
						}
					}
					appFn(dataSets);
					return dataSets;
				}
			}, function(rejectObj) {
				console.log(rejectObj.status);
				console.log(rejectObj.statusText);
		});
	};

	/**
	 * Will take a locations object and a callback function
	 * and pass the conditions on hourly basis for today into the callback
	 *
	 * @param object $locations
	 * @param function $appFn
	 * @return boolean
	 */
	ForecastIO.prototype.getForecastToday = function getForecastToday(locations, appFn) {
		var locationsArr = checkObject(locations);
		var allLocDataArr = this.requestAllLocData(locationsArr);
		Promise.all(allLocDataArr).then(function(values) {
				if (values.length === 0 || values[0] === '' || values[0] === null || values[0] === undefined) {
					console.log(fioServiceError);
					return;
				}
				else {
					var dataSets = [];
					for (var i = 0; i < values.length; i++) {
						var today = moment().format('YYYY-MM-DD');
						var jsonData = JSON.parse(values[i]);
						for (var j = 0; j < jsonData.hourly.data.length; j++) {
							var hourlyData = jsonData.hourly.data[j];
							if (moment.unix(hourlyData.time).format('YYYY-MM-DD') === today) {
								dataSets.push(new ForecastIOConditions(hourlyData));
							}
						}
					}
					appFn(dataSets);
					return dataSets;
				}
			}, function(rejectObj) {
				console.log(rejectObj.status);
				console.log(rejectObj.statusText);
		});
	};

	/**
	 * Will take a locations object and a callback function
	 * and pass the daily conditions for next seven days into the callback
	 *
	 * @param object $locations
	 * @param function $appFn
	 * @return boolean
	 */
	ForecastIO.prototype.getForecastWeek = function getForecastWeek(locations, appFn) {
		var locationsArr = checkObject(locations);
		var allLocDataArr = this.requestAllLocData(locationsArr);
		Promise.all(allLocDataArr).then(function(values) {
				if (values.length === 0 || values[0] === '' || values[0] === null || values[0] === undefined) {
					console.log(fioServiceError);
					return;
				}
				else {
					var dataSets = [];
					for (var i = 0; i < values.length; i++) {
						var jsonData = JSON.parse(values[i]);
						for (var j = 0; j < jsonData.daily.data.length; j++) {
							var dailyData = jsonData.daily.data[j];
							dataSets.push(new ForecastIOConditions(dailyData));
						}
					}
					appFn(dataSets);
					return dataSets;
				}
			}, function(rejectObj) {
				console.log(rejectObj.status);
				console.log(rejectObj.statusText);
		});
	};

	function ForecastIOConditions(rawData) {
		ForecastIOConditions.prototype = {
			rawData: rawData
		};
		
		this.getTemperature = function() {
			return rawData.temperature;
		};
		
		this.getApparentTemperature = function() {
			return rawData.apparentTemperature;
		};
		
		this.getSummary = function() {
			return rawData.summary;
		};
		
		this.getIcon = function() {
			return rawData.icon;
		};
		
		this.getTime = function(format) {
			if (!format) {
				return rawData.time;
			} else {
				return moment.unix(rawData.time).format(format);
			}
		};
		
		this.getPressure = function() {
			return rawData.pressure;
		};
	
		this.getHumidity = function() {
			return rawData.humidity;
		};
		
		this.getWindSpeed = function() {
			return rawData.windSpeed;
		};
		
		this.getWindBearing = function() {
			return rawData.windBearing;
		};
		
		this.getPrecipitationType = function() {
			return rawData.precipType;
		};
		
		this.getPrecipitationProbability = function() {
			return rawData.precipProbability;
		};
		
		this.getCloudCover = function() {
			return rawData.cloudCover;
		};
		
		this.getMinTemperature = function() {
			return rawData.temperatureMin;
		};
		
		this.getMaxTemperature = function() {
			return rawData.temperatureMax;
		};
		
		this.getSunrise = function() {
			return rawData.sunriseTime;
		};
		
		this.getSunset = function() {
			return rawData.sunsetTime;
		};
		
		this.getPrecipIntensity = function() {
			return rawData.precipIntensity;
		};
		
		this.getDewPoint = function() {
			return rawData.dewPoint;
		};
		
		this.getOzone = function() {
			return rawData.ozone;
		};
	}

	return ForecastIO;
}));
