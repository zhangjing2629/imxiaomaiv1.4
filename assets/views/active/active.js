angular.module('xiaomaiApp').controller('buy.activeCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'detailManager',
  'shopValidate',
  'cartManager',
  function($scope, $state, xiaomaiService, detailManager, shopValidate,
    cartManager) {
    var collegeId, activityId, page, bannerhasFresh = false;
    //监听路由参数变化
    $scope.$on('$stateChangeSuccess', function(e, tostate, toparam) {
      collegeId = toparam.collegeId;
      activityId = toparam.activityId;
      page = toparam.page || 1;
      $scope.activeName = decodeURIComponent(toparam.activeName);

      loadSku();

      !bannerhasFresh && loadBanner();
    });


    //抓取Banner信息
    function loadBanner() {
      xiaomaiService.fetchOne('activeBanner', {
        collegeId: collegeId,
        activityId: activityId
      }).then(function(res) {
        // debugger;
      })
    }

    $scope.goodsList = [];
    //获取活动商品列表数据
    var loadSku = function() {
      xiaomaiService.fetchOne('activeGoods', {
        collegeId: collegeId,
        activityId: activityId,
        currentPage: page,
        recordPerPage: 20,
        v: (+new Date)
      }).then(function(res) {
        console.log(res);
        $scope.goodsList = $scope.goodsList.concat(res.goods);
      });
    };

    //跳转到详情页
    $scope.gotoDetail = function(good) {
      detailManager.gotoDetail({
        goodId: good.bgGoodsId,
        sourceType: good.sourceType
      });
    };

    //执行购买
    $scope.buyHandler = function(good) {
      if (good.goodsType == 3) {
        $scope.gotoDetail(good);
        return false;
      }

      //校验是否超出了最大库存
      var validatelist = {
        'maxCountVali': [good.skuList[0].numInCart, good.maxNum]
      };

      if (!shopValidate(validatelist)) {
        return false;
      }

      debugger;

      //执行购买
      cartManager.add({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      });
    };



    //翻页
    $scope.pagination = function(page) {}
  }
]);
