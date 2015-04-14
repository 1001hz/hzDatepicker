
angular.module('hzDatepicker', []).directive('datepicker', function ($compile) {
    var inputTemplate = '';
    var dateTemplate = '<div class="hz-datepicker"><table  class=""><thead><tr><td ng-click="monthChange(-1)" class="hz-datepicker-header">&lt;</td><td colspan="5" class="hz-datepicker-header hz-datepicker-title">{{month}} {{year}}</td><td ng-click="monthChange(1)" class="hz-datepicker-header">&gt;</td></tr><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr></thead><tbody><tr ng-repeat="week in allWeeks"><td class="hz-datepicker-day" ng-click="select(day.day, day.month)" ng-repeat="day in week" ng-class="{\'selected\':day.selected, \'prev-next-month\':!day.currentMonth}"><span>{{day.day}}</span></td></tr></tbody></table></div>';
    var hourTemplate = '<div class="hz-datepicker"><table border="1" class=""><thead><tr><td colspan="6" class="hz-datepicker-header hz-datepicker-title" ng-click="returnToDates()">{{selectedDateFriendly}}</td></tr></thead><tbody><tr ng-repeat="lines in hours"><td class="hz-datepicker-hour" ng-repeat="hour in lines" ng-click="setHour(hour.hour)" ng-class="{\'selected\':hour.selected}"><span>{{hour.hour}} hr</span></td></tr></tbody></table></div>';
    var minuteTemplate = '<div class="hz-datepicker"><table border="1" class=""><thead><tr><td colspan="4" class="hz-datepicker-header" ng-click="returnToHours()">{{selectedDateFriendly}}</td></tr></thead><tbody><tr ng-repeat="lines in minutes"><td class="hz-datepicker-min" ng-repeat="minute in lines" ng-click="setMinute(minute.minute)" ng-class="{\'selected\':minute.selected}"><span>{{minute.minute}} min</span></td></tr></tbody></table></div>';
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            scope.picking = false;
            scope.show = function () {
                if (!scope.picking) {
                    scope.picking = true;
                    dpElement = angular.element("<div></div>");
                    element.after(dpElement);

                    drawCalendar(date);

                    // set month picker template
                    dpElement.html(dateTemplate);
                    $compile(dpElement.contents())(scope);
                }
            };



            var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
            var date = new Date();
            var month = date.getMonth();
            var year = date.getYear();

            scope.selectedDate = new Date();
            scope.selectedDate.setMinutes(0);
            scope.selectedDateFriendly = scope.selectedDate.getDate() + " " + months[scope.selectedDate.getMonth()] + " " + scope.selectedDate.getFullYear();

            //drawCalendar(date);

            scope.select = function (day, month) {
                // set hour picker template
                dpElement.html(hourTemplate);
                $compile(dpElement.contents())(scope);

                scope.selectedDate.setFullYear(year);
                scope.selectedDate.setMonth(month);
                scope.selectedDate.setDate(day);


                scope.selectedDateFriendly = scope.selectedDate.getDate() + " " + months[scope.selectedDate.getMonth()] + " " + scope.selectedDate.getFullYear();

                drawHours();
            };



            scope.setHour = function (hour) {
                // set minute picker template
                dpElement.html(minuteTemplate);
                $compile(dpElement.contents())(scope);

                scope.selectedDate.setHours(hour);

                scope.selectedDateFriendly = scope.selectedDate.getDate() + " " + months[scope.selectedDate.getMonth()] + " " + scope.selectedDate.getFullYear() + " " + scope.selectedDate.getHours() + ":" + (scope.selectedDate.getMinutes() < 10 ? "0" + scope.selectedDate.getMinutes() : scope.selectedDate.getMinutes());

                drawMinutes();
            };

            scope.returnToDates = function () {
                // set month picker template
                dpElement.html(dateTemplate);
                $compile(dpElement.contents())(scope);
                drawCalendar(date);
            }

            scope.returnToHours = function () {
                // set hour picker template
                dpElement.html(hourTemplate);
                $compile(dpElement.contents())(scope);
                drawHours();
            }


            scope.setMinute = function (minute) {
                // set minute picker template
                dpElement.html(inputTemplate);
                $compile(dpElement.contents())(scope);

                scope.selectedDate.setMinutes(minute);
                scope.selectedDate.setSeconds(0);

                ngModel.$setViewValue(scope.selectedDate);
                ngModel.$modelValue = scope.selectedDate;
                ngModel.$render();
                scope.picking = false;
            };

            scope.monthChange = function (offset) {
                var oldMonth = date.getMonth();
                if (offset == 1) {
                    month = oldMonth == 11 ? 0 : oldMonth + offset;
                }
                if (offset == -1) {
                    month = oldMonth == 0 ? 11 : oldMonth + offset;
                }

                if (oldMonth == 11 && month == 0) {
                    year = date.getFullYear() + 1;
                }
                if (oldMonth == 0 && month == 11) {
                    year = date.getFullYear() - 1;
                }

                date.setMonth(month);
                date.setYear(year);
                drawCalendar(date);
            };


            function drawHours() {
                var shour = scope.selectedDate.getHours();
                var line = [];
                var column = [];
                for (var i = 1; i <= 24; i++) {
                    var selected = shour == i ? true : false;
                    if (i % 6 != 0) {
                        var val = i < 10 ? "0" + i : i;
                        line.push({ hour: val, selected: selected });
                    }
                    else {
                        var val = i < 10 ? "0" + i : i;
                        line.push({ hour: val, selected: selected });
                        column.push(line);
                        line = [];
                    }
                }
                scope.hours = column;
            }



            function drawMinutes() {
                var smin = scope.selectedDate.getMinutes();
                var line = [];
                var column = [];
                for (var i = 0; i <= 55; i = i + 5) {
                    var selected = smin == i ? true : false;
                    if (i == 15 || i == 35 || i == 55) {
                        var val = i;
                        line.push({ minute: val, selected: selected });
                        column.push(line);
                        line = [];
                    }
                    else {
                        var val = i < 10 ? '0' + i : i;
                        line.push({ minute: val, selected: selected });
                    }
                }
                scope.minutes = column;
            }



            function drawCalendar(date) {

                var dateToday = new Date();
                var day = dateToday.getDate();

                if (year <= 200) {
                    year += 1900;
                }

                days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                if (year % 4 == 0 && year != 1900) {
                    days_in_month[1] = 29;
                }
                total = days_in_month[month];
                var date_today = day + ' ' + months[month] + ' ' + year;
                beg_j = date;
                beg_j.setDate(1);
                if (beg_j.getDate() == 2) {
                    beg_j = setDate(0);
                }
                beg_j = beg_j.getDay();

                week = 0;
                var allWeeks = [];
                var thisWeek = [];

                for (i = 1; i <= beg_j; i++) {
                    prevMonth = month == 0 ? 11 : month - 1;
                    thisWeek.push({ day: days_in_month[prevMonth] - beg_j + i, month: prevMonth, selected: checkForSelected(i, month, year), currentMonth: false });
                    week++;
                }

                for (i = 1; i <= total; i++) {
                    if (week == 0) {
                        allWeeks.push(thisWeek);
                        thisWeek = [];
                    }
                    if (day == i) {
                        thisWeek.push({ day: i, month: month, selected: checkForSelected(i, month, year), currentMonth: true });
                    }
                    else {
                        thisWeek.push({ day: i, month: month, selected: checkForSelected(i, month, year), currentMonth: true });
                    }
                    week++;
                    if (week == 7) {
                        week = 0;
                    }
                }
                for (i = 1; week != 0; i++) {
                    nextMonth = month == 11 ? 0 : month + 1;
                    thisWeek.push({ day: i, month: nextMonth, selected: checkForSelected(i, month, year), currentMonth: false });
                    week++;
                    if (week == 7) {
                        week = 0;
                    }
                }

                allWeeks.push(thisWeek);

                scope.allWeeks = allWeeks;
                scope.month = months[month];
                scope.year = year;
            }

            function checkForSelected(day, month, year) {
                var sday = scope.selectedDate.getDate();
                var smonth = scope.selectedDate.getMonth();
                var syear = scope.selectedDate.getFullYear();
                if (sday == day && smonth == month && syear == year) {
                    return true;
                }
                return false;
            }

        }
    };
});
