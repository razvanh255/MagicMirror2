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
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	lat: 44.4375,
	lon: 26.1250,
	apiKey: "",
	location: "București",
	decimal: ",",
	animation: 2000,
	electronOptions: {kiosk: false, fullscreen: true},

	modules: [
		{
			module: "cndloader"
		},
		{
			module: "alert",
			config: {
				display_time: 5000,
				welcome: false
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
				displayType: "both",
				showSunTimes: true,
				showMoonTimes: "both",
				showWeek: true,
				analogFace: "face-013",
				analogSize: "300px",
				secondsColor: "orangered"
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
			module: "multimonth",
			position: "top_left",
			config: {
				monthCount: 1,
			}
		},

/********** center **********/

		{
			module: "smartNotification",
			position: "top_center",
			classes: "night",
			config: {
				showStatus: false,
				sharpMode: false,
			}
		},
		{
			module: "calendar",
			header: "Calendar evenimente",
			position: "top_left",
			config: {
				fetchInterval: 5 * 60 * 1000,
				coloredSymbol: true,
				tableClass: "xmedium light",
				maximumEntries: 14,
				fade: false,	//
				fadePoint: 0.5,
				calendars: [
					{
						symbol: "calendar-check", color: "skyblue",
						url: "https://calendar.google.com/calendar/ical/ro.romanian%23holiday%40group.v.calendar.google.com/public/basic.ics"
					},
					{
						symbol: "moon", color: "moccasin", maximumEntries: 5,
						url: "https://calendar.google.com/calendar/ical/ht3jlfaac5lfd6263ulfh4tql8%40group.calendar.google.com/public/basic.ics"
					},
					{
						symbol: "calendar-day",  color: "lime",
						url: ""
					},
					{
						symbol: "birthday-cake", color: "gold",
						url: ""
					},
					{
						symbol: "film", color: "magenta",
						url: ""
					},
					{
						symbol: "suitcase",  color: "orange",
						url: ""
					}
				]
			}
		},
		{
			module: "clock",
			position: "top_center",
			disabled: true,
			config: {
				showDate: false,
				analogFace: "face-013",
				analogSize: "300px",
				displayType: "analog",
				secondsColor: "orangered"
			}
		},

/********** right **********/
		{
			module: "onecall",
			position: "top_right",
			classes: "current weather",
			disabled: false,
			config: {
				maxNumberOfDays: 6,
				maxNumberOfHours: 4,
				showCurrentRainAmount: true,
				fadeHourly: false, //
				extraDaily: true,
				random: false,
				showIndoorTemp_Hum: true,
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
				prohibitedWords: ['VIDEO', 'FOTO', 'LIVE TEXT'],
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
