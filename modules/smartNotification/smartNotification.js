/* https://github.com/razvanh255 */

Module.register("smartNotification", {
    defaults: {
        showStatus: true,
        dynamicBackground: false,
        dimInterval: 10,
        dimLevel: 50,
        dimStart: "23:50",
        dimEnd: "05:50",
        rotation: false,
        format: 16/9,
        sharpMode: false,
        hideModulesTime: "00:00",
        showModulesTime: "00:00",
        modulesToHide: [],
        notifications: [
            {
                month: 13, // under development
                day: 25,
                startHour: 8,
                endHour: 23,
                titles: [
                    '<i class="fa-solid fa-gift mooncolor"></i> Crăciun fericit!', 
                    '<i class="fa-solid fa-gifts mooncolor"></i> Sărbători fericite!'],
                messages: ["Multă sănătate și multe bucurii!"]
            }
        ]
    },

    getTranslations: function () {
        return {
            en: "en.json",
            ro: "ro.json"
        };
    },

    start: function () {
        document.body.style.opacity = 0;
        this.isOnline = navigator.onLine;
        this.scheduleNotifications();
        this.scheduleHourlyNotifications();
        this.checkTimeNotification();
        this.dynamicBackground();
        this.scheduleBrightness();
        this.scheduleHideModules();
        this.scheduleShowModules();
        this.checkOnlineStatus();
        this.adjustZoom();
        window.addEventListener("resize", this.adjustZoom.bind(this));
        var self = this;
        setTimeout(function() {
            document.body.style.transition = "opacity 2s ease-in-out";
            document.body.style.opacity = 1;
            if (self.config.rotation) {
                self.rotatePage();
            }
        }, 1000);
    },

    getStyles: function () {
        return [
                //  "fontawesome.css"
                ];
    },

    scheduleNotifications: function () {
        const probability = 0.002; // Probabilitate

        const checkNotifications = () => {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentDay = now.getDate();
            const currentHour = now.getHours();

            this.config.notifications.forEach(notification => {
                if (notification.month !== null && notification.day !== null) {
                    if (notification.month === currentMonth && notification.day === currentDay) {
                        if (currentHour >= notification.startHour && currentHour < notification.endHour) {
                            if (Math.random() < probability) {
                                let randomMessage = this.getRandomMessage(notification.messages);
                                let randomTitle = this.getRandomTitle(notification.titles);
                                this.sendNotification("SHOW_ALERT", {
                                    type: "notification",
                                    title: randomTitle,
                                    message: randomMessage,
                                    timer: 8000
                                });
                            }
                        }
                    }
                } else {
                    if (currentHour === notification.startHour) {
                        if (Math.random() < probability) {
                            let randomMessage = this.getRandomMessage(notification.messages);
                            let randomTitle = this.getRandomTitle(notification.titles);
                            this.sendNotification("SHOW_ALERT", {
                                type: "notification",
                                title: randomTitle,
                                message: randomMessage,
                                timer: 8000
                            });
                        }
                    }
                }
            });
        };

        checkNotifications();
        setInterval(checkNotifications, 1000);
    },

    getRandomMessage: function (messages) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    },

    getRandomTitle: function (titles) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        return titles[randomIndex];
    },

    scheduleHourlyNotifications: function () {
        setInterval(() => {
            const now = new Date();
            if (now.getMinutes() === 62 && now.getSeconds() === 62) { // under development
                this.sendNotification("HIDE_ALERT");
                this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "<i class='fa-regular fa-clock gold'></i> Ora exactă",
                    message: "Este ora: " + now.getHours() + ":00",
                    timer: 5000
                });
            }
        }, 1000);
    },

    checkTimeNotification: function() {
        if (this.config.sharpMode) {
            setInterval(() => {
                var now = new Date();
                var currentTime = now.toTimeString().split(" ")[0];
                var sharp = this.translate("Time it was ") + currentTime;
                var bell = "<i class=\"fas fa-bell green\"></i> ";
                var gift = "<i class=\"fas fa-gift orange\"></i> ";
                var glas = "<i class=\"fas fa-glass-cheers gold\"></i> ";
                var hart = "<i class=\"fas fa-heart orangered\"></i> ";
                var cake = "<i class=\"fas fa-birthday-cake mooncolor\"></i> ";

                var timeIntervals = [
                    { hours: ["23:00:00", "00:06:00", "01:00:00"], message: this.translate("Good night!") },
                    { hours: ["02:00:00", "03:00:00", "04:00:00"], message: this.translate("Sleep well!") },
                    { hours: ["05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00"], message: this.translate("Good morning!") },
                    { hours: ["12:00:00", "13:00:00", "14:00:00"], message: this.translate("Bon appetit!") },
                    { hours: ["15:00:00", "16:00:00", "17:00:00"], message: this.translate("Have a nice day!") },
                    { hours: ["18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00"], message: this.translate("Have a nice evening!") }
                ];

                for (var i = 0; i < timeIntervals.length; i++) {
                    if (timeIntervals[i].hours.includes(currentTime)) {
                        this.sendNotification("SHOW_ALERT", {
                            //imageFA: bell,
                            type: "notification",
                            title: bell + sharp,
                            message: timeIntervals[i].message,
                            timer: 8000
                        });
                        break;
                    }
                }
            }, 1000);
        }
    },

    dynamicBackground: function() {
        if (this.config.dynamicBackground) {
            var below = document.querySelector('.below');
            if (!below) return;
            
            below.style.backgroundImage = "url(" + this.config.dynamicBackground + ")";
            below.style.backgroundSize = "70%";
            below.style.backgroundPosition = "center 40%";
            below.style.backgroundRepeat = "no-repeat";
            
    /*        setInterval(() => {
                var date = new Date();
                var currentHour = date.getHours();
                var currentMinute = date.getMinutes();
                var currentMinute = date.getMinutes();
                
                var periods = [
                    { startHour: 6, startMinute: 0, endHour: 23, endMinute: 59, image: "css/lcars/lcars01.jpg", transition: "5s" },
                    { startHour: 0, startMinute: 0, endHour: 5, endMinute: 59, image: "css/lcars/lcars02.jpg", transition: "2s" }
                ];

                for (var i = 0; i < periods.length; i++) {
                    var period = periods[i];
                    if (
                        (currentHour > period.startHour || 
                        (currentHour === period.startHour && currentMinute >= period.startMinute)) &&
                        (currentHour < period.endHour || 
                        (currentHour === period.endHour && currentMinute < period.endMinute))
                    ) {
                        below.style.backgroundImage = "url('" + period.image + "')";
                        below.style.transition = "background-image " + period.transition + " ease-in-out";
                        break;
                    }
                }

            }, 5000);
    */    }
    },

    scheduleBrightness: function () {
        this.scheduleBrightnessChange(this.config.dimStart, this.config.dimLevel);
        this.scheduleBrightnessChange(this.config.dimEnd, 100); // 100% pentru restaurare
    },

    scheduleBrightnessChange: function (timeConfig, targetLevel) {
        if (!timeConfig) {
            console.error("timeConfig is undefined or null");
            return; // Iese din funcție dacă timeConfig nu este definit
        }

        let [hour, minute] = timeConfig.split(":").map(Number);
        let now = new Date();
        let changeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (changeTime <= now) {
            changeTime.setDate(now.getDate() + 1);
        }

        let timeToChange = changeTime - now;
        setTimeout(() => {
            this.fadeBrightness(targetLevel);
            this.scheduleBrightnessChange(timeConfig, targetLevel); // Reprogramare zilnică
        }, timeToChange);
    },
/*
    fadeBrightness: function (targetLevel) {
        let currentBrightness = parseFloat(document.body.style.opacity) || 1; // Obține luminozitatea curentă
        let step = (targetLevel / 100 - currentBrightness) / 60; // Calculul pașilor pentru tranziție de 60 de secunde

        let fadeInterval = setInterval(() => {
            currentBrightness += step;

            // Asigură-te că luminozitatea nu depășește limitele
            if ((step > 0 && currentBrightness >= targetLevel / 100) || (step < 0 && currentBrightness <= targetLevel / 100)) {
                currentBrightness = targetLevel / 100; // Setează luminozitatea la nivelul țintă
                clearInterval(fadeInterval); // Oprește intervalul odată ce s-a ajuns la țintă
            }
            
            document.body.style.opacity = currentBrightness; // Aplică luminozitatea curentă
        }, 1000); // Actualizează fiecare secundă
    },
*/
    fadeBrightness: function (targetLevel, startTime) {
        let currentBrightness = parseFloat(document.body.style.opacity) || 1; // Obține luminozitatea curentă
        let step = (targetLevel / 100 - currentBrightness) / 60; // Calculul pașilor pentru tranziție de 60 de secunde

        const applyFade = () => {
            let fadeInterval = setInterval(() => {
                currentBrightness += step;

                // Asigură-te că luminozitatea nu depășește limitele
                if ((step > 0 && currentBrightness >= targetLevel / 100) || (step < 0 && currentBrightness <= targetLevel / 100)) {
                    currentBrightness = targetLevel / 100; // Setează luminozitatea la nivelul țintă
                    clearInterval(fadeInterval); // Oprește intervalul odată ce s-a ajuns la țintă
                }

                document.body.style.opacity = currentBrightness; // Aplică luminozitatea curentă
            }, 1000); // Actualizează fiecare secundă
        };

        // Verifică dacă timpul de start a trecut
        const now = new Date();
        const start = new Date(startTime);

        if (now >= start) {
            applyFade(); // Execută tranziția direct
        } else {
            // Ascultă evenimentul DOMContentLoaded
            document.addEventListener("DOMContentLoaded", () => {
                const nowAfterLoad = new Date();
                if (nowAfterLoad >= start) {
                    applyFade();
                }
            });
        }
    },

    scheduleHideModules: function () {
        let now = new Date();
        let [hour, minute] = this.config.hideModulesTime.split(":").map(Number);
        let hideModulesAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (hideModulesAt <= now) {
            hideModulesAt.setDate(now.getDate() + 1);
        }

        let timeToHide = hideModulesAt - now;

        setTimeout(() => {
            this.config.modulesToHide.forEach(moduleName => {
                let modules = MM.getModules().withClass(moduleName);
                modules.forEach(module => module.hide());
            });
            this.scheduleHideModules(); 
        }, timeToHide);
    },

    scheduleShowModules: function () {
        let now = new Date();
        let [hour, minute] = this.config.showModulesTime.split(":").map(Number);
        let showModulesAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (showModulesAt <= now) {
            showModulesAt.setDate(now.getDate() + 1);
        }

        let timeToShow = showModulesAt - now;

        setTimeout(() => {
            this.config.modulesToHide.forEach(moduleName => {
                let modules = MM.getModules().withClass(moduleName);
                modules.forEach(module => module.show());
            });
            this.scheduleShowModules();
        }, timeToShow);
    },

    adjustZoom: function () {
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
        let zoomLevel = 1;

        if (screenWidth >= 1080) {
            zoomLevel = 0.8;
        } else if (screenWidth >= 800) {
            zoomLevel = 0.7;
        } else {
            zoomLevel = 0.6;
        }

        document.body.style.zoom = zoomLevel;
    },

    rotatePage: function () {
        var html = document.querySelector("html");
        var body = document.querySelector("body");
        
        if (this.config.rotation === 90 && this.config.format === 4/3) {
            body.style.transform = "rotate(90deg)";
            body.style.transformOrigin = "bottom right";
            body.style.position = "absolute";
            body.style.bottom = "0";
            body.style.right = "96%";
            body.style.height = "121vw";
            body.style.width = "118vh";
        } else if (this.config.rotation === 90 && this.config.format === 3/4) {
            body.style.transform = "rotate(90deg)";
            body.style.transformOrigin = "bottom right";
            body.style.position = "absolute";
            body.style.bottom = "0";
            body.style.right = "98%";
            body.style.height = "130vw";
            body.style.width = "129vh";
            body.style.zoom = 0.75;
        }
    },

    getDom: function () {
        if (!this.config.showStatus) {
            document.querySelector(".smartNotification").style.visibility = "hidden";
        }
        const wrapper = document.createElement("div");
        
        wrapper.innerHTML = this.isOnline 
            ? "<i class=\"green medium fas fa-wifi\"></i>&nbsp; <span class='slarge bright light'>MagicMirror²</span><br>Platforma modulară este online"
            : "<i class=\"orangered medium fas fa-wifi\"></i>&nbsp; <span class='orangered slarge bright light'>Fără conexiune</span><br>Verifică conexiunea și routerul WiFi";
        
        return wrapper;
    },

    checkOnlineStatus: function () {
        const checkStatus = () => {
            const previousStatus = this.isOnline;
            this.isOnline = navigator.onLine;
            
            if (previousStatus !== this.isOnline) {
                if (!this.config.showStatus) {
                    this.sendNotification("SHOW_ALERT", {
                    type: "notification",
                    title: "<i class=\"orangered medium fas fa-wifi\"></i>&nbsp; <span class='orangered slarge bright light'>Fără conexiune</span>",
                    message: "Verifică conexiunea și routerul WiFi",
                    timer: 10000
                    });
                } else this.updateDom();
            }
        };

        checkStatus();
        setInterval(checkStatus, 1000);
    }
});
