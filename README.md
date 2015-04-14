# hzDatepicker
angularjs datepicker module

Usage:

Add hz-datepicker.js and style.css to your page. Something like:
<script src="js/modules/hz-datepicker.js"></script>
<link href="css/style.css" rel="stylesheet">

Inject hzDatepicker as a dependency to your app.
var app = angular.module('app', ['hzDatepicker']);

Add datepicker directive to an input field. Call the show() function on focus.
<input datepicker ng-focus="show()" ng-model="selectedDate"></input>

ng-model will be a javascript date object. You can format the date however you like, e.g.
$scope.selectedDate.getMonths() + " " + $scope.selectedDate.getFullYear();
