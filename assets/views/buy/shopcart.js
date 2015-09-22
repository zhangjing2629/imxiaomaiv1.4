angular.module('xiaomaiApp').controller('buy.cartThumbCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartManager',
  'cartDetailManager',
  function($state, $scope, xiaomaiService, cartManager, cartDetailManager) {

    cartManager.query(function(res) {
      $scope.totalCount = res.totalCount;
      $scope.totalPrice = res.totalPrice;
    });

    //打开详情页面
    $scope.gotoDetail = function() {
      if (!$scope.totalCount || $scope.totalCount == 0) {
        return false;
      }
      cartDetailManager.gotoDetail();
    }

  }
])

//购物车详情页面
angular.module('xiaomaiApp').controller('buy.cartDetailCtrl', [
  '$state',
  '$scope',
  'xiaomaiService',
  'cartDetailManager',
  'cartDetailGuiMananger',
  'shopValidate',
  'cartManager',
  function($state, $scope, xiaomaiService, cartDetailManager,
    cartDetailGuiMananger, shopValidate, cartManager) {
    cartDetailManager.invokeDetail(function() {
      loadDetail().then(function(res) {
        $scope.goods = res['goods'];
        return loadCouponCount();
      }).then(function(coupons) {
        $scope.coupons = coupons.couponInfo;
        console.log(coupons)
        return true;
      }).then(function() {
        cartDetailGuiMananger.pub('show');
      })
    });

    //继续购物
    $scope.continueShop = function() {
      cartDetailGuiMananger.pub('hide');
    }


    var loadDetail = function() {
      return xiaomaiService.fetchOne('queryCartDetail', {});
    };


    //获取用户优惠劵数量
    var loadCouponCount = function() {
      return xiaomaiService.fetchOne('mycoupon', {
        openId: ''
      });
    };

    //添加或者删除
    $scope.buyHandler = function(type, $index) {


      var validlist = {},
        good = $scope.goods[$index];

      if (type == 'minus') {
        validlist['minCountVali'] = [good.skuList[0].numInCart];
      } else if (type == 'plus') {
        validlist['maxCountVali'] = [good.skuList[0].numInCart, good.maxNum];
      }

      //进行校验
      if (!shopValidate(validlist)) {
        return false;
      }


      var eventName = type == 'plus' ? 'add' : 'remove';
      cartManager[eventName]({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice,
        propertyIds: ''
      }).then(function() {
        good.skuList[0]['numInCart'] += type == 'plus' ? (+1) : (-1);
        //如果这个数据的numInCart==0 删除这条数据
        if (good.skuList[0]['numInCart'] == 0) {
          $scope.goods.splice($index, 1);
        }
      });

    };

  }
]);
