Module.register("system", {
    defaults: {
        cpuUpdateInterval: 5000,    // CPU usage and temperature update every 5 second
        ramUpdateInterval: 10000,   // RAM usage update every 10 seconds
        diskUpdateInterval: 30000,  // Disk usage update every 30 seconds

        // Configurable options to enable/disable specific metrics
        showCpuUsage: true,
        showCpuTempC: true,
        showCpuTempF: false,
        showRamUsage: true,
        showDiskUsage: true
    },

    getStyles: function () {
        return ["system.css"];
    },

    start: function() {
        this.stats = {
            cpuUsage: 0,  
            cpuTemp: 0,
            cpuTempF: 0,
            usedRam: 0,
            freeRam: 0,
            totalRam: 0,
            driveCapacity: 0,
            freeSpace: 0
        };
        this.updateCpuStats();
        this.updateRamStats();
        this.updateDiskUsage();

        this.scheduleCpuUpdate();
        this.scheduleRamUpdate();
        this.scheduleDiskUpdate();
    },

    updateCpuStats: function() {
        if (this.config.showCpuUsage) {
            this.sendSocketNotification("GET_CPU_USAGE");
        }

        if (this.config.showCpuTempC || this.config.showCpuTempF) {
            this.sendSocketNotification("GET_CPU_TEMP");
        }
    },

    updateRamStats: function() {
        if (this.config.showRamUsage) {
            this.sendSocketNotification("GET_RAM_USAGE");
        }
    },

    updateDiskUsage: function() {
        if (this.config.showDiskUsage) {
            this.sendSocketNotification("GET_DISK_USAGE");
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CPU_USAGE") {
            this.stats.cpuUsage = payload.cpuUsage;
            this.updateDom();
        }
        if (notification === "CPU_TEMP") {
            this.stats.cpuTemp = payload.cpuTemp;
            this.stats.cpuTempF = payload.cpuTempF; 
            this.updateDom();
        }
        if (notification === "RAM_USAGE") {
            this.stats.usedRam = payload.usedRam;
            this.stats.freeRam = payload.freeRam;
            this.stats.totalRam = payload.totalRam;
            this.updateDom();
        }
        if (notification === "DISK_USAGE") {
            this.stats.driveCapacity = payload.driveCapacity;
            this.stats.freeSpace = payload.freeSpace;
            this.updateDom();
        }
        if (notification === "ERROR_READING") {
            this.hide();
        }
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        wrapper.className = "system-stats";

        // CPU Usage Display
        if (this.config.showCpuUsage) {
            let usageCpu = document.createElement("div");
            usageCpu.className = "cpu-usage";
            usageCpu.innerHTML = `Utilizare procesor: <strong>${this.stats.cpuUsage}%</strong>`;
            wrapper.appendChild(usageCpu);

            let cpuBar = document.createElement("progress");
            cpuBar.value = this.stats.cpuUsage;
            cpuBar.max = 100;
            wrapper.appendChild(cpuBar);
        }

        // CPU Temperature Display (both Celsius and Fahrenheit)
        if (this.config.showCpuTempC || this.config.showCpuTempF) {
            let cpuTemp1 = document.createElement("div");
            cpuTemp1.className = "cpu-temp";
            let tempText = `Temperatură procesor: <strong>`;
            if (this.config.showCpuTempC) {
                tempText += `${this.stats.cpuTemp}ºC`;
            } else
            if (this.config.showCpuTempF) {
                tempText += ` / ${this.stats.cpuTempF}ºF`;
            }
            tempText += `</strong>`;
            cpuTemp1.innerHTML = tempText;
            wrapper.appendChild(cpuTemp1);

            let tempBar = document.createElement("progress");
            tempBar.value = this.stats.cpuTemp;
            tempBar.max = 100;
            wrapper.appendChild(tempBar);

        }

        // RAM Usage Display
        if (this.config.showRamUsage) {
            let usageRam = document.createElement("div");
            usageRam.className = "ram-usage";
            usageRam.innerHTML = `Memorie: <strong>${this.stats.usedRam}MB în uz / ${this.stats.freeRam}MB liberi</strong>`;
            wrapper.appendChild(usageRam);

            let ramBar = document.createElement("progress");
            ramBar.value = this.stats.usedRam;
            ramBar.max = this.stats.totalRam;
            wrapper.appendChild(ramBar);

            let totalRam = document.createElement("div");
            totalRam.className = "ram-usage";
            totalRam.innerHTML = `Total: <strong>${this.stats.totalRam}MB (1GB) ${(this.stats.usedRam/this.stats.totalRam*100).toFixed(2)}% / ${(this.stats.freeRam/this.stats.totalRam*100).toFixed(2)}%</strong>`;
            wrapper.appendChild(totalRam);
        }

        // Disk Usage Display
        if (this.config.showDiskUsage) {
            let usageDisk = document.createElement("div");
            usageDisk.className = "disk-usage";
            usageDisk.innerHTML = `Spațiu card: <strong>${this.stats.driveCapacity} (64GB) / ${this.stats.freeSpace} liberi</strong>`;
            wrapper.appendChild(usageDisk);
/*
            let diskBar = document.createElement("progress");
            diskBar.value = this.stats.freeSpace;
            diskBar.max = this.stats.driveCapacity;
            wrapper.appendChild(diskBar);
*/
        }

        return wrapper;
    },

    scheduleCpuUpdate: function() {
        setInterval(() => {
            this.updateCpuStats();
        }, this.config.cpuUpdateInterval);
    },

    scheduleRamUpdate: function() {
        setInterval(() => {
            this.updateRamStats();
        }, this.config.ramUpdateInterval);
    },

    scheduleDiskUpdate: function() {
        setInterval(() => {
            this.updateDiskUsage();
        }, this.config.diskUpdateInterval);
    }
});
