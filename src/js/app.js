var app = angular.module('app', [
  /* 
    enable these as you need them
  */
  // 'ui.bootstrap.accordion',
  // 'ui.bootstrap.bindHtml',
  // 'ui.bootstrap.buttons',
  // 'ui.bootstrap.carousel',
  // 'ui.bootstrap.collapse',
  // 'ui.bootstrap.datepicker',
  // 'ui.bootstrap.dropdownToggle',
  // 'ui.bootstrap.modal',
  // 'ui.bootstrap.pagination',
  // 'ui.bootstrap.popover',
  // 'ui.bootstrap.position',
  // 'ui.bootstrap.progressbar',
  // 'ui.bootstrap.rating',
  // 'ui.bootstrap.tabs',
  // 'ui.bootstrap.timepicker',
  // 'ui.bootstrap.tooltip',
  // 'ui.bootstrap.transition',
  // 'ui.bootstrap.typeahead'
])
.constant('chunkSize', 4)
.constant('apiRoot', '_rewrite/api')
.constant('imgRoot', '_rewrite/img')
// set some top-level scope thingaroos
.run([
  '$rootScope', 
  function ($rootScope) {
    $rootScope.title = "eggchair";
    $rootScope.name = "Max Thayer";
  }
])
// MAIN CONTROLLER :O
.controller('ImgCtrl', [
  '$scope', 'getImages', 'groupChunk', 'imgRoot',
  function ($scope, getImages, groupChunk, imgRoot) {
    getImages()
    .success(function (res) {
      var images = res.rows.map(function (image) {
        image.url = image.src = [imgRoot, image.id].join('/');
        return image;
      });
      
      var groupchunked = groupChunk(function (image) {
        var date = new Date(image.key);
        return new Date(date.getFullYear(), date.getMonth()).getTime();
      }, images);

      $scope.groups = groupchunked;
    })
    .error(function (err) {
      throw err;
    });
  }
])
.factory('getImages', ['$http', 'apiRoot', function ($http, apiRoot){
  return function (){
    return $http({
      url: ['_view', 'images'].join('/'),
      method: 'GET',
      params: {
        descending: true
      }
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
// group by the value returned by the `getter` function
.factory('group', function(){
  return function(getter, items){
    var groups = {};
    var groups_sorted = [];

    // group by given field
    items.forEach(function (item) {
      var val = getter(item);
      if (!groups[val]) {
        groups[val] = [item];
      } else {
        groups[val].push(item); 
      }
    });

    // convert to array
    Object.keys(groups).forEach(function (key) {
      groups_sorted.push(groups[key]);
    });

    // sort, return
    return groups_sorted.sort(function (a, b) {
      return getter(b[0]) - getter(a[0]);
    });
  };
})
// chunk and group items using the given `field`
.factory('groupChunk', ['chunk', 'group', function(chunk, group){
  return function(getter, items){
    return group(getter, items).map(function(page){
      return chunk(page);
    });
  };
}]);