/* global NotificationFx */

Module.register("alert", {
	alerts: {},

	defaults: {
		effect: "slide", // scale|slide|genie|jelly|flip|bouncyflip|exploader
		alert_effect: "jelly", // scale|slide|genie|jelly|flip|bouncyflip|exploader
		display_time: 3500, // time a notification is displayed in seconds
		position: "center",
		welcome: false // shown at startup
	},

	getScripts () {
		return ["notificationFx.js"];
	},

	getStyles () {
		return [
				//	"fontawesome.css", 
				this.file("./styles/notificationFx.css"), this.file(`./styles/${this.config.position}.css`)
				];
	},

	getTranslations () {
		return {
			en: "translations/en.json",
			ro: "translations/ro.json"
		};
	},

	getTemplate (type) {
		return `templates/${type}.njk`;
	},

	async start () {
		Log.info(`Starting module: ${this.name}`);

		if (this.config.effect === "slide") {
			this.config.effect = `${this.config.effect}-${this.config.position}`;
		}

		if (this.config.welcome) {
			const message = this.config.welcome === true ? this.translate("welcome") : this.config.welcome;
			await this.showNotification({ title: this.config.welcome === true ? this.translate("sysTitle") : this.config.title, message });
		}
	},

	notificationReceived (notification, payload, sender) {
		if (notification === "SHOW_ALERT") {
			if (payload.type === "notification") {
				this.showNotification(payload);
			} else {
				this.showAlert(payload, sender);
			}
		} else if (notification === "HIDE_ALERT") {
			this.hideAlert(sender);
		}
	},

	async showNotification (notification) {
		const message = await this.renderMessage(notification.templateName || "notification", notification);

		if (!Object.keys(this.alerts).length) {
			this.toggleBlur(true);
		}

		new NotificationFx({
			message,
			layout: "growl",
			effect: this.config.effect,
			ttl: notification.timer || this.config.display_time,
			onClose: () => this.toggleBlur(false),
		}).show();
	},

	async showAlert (alert, sender) {
		// If module already has an open alert close it
		if (this.alerts[sender.name]) {
			this.hideAlert(sender, false);
		}

		// Add overlay
		if (!Object.keys(this.alerts).length) {
			this.toggleBlur(true);
		}

		const message = await this.renderMessage(alert.templateName || "alert", alert);

		// Store alert in this.alerts
		this.alerts[sender.name] = new NotificationFx({
			message,
			effect: this.config.alert_effect,
			ttl: alert.timer,
			onClose: () => this.hideAlert(sender),
			al_no: "ns-alert"
		});

		// Show alert
		this.alerts[sender.name].show();

		// Add timer to dismiss alert and overlay
		if (alert.timer) {
			setTimeout(() => {
				this.hideAlert(sender);
			}, alert.timer);
		}
	},

	hideAlert (sender, close = true) {
		// Dismiss alert and remove from this.alerts
		if (this.alerts[sender.name]) {
			this.alerts[sender.name].dismiss(close);
			delete this.alerts[sender.name];
			// Remove overlay
			if (!Object.keys(this.alerts).length) {
				this.toggleBlur(false);
			}
		}
	},

	renderMessage (type, data) {
		return new Promise((resolve) => {
			this.nunjucksEnvironment().render(this.getTemplate(type), data, function (err, res) {
				if (err) {
					Log.error("Failed to render alert", err);
				}

				resolve(res);
			});
		});
	},

	toggleBlur (add = false) {
		const method = add ? "add" : "remove";
		const modules = document.querySelectorAll(".region");
		for (const module of modules) {
			module.classList[method]("alert-blur");
		}
	}
});
