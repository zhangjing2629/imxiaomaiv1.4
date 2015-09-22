angular.module('xiaomaiApp').controller('nav.recommendCtrl', [
  '$scope',
  '$state',
  'xiaomaiService',
  'schoolManager',
  'detailManager',
  'shopValidate',
  'cartManager',
  function($scope, $state, xiaomaiService, schoolManager, detailManager,
    shopValidate, cartManager) {
    var collegeId;
    schoolManager.get().then(function(schoolInfo) {
      collegeId = schoolInfo.collegeId;
      return xiaomaiService.fetchOne('categoryGoods', {
        collegeId: collegeId
      });
    }).then(function(res) {
      $scope.categorys = res;
    });

    //更多跳转
    $scope.gotocategory = function(item) {
      $state.go('root.buy.nav.category', {
        collegeId: collegeId,
        categoryId: item.category.categoryId
      })
    };

    //打开详情页面
    $scope.gotoDetail = function(good) {

      $state.go($state.current.name, {
        showDetail: true
      });
      detailManager.gotoDetail({
        goodId: good.bgGoodsId,
        sourceType: good.sourceType
      });
    };

    //购买按钮点击处理
    //如果是聚合类产品 打开购买链接
    //如果是非聚合类产品 执行购买流程
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

      //执行购买
      cartManager.add({
        goodsId: good.bgGoodsId,
        sourceType: good.sourceType,
        skuId: good.skuList[0].skuId,
        price: good.skuList[0].wapPrice
      });
    }

  }
])
