/**
 *快速排序
 **/
angular.module('xiaomaiApp').factory('xiaomaiQuicksort', [function() {

  var quicksort = function(sortArr) {
    if (sortArr.length <= 1) {
      return sortArr;
    }

    var args = Array.prototype.slice.call(arguments, 0),
      sortArr = args[0],
      arrType = args[1] || 'number', //快排数据类型 可以是number | object;
      sortKey = args[2]; //如果是object类型 需要快排元素的key值

    var middleIndex = Math.ceil(sortArr.length / 2),
      middleNum = arrType == 'number' ? sortArr[middleIndex] : sortArr[
        middleIndex][sortKey],
      smallerArr = [],
      biggerArr = [];

    $.each(sortArr, function(index, item) {
      var num = arrType === 'number' ? item : item[sortKey];
      //跳过自己
      if (index == middleIndex) {
        return true;
      }

      if (num <= middleNum) {
        smallerArr.push(item);
      } else {
        biggerArr.push(item);
      }
    });

    return quicksort(smallerArr).concat([sortArr[middleIndex]]).concat(
      quicksort(
        biggerArr));
  };
  return quicksort;
}]);

/**
 *接口数据缓存 统一管理
 *不需要经常更新数据 可以存放到xiaomaiInterfaceDataCache
 **/
angular.module('xiaomaiApp').factory('xiaomaiCacheManager', [
  'xiaomaiQuicksort',
  function(xiaomaiQuicksort) {
    var caches = [], //缓存容器
      cacheMaxlen = 10, //缓存数据最大长度
      readCache = function(cachename) {

        var $index = hasCache(cachename);
        if ($index === false) {
          return false;
        }

        //刷新缓存最后更新时间
        caches[$index]['timestamp'] = (+new Date);
        return angular.extend({}, caches[$index]['result']);
      },
      hasCache = function(cachename) {
        if (!caches.length) {
          return false;
        }

        var $index = -1;

        angular.forEach(caches, function(item, i) {
          if (item.name === cachename) {
            $index = i;
            return false;
          }
        });

        return $index === -1 ? false : $index;
      },
      writeCache = function(cachename, result) {
        //如果caches长度为0 直接写入
        var sameCacheIndex = hasCache(cachename);
        //如果存在同名缓存
        if (sameCacheIndex !== false) {
          caches[sameCacheIndex] = {
            name: cachename,
            result: result,
            timestamp: +new Date
          };
          //如果缓存长度超出最大限制
        } else if (caches.length == cacheMaxlen) {
          //删除最久的数据缓存
        } else {
          caches.push({
            name: cachename,
            result: result,
            timestamp: +new Date
          })
        }
      };

    return {
      readCache: readCache,
      writeCache: writeCache
    }
  }
]);
