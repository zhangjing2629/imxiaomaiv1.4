angular.module('xiaomaiApp').controller('collegesCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  function($state, $scope, xiaomaiService) {
    //根据cityid获取学校列表
    $scope.countrylist = [];


    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      var cityid = toParam.cityid;
      getSchoolListByCityId(cityid);
    });

    var getSchoolListByCityId = function(cityid) {

      xiaomaiService.fetchOne('collegelist', {
        cityId: cityid
      }).then(function(res) {
        $scope.countrylist = res.cities;
      });
    };
  }
])
