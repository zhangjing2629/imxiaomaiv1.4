/**
 *进行定位
 **/
angular.module('xiaomaiApp').controller('positionCtrl', [
  '$scope',
  'locationManager',
  '$state',
  'xiaomaiService',
  'schoolManager',
  function(
    $scope,
    locationManager,
    $state,
    xiaomaiService,
    schoolManager
  ) {
    $scope.locationResult = [];
    $scope.isLocating = true; //默认正在执行定位

    //获取定位
    locationManager().then(function(lnglat) {

      return xiaomaiService.fetchOne('locate', {
        latitude: lnglat.lat,
        longitude: lnglat.lng
      })

    }).then(function(res) {
      $scope.locationResult = res.colleges;
    }, function() {
      $scope.localFail = true;
    }).finally(function() {
      $scope.isLocating = false;
    });


    //获取所有城市列表
    $scope.citylist = [];
    $scope.isLoadingCollege = true;
    xiaomaiService.fetchOne('citylist', {}, true).then(function(res) {
      $scope.citylist = res.cities;
      $scope.loadCollegesFail = false;
    }, function() {
      $scope.loadCollegesFail = true;
    }).finally(function() {
      $scope.isLoadingCollege = false;
    });


    //选择当前城市
    $scope.showCollegeList = function(city) {
      $state.go('root.locate.colleges', {
        cityid: city.cityId
      });
    };

    //监听路由参数中的cityId变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {
      $scope.curcityid = toParam.cityid;
      //获取当前城市学校列表
    });

    $scope.checkCollege = function(college) {
      schoolManager.set(college).then(function() {
        $state.go('root.buy.nav.all');
      });
    }
  }
]);
