
// <WeatherApp />
//
// Main display 

var WeatherApp = React.createClass({
   	
    addWeather: function(weatherData) {
          
    },
    
    renderWeather: function(key) {
     
    },
    
    // Set up Introduction page FORECAST elements
    render : function() {
		var ForecastIO = require(['forecast.io'], function(ForecastIO) {
			
            var norfolk = {
		 		latitude: '36.8508', 
				longitude: '-76.2859'
		 	};
            
            var enfield = {
		 		latitude: '41.975', 
				longitude: '-72.5494'
		 	};	
		
            var newForecast = new ForecastIO({
                PROXY_SCRIPT: 'js/proxy.php'
            });
			
			/**
             * Will pass current conditions
            **/
            newForecast.getCurrentConditions(norfolk, function(conditions) {
                for (var i = 0; i < conditions.length; i++) {
				    
                    // Get Temperature
					var reportTemp = '<h1 class="mainTemperature">' + Math.round(conditions[i].getTemperature()) + '<sup>&#176</sup></h1>';
					// Get Icon
					var reportIcon = '<div class="weather-icon ' + conditions[i].getIcon() + '" /></div>';
                   					
                    // Introduce html
					var temperatureDOM = '<p class="currentTemp">Current weather:</p>'
                                       + reportIcon // Show Icon
									   + reportTemp; // Show Current Temperature
                };          
				             
				document.getElementById('currentWeather').innerHTML = temperatureDOM;
			});
        });
        
        return (
            <div>
                <NewIntro />
            </div>
        )
    }
});

			
/* <NewIntro />
  
// Create an introduction page to introduce app
     
*/

var NewIntro = React.createClass({
    /*
    createRevealAnim: function({target}) {
        return new TimelineMax()
            .staggerFrom(items, 1, {opacity: 0, scale: .3}, .12)
    },
    */
    
    showWeather: function() {
		$("#introCard").addClass('hide');
		$("#weatherDetail").addClass('show');
		$("#forecastWeek .weatherByDate").eq(0).addClass('in');
        $("#forecastWeek .weatherByDate").slice(1,8).addClass('show');
        $(".background").addClass('fadeOut').removeClass('fadeIn');
		$("#currentTimeBar").addClass("show");
    },
    
    componentDidMount: function() {
        /* this.addAnimation(createRevealAnim); */
    },
	
    render : function() {
        // get initial properties of the title sequence
       
        return (
            <div>  
                <div id="introCard" className="contain" name="intro">
                   
                    <div className="row">
                        <div className="centerHeader">
                            <svg className="masked" id="norfolkSkyline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 557.05 105.63">
                                <g><path d="M0,104.13H33.33V76.62H101V33.77h12.7V25.31h19v7.41H146V50.17l4.23,2.65v2.65h5.29V76.62h6.88v-54l16.4-3.17,34.39,3.7v27l11.64-1.06,16.4,1.59V34.83l9.52-1.06h2.65V31.65h4.76l14.28,1.06v2.65l8.46.53V51.23L301,49.64l18.52,2.12V67.1h97.87V93.55h10.69L428,9.44h2.65V4.73l3.7-.05V1.5h37.56V5.2h2.65V76.62h46v20.1h36.5"/></g>
                            </svg>
                        </div>
						<h1>Weather.IO</h1> 
                        <h5>Norfolk, Virginia</h5>
                    </div>
                    <div className="row">
                       <div className="small-12 columns">
                            
                            <div id="currentWeather"></div>   
                            <div className="button launchWeather" onClick={this.showWeather}>View current weather</div>
                            <p>Norfolk (/nɔːrfᵿk/ nor-fək, local /ˈnɒfʊk/ nof-uuk) is an independent city in the Commonwealth of Virginia, United States. At the 2010 census, the population was 242,803;[3] in 2015, the population was estimated to be 247,189[4] making it the second-most populous city in Virginia, behind neighboring Virginia Beach.</p>
                            <p>Norfolk is located at the core of the Hampton Roads metropolitan area, named for the large natural harbor of the same name located at the mouth of Chesapeake Bay. It is one of nine cities and seven counties that constitute the Hampton Roads metro area, officially known as the Virginia Beach-Norfolk-Newport News, VA-NC MSA. The city is bordered to the west by the Elizabeth River and to the north by the Chesapeake Bay. It also shares land borders with the independent cities of Chesapeake to its south and Virginia Beach to its east. One of the oldest of the cities in Hampton Roads, Norfolk is considered to be the historic, urban, financial, and cultural center of the region.</p>
                            <img className="virginiaIcon" src="media/images/norfolk.svg" />  
                        </div>
                    </div>
                </div>
                <NewWeatherDisplay />
            </div>
        )
    }
});

/* <NewWeeklyForecast />
  
// Create an introduction page to introduce app
     
*/
var NewWeeklyForecast = React.createClass({
    update: function(event){
        this.forceUpdate();
        var i = setInterval(function() {
            $("#forecastWeek .weatherByDate").eq(0).addClass('in');
            $("#forecastWeek .weatherByDate").addClass('show');
            $("#hourlyForecast > ul > li").removeClass('show');
            document.getElementById('hoverInstructions').innerHTML = "Click for hourly forecast.";
            document.getElementById('cardToday').innerHTML = "Weekly Forecast";
            this.clearInterval();
        }, 2000);
        setTimeout(function( ) { clearInterval( i ); }, 2100);
        
     },
    
    toggleForecast: function(event) {
         if (!$("#forecastWeek .weatherByDate").hasClass('flipped')){
            $("#forecastWeek .weatherByDate").addClass('flipped');
            $("#hourlyForecast > ul > li").addClass('show');
            document.getElementById('hoverInstructions').innerHTML = "Click for weekly forecast."; 
            document.getElementById('cardToday').innerHTML = "Hourly Forecast";
        } else {
            $("#forecastWeek > ul > .weatherByDate").removeClass('flipped');
            $("#hourlyForecast > ul > li").removeClass('show');
            document.getElementById('hoverInstructions').innerHTML = "Click for hourly forecast.";
            document.getElementById('cardToday').innerHTML = "Weekly Forecast"; 
        }
    },
    	
    render : function() {
        var ForecastIO = require(['forecast.io'], function(ForecastIO) {
			var norfolk = {
		 		latitude: '36.8508', 
				longitude: '-76.2859'
		 	};
            
            var enfield = {
		 		latitude: '41.975', 
				longitude: '-72.5494'
		 	};
            
            var newForecast = new ForecastIO({
                PROXY_SCRIPT: 'js/proxy.php'
            });
            
            /**
            ** Will pass weekly conditions by day fnc literal
            **/
             newForecast.getCurrentConditions(norfolk, function(conditions) {
			 
                // REPORT TIME
                 for (var i = 0; i < conditions.length; i++) {
					// Get Date
                	var reportDate = '<span class="reportDate">' + conditions[i].getTime('MM-DD') + '</span>';
					// Get Time
                	var reportTime = '<span class="reportTime">' + conditions[i].getTime('hh:mm') + '</span>';
					
                    // Introduce html
					var reportedTime = '<p class="lastUpdated">Last updated: '
                                     + reportDate
                                     + ' '
                                     + reportTime
                                     + ' <span class="refresh">(refresh)</p>'
                                     + '<div id="sun">'
                                     + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.41 92.4">'
                                     + '<g id="rays" data-name="rays">'
                                     + '<path class="ray-1" d="M7.68,28.84l10.94,6.32-.07.2a29.7,29.7,0,0,1,4.28-7.51L11.88,21.56a4.2,4.2,0,0,0-4.2,7.28Z"/>'
                                     + '<path class="ray-2" d="M18.67,57.25,7.73,63.57a4.2,4.2,0,0,0,2.11,7.84,4.14,4.14,0,0,0,2.09-.56l11-6.3A29.71,29.71,0,0,1,18.67,57.25Z"/>'
                                     + '<path class="ray-3" d="M16.52,46.15A30,30,0,0,1,16.82,42H4.2a4.2,4.2,0,1,0,0,8.4H16.83A30,30,0,0,1,16.52,46.15Z"/>'
                                     + '<path class="ray-4" d="M46.28,16.4a30,30,0,0,1,4.13.29V4.2a4.2,4.2,0,0,0-8.4,0h0V16.7A30,30,0,0,1,46.28,16.4Z"/>'
                                     + '<path class="ray-5" d="M73.89,35.07l10.8-6.23a4.2,4.2,0,1,0-4.2-7.28l-10.8,6.23A29.71,29.71,0,0,1,73.89,35.07Z"/>'
                                     + '<path class="ray-6" d="M64.62,22.73l6.23-10.8a4.2,4.2,0,0,0-7.28-4.2L57.33,18.52A29.71,29.71,0,0,1,64.62,22.73Z"/>'
                                     + '<path class="ray-7" d="M27.84,22.81a29.71,29.71,0,0,1,7.27-4.23L28.84,7.73a4.2,4.2,0,0,0-7.28,4.2Z"/>'
                                     + '<path class="ray-8" d="M70.84,80.47,64.57,69.61a29.71,29.71,0,0,1-7.28,4.18l6.29,10.88a4.2,4.2,0,0,0,7.4-4Z"/>'
                                     + '<path class="ray-9" d="M27.92,69.55l-6.31,11a4.2,4.2,0,0,0,7.28,4.2l6.32-11,.4.14A29.7,29.7,0,0,1,27.92,69.55Z"/>'
                                     + '<path class="ray-10" d="M88.21,42H75.74a29.48,29.48,0,0,1,0,8.4H88.21a4.2,4.2,0,1,0,0-8.4Z"/>'
                                     + '<path class="ray-11" d="M84.72,63.57,73.86,57.32a29.71,29.71,0,0,1-4.24,7.27l10.9,6.26a4.15,4.15,0,0,0,2.09.56,4.2,4.2,0,0,0,2.11-7.84Z"/>'
                                     + '<path class="ray-12" d="M36.78,74.35l.13,0Z"/>'
                                     + '<path class="ray-13" d="M46.28,75.9A30,30,0,0,1,42,75.59V88.2a4.2,4.2,0,1,0,8.4,0V75.61A30,30,0,0,1,46.28,75.9Z"/>'
                                     + '</g>'
                                     + '</svg></div>';
                    
                     document.getElementById('centerTime').innerHTML = reportedTime;
                 };
            });
                                            
            newForecast.getForecastWeek(norfolk, function(conditions) {
                 // NEW FORECAST
                 var itemsForecastWeek = '<ul class="row">';
                    for (var i = 0; i < conditions.length; i++) {
                    // Get Date
                    var dailyReportDate =  '<p class="cardReportDate">' + conditions[i].getTime('MM/DD') + '</p>'
                    // Get Max Temperature
                    var reportMaxTemp = '<div class="maxMinTemps">HIGH ' + Math.round(conditions[i].getMaxTemperature()) + '   '
                    // Get Min Temperature
                    var reportMinTemp = 'LOW ' + Math.round(conditions[i].getMinTemperature()) + '</div>'
                    // Get Summary
                    var reportSummary = '<p class="reportSummary">' + conditions[i].getSummary() + '</p>'
                    // Get Icon
                    var reportIcon = '<div class="weather-icon ' + conditions[i].getIcon() + '"></div>';
                    // Get Wind Information
                    var reportWindInfo = '<p class="reportWindInfo ">Wind: ' + conditions[i].getWindSpeed() + ' mph</p>';
                    // Get Precipitation
                    var reportPrecipitation = '<p class="reportWindInfo ">Precip: ' +  Math.round((conditions[i].getPrecipitationProbability() * 100) )+ '%</p>';
                  
                    itemsForecastWeek += '<li class="weatherByDate">'
                                      + '<div class="dailyForecast">' // Start Daily forecast container
                                      + '<p class="cardToday" id="cardToday">WEEKLY FORECAST</p>' // Show on today's weather node
                                      + dailyReportDate  // Get Date
                                      + reportMaxTemp // Show high temperature
                                      + reportMinTemp // Show minimum temperature
									  + reportSummary // Show daily summary
                        			  + '<div class="thirds">' + reportIcon + '</div>'// Show icon
                                      + '<div class="thirds">' + reportWindInfo + '</div>' // Show wind speed
                                      + '<div class="thirds">' + reportPrecipitation + '</div>' // Show change of precipitation
								      + '<p class="hoverInstructions" id="hoverInstructions">Click for hourly forecast.</p>' // Hover instructions
                                      + '</div>' // End Daily forecast container
                                      + '</li>'
                };
                // End Loop
                itemsForecastWeek += '</ul>';
				
                document.getElementById('forecastWeek').innerHTML = itemsForecastWeek;
            })// End Weekly
        }) // End new Forecast IO
        
        return (
            <div>
                <div id="currentTimeBar" onClick={this.update}>
                    <div id="centerTime"></div>
                </div>
                <div id='forecastWeek' onClick={this.toggleForecast}></div>
                
            </div>
        )
    }
});


var NewHourlyForecast = React.createClass({
     
    render : function() {
        var ForecastIO = require(['forecast.io'], function(ForecastIO) {
			var norfolk = {
		 		latitude: '36.8508', 
				longitude: '-76.2859'
		 	};
            
            var enfield = {
		 		latitude: '41.975', 
				longitude: '-72.5494'
		 	};

            var newForecast = new ForecastIO({
                PROXY_SCRIPT: 'js/proxy.php'
            });
            
            /**
            ** Will pass hourly conditions by day fnc literal
            **/
            newForecast.getForecastHourly(norfolk, function(conditions) {
                
                var itemsForecastHourly = '<ul class="row">'
                                        + '<p class="cardToday">HOURLY FORECAST</p>';
                
                for (var i = 0; i < 10; i++) {
                    
                    // Get Date
                        var reportTime = '<div class="reportTime distributeHourElements">' + conditions[i].getTime('h') + '</div>';
                    // Get Temperature
                        var reportTemp = '<h1 class="mainTemperature distributeHourElements">' + Math.round(conditions[i].getTemperature()) + '<sup>&#176</sup></h1>';
                     // Get Summary
                        var reportSummary = '<p class="reportSummary distributeHourElements">' + conditions[i].getSummary() + '</p>'
                    // Get Icon
                        var reportIcon = '<div class="distributeHourElements"><div class="weather-icon ' + conditions[i].getIcon() + '" /></div></div>';
                    // Get Wind Information
                        var reportWindInfo = '<p class="reportWindInfo distributeHourElements">Wind: ' + conditions[i].getWindSpeed() + ' mph</p>';
                    // Get Precipitation
                        var reportPrecipitation = '<p class="reportWindInfo distributeHourElements">Precip: ' +  Math.round((conditions[i].getPrecipitationProbability() * 100) )+ '%</p>';
    
                    itemsForecastHourly += '<li class="weatherByHour">'
                                        + reportTime // Show Time in hours
                                        + reportIcon // Show Icon
                                        + reportSummary // Show Summary
                                        + reportTemp // Show Current Temperature
                                        + reportWindInfo // Show Wind
                                        + reportPrecipitation // Show Wind
							            + '</li>'
                };
                // End Loop
                
                itemsForecastHourly += '</ul>';

                document.getElementById('hourlyForecast').innerHTML = itemsForecastHourly;
            })
            
        }) // End new Forecast IO
        
        return (
           <div id='hourlyForecast'></div>
        )
    }
});


/*
** <NewWeatherDisplay />
 */
var NewWeatherDisplay = React.createClass({
   
    render : function() {
        return (
            <div id="weatherDetail" className="contain">
                <NewWeeklyForecast />
                <NewHourlyForecast />
             </div>
        )
  }
});


//setInterval(function() {
  ReactDOM.render(
    <WeatherApp pollInterval={5000} />,
    document.querySelector("#main")
  );
//}, 10000);



