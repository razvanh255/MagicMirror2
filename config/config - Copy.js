/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "ro",
	locale: "ro-RO",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "INFO", "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	lat: 44.4375,
	lon: 26.1250,
	apiKey: "b2a3617531709ecfc669e87753da4e5e",
	location: "București",
	decimal: ",",
	animation: 2000,

	modules: [
		{
			module: "cndloader"
		},
		{
			module: "alert",
			config: {
				display_time: 5000,
				welcome: true
			}
		},
		{
			module: 'watchDog',
			disabled: true,
		},
		{
			module: "updatenotification",
			position: "top_bar",
			disabled: true,
			config: {
				sendUpdatesNotifications: true
			}
		},

/********** left **********/

		{
			module: "clock",
			position: "top_left",
			config: {
				displayType: "digital",
				showSunTimes: true,
				showMoonTimes: "both",
				showWeek: true
			}
		},
		{
			module: "swatch",
			position: "top_left"
		},
		{
			module: "phases",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "Calendar evenimente",
			position: "top_left",
			config: {
				fetchInterval: 5 * 60 * 1000,
				coloredSymbol: true,
				tableClass: "xmedium light",
				maximumEntries: 15,
				fade: true,
				fadePoint: 0.5,
				calendars: [
					{
						symbol: "calendar-check", color: "skyblue",
						url: "https://calendar.google.com/calendar/ical/ro.romanian%23holiday%40group.v.calendar.google.com/public/basic.ics"
					},
					{
						symbol: "moon", color: "moccasin", // maximumEntries: 5,
						url: "https://calendar.google.com/calendar/ical/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/public/basic.ics"
					},
					{
						symbol: "calendar-day",  color: "lime",
						url: "https://calendar.google.com/calendar/ical/razvanh255%40gmail.com/private-979060f6d5c0d779570808b4a4969de2/basic.ics"
					},
					{
						symbol: "birthday-cake", color: "gold",
						url: "https://calendar.google.com/calendar/ical/9vmkbga8nv9gqpmip6pa7f2mpo%40group.calendar.google.com/private-262a0803e45ba6786530c29d59b0d223/basic.ics"
					},
					{
						symbol: "film", color: "magenta",
						url: "https://calendar.google.com/calendar/ical/emm3k4f4t7dihvfb0c65st0ijo%40group.calendar.google.com/private-caeb9a5112b8aea911cbbb38baac1a77/basic.ics"
					},
					{
						symbol: "suitcase",  color: "orange",
						url: "https://calendar.google.com/calendar/ical/msinsm98i57dm5gcfb60d2peao%40group.calendar.google.com/private-6a6b7086728e0a5dba102d94721c28c0/basic.ics"
					}
				]
			}
		},

/********** center **********/

		{
			module: "smartNotification",
			position: "top_center",
			classes: "night",
			config: {
				
			}
		},
		{
			module: "clock",
			position: "top_center",
			config: {
				showDate: false,
				analogFace: "face-013",
				analogSize: "300px",
				displayType: "analog",
				secondsColor: "orangered"
			}
		},
		{
			module: "pollution",
			position: "top_center",
			classes: "air quality",
			disabled: true,
			config: {
				calculateAqi: false
			}
		},
		{
			module: "simpletext",
			position: "top_center",
			disabled: false,
			config: {
				text: "<div style='height:70px;padding-top:30px'>Fake AQI</div>",
				cssClass: "slarge"
			}
		},
		{
			module: "monthly",
			position: "top_center",
			config: {
				monthCount: 2,
				fade: true
			}
		},

/********** right **********/

		{
			module: "weather",
			position: "top_right",
			classes: "noheader",
			disabled: false,
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				showUVIndex: true,
				showSun: false,
				showWindDirectionAsArrow: true,
				showHumidity: "wind",
				allowOverrideNotification: true
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Prognoza în următoarele zile",
			disabled: false,
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				showPrecipitationAmount: true,
				showPrecipitationProbability: true,
				colored: true,
				fade: false,
				appendLocationNameToHeader: false,
				tableClass: "xmedium",
				maxNumberOfDays: 8
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Prognoza în următoarele ore",
			disabled: false,
			config: {
				weatherProvider: "openmeteo",
				type: "hourly",
				showPrecipitationAmount: true,
				showPrecipitationProbability: true,
				colored: true,
				fade: true,
				appendLocationNameToHeader: false,
				tableClass: "xmedium",
				maxEntries: 11
			}
		},
		{
			module: "onecall",
			position: "top_right",
			classes: "current weather",
			disabled: true,
			config: {
				maxNumberOfDays: 3,
				maxNumberOfHours: 6,
				fadeHourly: true,
				extraDaily: true,
				random: false
			}
		},

/********** middle **********/

		{
			module: "compliments",
			position: "middle_center",
			config: {
				classes: "thin xlarge bright pre-line blue",
				specialDayUnique: true,
				compliments: {
					"anytime" : [
						"Orice faci, fă-o bine!",
						"Fi sexy, fi tu însuți!",
						"O zi cât mai frumoasă!",
						"Azi arăți foarte bine!",
						"Arăți minunat, succes!",
						"Fă-o astăzi, nu mâine!",
						"Întotdeauna ai dreptate!",
					],
					"morning" : [
						"Dimineață frumoasă!",
						"Bună dimineața!",
						"Să ai poftă la cafea!"
					],
					"noon" : [
						"Un prânz excelent!",
						"Poftă bună la prânz!",
						"O zi fantastică!"
					],
					"afternoon" : [
						"O după amiază bună!",
						"O zi cât mai bună!",
						"O zi excelentă!"
					],
					"evening" : [
						"O seară minunată!",
						"O seară liniștită!",
						"O seară plăcută!"
					],
					"night" : [
						"Somn ușor!",
						"Noapte bună!",
						"Vise plăcute!",
						"Să visezi frumos!"
					],
					"midnight" : [
						"De ce nu dormi?",
						"Știi cât este ceasul?",
						"Ai vreun coșmar?"
					]
				}
			}
		},
		{
			module: "quotes",
			position: "lower_third"
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				updateInterval: 40 * 1000,
				showDescription: true,
				lengthDescription: 300,
				feeds: [
					{
						title: "Știrile ProTV",
						url: "https://rss.stirileprotv.ro"
					},
					{
						title: "Mediafax",
						url: "https://www.mediafax.ro/rss"
					},
					{
						title: "NewsIn",
						url: "https://newsin.ro/feed"
					},
					{
						title: "News.ro",
						url: "https://www.news.ro/rss"
					},
					{
						title: "Main News",
						url: "https://mainnews.ro/feed"
					},
					{
						title: "Ziare.com",
						url: "https://www.ziare.com/rss/12h.xml"
					}
				]
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
