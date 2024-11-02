"use strict";

/* MagicMirror²
 * Module: monthly calendar
 *
 * Redesigned by Răzvan Cristea
 * for iPad 3 & HD display
 *
 * https://github.com/cristearazvanh
 * Creative Commons BY-NC-SA 4.0, Romania. 
 *
 * Original MagicMirror² MIT Licensed.
 * Fuck you BKasshole!
 */

Module.register("monthly", {
  defaults: {
    startMonth: 0,    // Define when you start from current month
    monthCount: 2,    // Define How many months to display
    monthsVertical: true,    // Whether to arrange the months vertically (true) or horizontally (false).
    repeatWeekdaysVertical: false,    // Whether to repeat the week days in each month in vertical mode. Ignored in horizontal mode.
    weekNumbers: true,    // Whether to display the week numbers in front of each week.
    weekNumbersISO: true,    // Use ISO (monday based week) rather than US (Sunday Based week) Ignored if weekNumbers is not used. 
    highlightWeekend: true,    // Highlight your weekend. 
    headerType: 'short',    // Short or Narrow. (USA: Short: "Sun", "Mon", etc - Narrow: "SMTWTFS")
    otherMonths: true,    // Do you want to show other months or not. (previous/next)
    startWeek: 1,    // What day starts your week? 
    weekend1: 6,    // what is the first day of your weekend? 
    weekend2: 7,    // what is the second day of your weekend?  
    eventsOn: true,    // Underline events
    calNames: [],    // List of calendar names to trigger underline. Empty will do all of them. 
    fade: false
  },
  // CSS Add
  getStyles: function getStyles() {
    return ["monthly.css"];
  },
  // Update at midnight
  start: function start() {
    Log.info("Starting module: " + this.name);
    var self = this;
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var nextday = day + 1;
    var year = date.getFullYear();
    var reset = new Date(year, month, nextday, 0, 0, 0, 0).getTime() - date.getTime();
    var timer = setInterval(function () {
      self.updateDom();
    }, reset);
    this.storedEvents = [];
  },
  notificationReceived: function notificationReceived(notification, payload, sender) {
    if (notification === 'CALENDAR_EVENTS') {
      this.storedEvents = JSON.parse(JSON.stringify(payload));
      this.updateDom();
    }
    if (notification === "MIDNIGHT_NOTIFICATION") {
      this.updateDom();
    }
  },
  // Override dom generator.
  getDom: function getDom() {
    var self = this;
    // Functions
    var firstDay = function firstDay(dateObject, index) {
      var dayOfWeek = dateObject.getDay(),
        firstDay = new Date(dateObject),
        diff = dayOfWeek >= index ? dayOfWeek - index : 6 - dayOfWeek;
      firstDay.setDate(dateObject.getDate() - diff);
      firstDay.setHours(0, 0, 0, 0);
      return firstDay;
    };
    var lastDay = function lastDay(dateObject, index) {
      var dayOfWeek = dateObject.getDay(),
        lastDay = new Date(dateObject),
        diff = (index + (7 - dateObject.getDay())) % 7;
      lastDay.setDate(dateObject.getDate() + diff);
      lastDay.setHours(0, 0, 0, 0);
      return lastDay;
    };
    var weekNames = function weekNames(dateObject, index) {
      var sDate = firstDay(dateObject, 0);
      var weekdaysTemp = [];
      var weekdaysHeader = "";
      for (var tday = 0; tday < 7; tday++) {
        weekdaysTemp.push(sDate.toLocaleDateString(config.language, {
          weekday: self.config.headerType
        }));
        sDate.setDate(sDate.getDate() + 1);
      }
      for (tday = 0; tday < 7; tday++) {
        var offset = tday + index;
        if (offset >= 7) offset = offset - 7;
        weekdaysHeader += "<div class='dow day-header ".concat(weekdaysTemp[offset], "'> ").concat(weekdaysTemp[offset], " </div>");
      }
      return weekdaysHeader;
    };
    var weekNumber = function weekNumber(dateObject) {
      var result = weekNumberISO(dateObject);
      return result;
    };
    var weekNumberISO = function weekNumberISO(dateObject) {
      var mondayDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() + 1);
      var oneJan = new Date(mondayDate.getFullYear(), 0, 1);
      var numberOfDays = Math.floor((mondayDate - oneJan) / (24 * 60 * 60 * 1000));
      var result = Math.ceil((mondayDate.getDay() + 1 + numberOfDays) / 7);
      return result;
    };
    var matchName = function matchName(cn) {
      var result = true;
      if (self.config.calNames.length > 0) {
        result = false;
        for (var ev = 0; ev < self.config.calNames.length; ev++) {
          if (self.config.calNames[ev] == cn) {
            result = true;
          }
        }
      }
      return result;
    };
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var wrapper = document.createElement("div");
    var lastMonth = this.config.startMonth + this.config.monthCount - 1;

    // pre-calculcate the header line containing the week days - no need to repeat this for every month
    var weekdaysHeader = "<div class='days-header'>";
    if (this.config.weekNumbers) {
      // empty cell as a placeholder for the week number
      weekdaysHeader += "<div class='day-header shade'>" + this.translate("WEEK!") + "</div>";
    }
    weekdaysHeader += weekNames(date, this.config.startWeek);
    weekdaysHeader += "</div>";

    // set calendar main container depending on calendar orientation
    if (this.config.monthsVertical) {
      var output = "<div class='multimonth calendar-vertical'>";
    } else {
      output = "<div class='multimonth calendar-horizontal'>";
    }
    // iterate through months to display
    for (var currentMonth = this.config.startMonth; currentMonth <= lastMonth; currentMonth++) {
      if (this.config.fade) {
        output += "<div class='month fade'>";
      } else {
        output += "<div class='month normal'>";
      }

      // add the month headers
      var titleTemp = new Date(year, month + currentMonth, 1);
      var monthTitle = titleTemp.toLocaleString(config.language, {
        month: 'long',
        year: 'numeric'
      });
      output += "<header class='month-header midget capital'><i class=\"fa fa-calendar skyblue\"></i> &nbsp;" + monthTitle + "</header>";

      // add day of week headers
      if (!this.config.monthsVertical || this.config.repeatWeekdaysVertical || currentMonth == this.config.startMonth) {
        output += weekdaysHeader;
      }
      var firstDayOfMonth = new Date(year, month + currentMonth, 1, 0, 0, 0, 0);
      var lastDayOfMonth = new Date(year, month + currentMonth + 1, 0, 0, 0, 0, 0);
      var gridDay = firstDay(firstDayOfMonth, this.config.startWeek);
      var gridEnd = lastDay(lastDayOfMonth, this.config.startWeek - 1);

      // Week grid builder
      do {
        output += "<div class='week'>";
        if (this.config.weekNumbers) {
          if (this.config.weekNumbersISO) {
            output += "<div class='weeknumber w".concat(weekNumberISO(gridDay), "'>").concat(weekNumberISO(gridDay), "</div>");
          } else {
            output += "<div class='weeknumber w".concat(weekNumber(gridDay), "'>").concat(weekNumber(gridDay), "</div>");
          }
        }
        for (var dow = 0; dow <= 6; dow++) {
          // Walk the week 
          if (gridDay.getMonth() == firstDayOfMonth.getMonth()) {
            // Current Month?
            output += "<div class='day";
            if (gridDay.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0)) {
              output += " current current_day";
            }
            if (this.config.highlightWeekend && (gridDay.getDay() == this.config.weekend1 || gridDay.getDay() == this.config.weekend2)) {
              output += " weekend";
            }
            for (var ev = 0; ev < this.storedEvents.length; ev++) {
              // calendarName is property needed. 
              var match = matchName(this.storedEvents[ev].calendarName);
              var orig = new Date(Number(this.storedEvents[ev].startDate));
              var modi = orig.setHours(0, 0, 0, 0);
              if (modi == gridDay.getTime() && this.config.eventsOn && match) {
                output += " event";
              }
              ;
            }
            ;
            output += " ".concat(gridDay.getMonth() + 1, "-").concat(gridDay.getDate(), "'> ").concat(gridDay.getDate(), "</div>");
          } else {
            if (this.config.otherMonths) {
              output += "<div class='dim daydim ".concat(gridDay.getDate(), "'>").concat(gridDay.getDate(), "</div>");
            } else {
              output += "<div class='dim'>&nbsp;</div>";
            }
          }
          gridDay.setDate(gridDay.getDate() + 1);
        }
        output += "</div>"; // end of week
      } while (gridDay < gridEnd);
      output += "</div>"; // end of month
    }

    output += "</div>"; // end of calendar
    wrapper.innerHTML = output;
    return wrapper;
  }
});