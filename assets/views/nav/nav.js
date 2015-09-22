/**
 *左侧导航
 **/
angular.module('xiaomaiApp').controller('navCtrl', ['$scope', '$state',
  function($scope, $state) {

  }
]);
/**
 *头部
 **/
angular.module('xiaomaiApp').controller('nav.headCtrl', [
  '$scope',
  '$state',
  'schoolManager',
  function($scope, $state, schoolManager) {
    //获取用户当前定位学校
    $scope.schoolname = '未选择所在学校';
    schoolManager.get().then(function(res) {
      $scope.schoolname = res.collegeName;
    });

    //跳转到选择学校页面
    $scope.gotoLocate = function() {
      $state.go('root.locate');
    };

    //跳转到反馈页面
    $scope.gotoFeedback = function() {
      $state.go('root.feedback');
    };

  }
]);



angular.module('xiaomaiApp').controller('nav.listCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'destoryDataManager',
  function($scope, $state, xiaomaiService, schoolManager,
    destoryDataManager) {

    $scope.navs = [];
    //获取导航栏
    xiaomaiService.fetchOne('navgatorlist').then(function(res) {
      $scope.navs = res.navigateItems;
    });

    $scope.paths = {
      '0': 'root.buy.nav.all',
      '1': 'root.buy.nav.recommend',
      '3': 'root.buy.nav.category'
    };

    //在路由跳转之前缓存数据
    $scope.$on('$stateChangeStart', function() {
      destoryDataManager.write(
        $state.current.name + angular.toJson($state.param),
        'navgatorlist', {
          navigateItems: $scope.navs
        });
    });

    $scope.navChecked = function(nav) {
      //all recommend skactive active categoryId
      var flag = false;
      switch ($scope.curpath) {
        case 'all':
          flag = nav.displayType == 0;
          break;
        case 'recommend':
          flag = nav.displayType == 1;
          break;
        case 'active':
          flag = $scope.activityId == nav.activityId;
          break;
        case 'skactive':
          flag = $scope.activityId == nav.activityId;
          break;
        case 'category':
          flag = $scope.curcategoryId == nav.categoryId;
          break;
        default:
          break;
      }
      return flag;
    };

    //监听当前路径变化
    $scope.$on('$stateChangeSuccess', function(e, toState, toParam) {

      $scope.type = toParam.type;
      var reg = /nav\.(\w+)/;


      var curpaths = toState.name.match(reg);
      $scope.curcategoryId = toParam.categoryId;
      $scope.activityId = toParam.activityId;
      // debugger;
      if (curpaths && curpaths.length) {
        $scope.curpath = curpaths[1];
      }

    });

    $scope.goto = function(routerInfo) {
      schoolManager.get().then(function(res) {
        var collegeId = res.collegeId,
          displayType = routerInfo.displayType,
          activityType = routerInfo.activityType,
          path;

        //如果不是活动导航
        if (displayType != 2) {
          path = $scope.paths[displayType];
        } else {
          //0代表秒杀 1代表普通
          path = activityType == 0 ? 'root.buy.skactive' :
            'root.buy.active';
        }

        //跳转到对应的链接上
        $state.go(path, {
          categoryId: routerInfo.categoryId,
          activityId: routerInfo.activityId,
          collegeId: collegeId,
          activeName: encodeURIComponent(routerInfo.navigateName)
        });
      });


    }

  }
]);
