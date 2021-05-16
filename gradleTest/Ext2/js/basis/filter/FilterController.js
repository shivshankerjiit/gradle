var Filter = angular.module('Filter', ['angular.services']);

Filter.directive('conjunction', ['i18n', function (i18n) {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            block: '=conjunctionBlock',
            changedescriptor: '&conjunctionChangedescriptor'
          },

        template:
              '<div class="conjunctionBlock">' +
              '<div ng-class="{spaceAnd: block.y == 0, noSpaceAnd: block.y != 0}">&nbsp;</div>' +
              '<!--div ng-class="{spaceOr: block.x == 0 && block.y == 0, hideOr: block.x != 0 || block.y != 0}">&nbsp;</div-->' +
              '<div ng-class="{showAnd: block.y > 0, hideAnd: block.y == 0}"> {{and}} </div>' +
              '<!-- div ng-class="{showOr: block.x > 0 && block.y == 0, hideOr: block.x == 0 || block.y != 0}"> {{or}} </div-->' +
              '<div class="labelOnTop">' +
              '<label>{{not}}</label><br/>' +
              '<input type="checkbox" ng-change="changedescriptor({block: block, modifyGrid: false})" ng-model="block.sign"></input>' +
              '</div>' +
              '<select ng-model="block.value" ng-change="changedescriptor({block: block, modifyGrid: true})" ng-options="obj.id as obj.name for obj in block.options"></select>' +
              '</div>',

        //templateUrl: 'template.html',
        compile: function (element, attrs) {
            return function (scope, element, attrs) {
              scope.and = i18n.getText('filter.merkmal.and');
              scope.or = i18n.getText('filter.merkmal.or');
              scope.not = i18n.getText('filter.merkmal.not');
            }
        }
    }
}]);

Filter.controller('FilterMerkmalController', ['$scope', '$http', '$window', 'i18n', 'notification',
                            function($scope,$http,$window,i18n,notification) {

  var actionBaseUrl = 'action/filter/';
  var isDelete = false;

  $scope.compactRepresentation = compactRep;

  //get initial data
  var actionUrl = actionBaseUrl + 'read/' + $scope.compactRepresentation
    + ';pdsId=' + pdsId;

  $http.get(actionUrl).success(function(data) {
      $scope.allOptions = data.allOptions;
      $scope.descriptor = data.descriptor;
      $scope.idToName = data.idToName;
      $scope.initialDescriptor = angular.copy($scope.descriptor);
      $scope.computeCompactRepresentation(true);
  });

  setCompactRepresentation = function(rep) {
      var opener = $window.parent;
      if (opener) {
        if(rep.indexOf('undefined') !== -1) {
          opener.document.getElementById('merkmalRuleDisplay').value = "";
        }
        else {
          opener.document.getElementById('merkmalRuleDisplay').value = rep;
        }
      }
    };

    setFilterRepresentation = function(rep) {
        var opener = $window.parent;
        if (opener) {
          if(!isDelete && rep.indexOf('undefined') === -1) {
            opener.document.getElementById('merkmalRule').value = rep;
          }
          else {
            opener.document.getElementById('merkmalRule').value = "";
            isDelete = false;
          }
        }
    };

  deleteRepresentation = function() {
      var opener = $window.parent;
        if (opener) {
          opener.document.getElementById('merkmalRuleDisplay').value = "";
        }
    };

  displayBlock = function(block,prjSpecificNames) {
     var blStr = '';
     if (block.sign) {
       blStr = blStr + '-';
     }
     blStr = blStr + '"' + (prjSpecificNames? $scope.idToName[block.value]: block.value) + '"';
     return blStr;
  };

  $scope.computeCompactRepresentation = function(prjSpecificNames) {
      var rep = '';
      for(i = 0; i < $scope.descriptor.length; i++) {
        var row = $scope.descriptor[i];
        if (row.length > 2) {
          if ( i > 0 ) {
            rep = rep + ' | ';
          }
          rep = rep + '(';
          for(j = 0; j < row.length-1; j++) {
            if ( j > 0) {
              rep = rep + ' & ';
            }
            rep = rep + displayBlock(row[j],prjSpecificNames);
          }
          rep = rep + ')';
        }
        else {
          if (row.length === 2) {
            if ( i > 0 ) {
              rep = rep + ' | ';
            }
            rep = rep + displayBlock(row[0],prjSpecificNames);
          }
        }
      }
      return rep;
  };

  $scope.changeOption = function(block, modifyGrid) {

    if (modifyGrid) {
      var row = $scope.descriptor[block.x];
      if (block.value == '--') {
        // deletion: remove block, if not last
        // in row
        if (block.y != (row.length - 1)) {
          // adapt y value of following
          // siblings
          for (i = block.y + 1; i < row.length; i++) {
            row[i].y = row[i].y - 1;
          }
          row.splice(block.y, 1);
          // row contains only one element?
          // delete row
          if (row.length == 1) {
            // adapt x values of following
            // rows
            for (i = block.x + 1; i < $scope.descriptor.length; i++) {
              var frow = $scope.descriptor[i];
              for (j = 0; j < frow.length; j++) {
                frow[j].x = frow[j].x - 1;
              }
            }
            $scope.descriptor.splice(
                block.x, 1);
          }
        }
      } else {
        // is this the last element in a row?
        // add a block
        if (block.y == (row.length - 1)) {
          row.push({
            x : block.x,
            y : block.y + 1,
            sign : false,
            value : '--',
            options : $scope.allOptions
          });

          // is this the last row? add a new
          // row
          if (block.x == ($scope.descriptor.length - 1)) {
            $scope.descriptor.push([ {
              x : block.x + 1,
              y : 0,
              sign : false,
              value : '--',
              options : $scope.allOptions
            } ]);
          }
        }
      }
    }
    var rep = $scope.computeCompactRepresentation(true);
    setCompactRepresentation(rep);
  };

  $scope.reset = function() {
    $scope.descriptor = angular.copy($scope.initialDescriptor);
    var rep = $scope.computeCompactRepresentation(true);
    setCompactRepresentation(rep);
  };

  $scope.save = function() {
    var rep = $scope.computeCompactRepresentation(false);
    setFilterRepresentation(rep);
    top.DialogManager.unregisterDialog($window);
  }

  $scope.deleteAll = function() {
    var actionUrl = actionBaseUrl + 'read/--'
      + ';pdsId=' + pdsId;

    $http.get(actionUrl).success(function(data) {
        $scope.allOptions = data.allOptions;
        $scope.descriptor = data.descriptor;
        $scope.idToName = data.idToName;
        //$scope.initialDescriptor = angular.copy($scope.descriptor);
        //var rep = $scope.computeCompactRepresentation(true);
        //setCompactRepresentation(rep);
        isDelete = true;
        deleteRepresentation();
    });
  };

  $scope.close = function() {
      $scope.reset();
      top.DialogManager.unregisterDialog($window);


    };

}]);
