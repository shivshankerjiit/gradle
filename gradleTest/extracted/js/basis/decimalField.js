/**
 * Input control that allows decimal numbers
 *
 * Options are:
 * - decimalPlaces 		{optional - default is 2}
 * - decimalSeparator	{optional - default is ,}
 *
 * To initialize start value, set value in ng-init, see an example here:
 * ng-model="myPropertyIWantToSet" ng-init="myPropertyIWantToSet='2,56'".
 *
 * Here is a complete example how to use it:
 * <span ng-app="decimalField" ng-controller="DecimalFieldCtrl">
 * 		<input type="text" ng-model="salary" ng-init="salary='2,56'" data-decimal-separator="," data-decimal-places="2" valid-decimal />
 * </span>
 */
var decimalField = angular.module('decimalField', []);
decimalField.controller('DecimalFieldCtrl', function($scope) {});
decimalField.directive('validDecimal', function() {
    return {
    	scope: { },
    	require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            scope.DECIMAL_PLACES = attrs.decimalPlaces || 2;
            scope.DELIMITER = attrs.decimalSeparator || ',';
            scope.REGEX = scope.DELIMITER === ',' ? /[^0-9\,]/g : /[^0-9\.]/g;

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }

                var clean = val.replace(scope.REGEX, '');
                var decimalCheck = clean.split(scope.DELIMITER);

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                    clean = decimalCheck[0] + scope.DELIMITER + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});