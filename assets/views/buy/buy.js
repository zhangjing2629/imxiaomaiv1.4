angular.module('xiaomaiApp').controller('buyCtrl', [
  '$state',
  '$scope',
  'schoolManager',
  '$q',
  function($state, $scope, schoolManager, $q) {
    //在这里拦截用户请求
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      //在这里请求用户学校信息
      schoolManager.get().then(function(schoolInfo) {
        collegeId = schoolInfo.collegeId;
      }, function() {
        $state.go('root.locate');
      });
    });


  }
]);
