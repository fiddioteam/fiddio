angular.module('fiddio')

.factory('UserData',[function(){

  function setItem(key, value){
    localStorage.setItem('fidd.io|'+key, JSON.stringify(value));
  }

  function getItem(key) {
    var obj = localStorage.getItem('fidd.io|' + key);
    var parsed = JSON.parse(obj);
    return parsed;
  }

  function removeItem(key){
    localStorage.removeItem('fidd.io|'+key);
  }

  return {
      setItem: setItem,
      getItem: getItem,
      removeItem: removeItem
    };
}]);