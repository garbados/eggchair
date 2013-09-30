angular.module('app', [])
.constant('chunkSize', 4)
.constant('groupSize', 50)
.constant('apiRoot', 'api')
.factory('getImages', ['$http', 'apiRoot', function($http, apiRoot){
  return function(cb){
    $http({
      url: 'images',
      method: 'GET',
      params: {
        descending: true
      }
    })
    .success(function(data){
      var _results = data.rows.map(function(item){
        item.timestamp = item.key;
        item.url = [apiRoot, item.id, "img"].join('/');
        return item;
      });
      cb(null, _results);
    })
    .error(function(data, status){
      cb([data, status]);
    });
  };
}])
// chunk into X equal-ish sized groups
.factory('chunk', ['chunkSize', function(chunkSize){
  return function(items){
    var R = [],
        rem;
    for (var i = 0; i < items.length; i++) {
      rem = i % chunkSize;
      if (R[rem]) {
        R[rem].push(items[i]);
      } else {
        R[rem] = [items[i]];
      }
    }
    return R;
  };
}])
// group into X-sized groups
.factory('group', ['groupSize', function(groupSize){
  return function(items){
    var R = [];
    for (var i = 0; i < items.length; i += groupSize){
      R.push(items.slice(i, i + groupSize));
    }
    return R;
  };
}])
// chunk and group images into proper arrangement
.factory('formatImages', ['chunk', 'group', function(chunk, group){
  return function(items){
    return group(items).map(function(page){
      return chunk(page);
    });
  };
}])
.controller('ImgCtrl', ['$scope', '$location', 'getImages', 'formatImages', function($scope, $location, getImages, formatImages){
  // set current page
  $scope.$watch(function(){
    return parseInt($location.path().slice(1), 10);
  }, function(path){
    $scope.i = path || 0;
  }, true);
  // get images
  getImages(function(err, imgs){
    if (err) throw new Error(err);
    $scope.imgs = formatImages(imgs);
  });
}]);