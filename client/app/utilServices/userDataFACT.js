angular.module('fiddio')

.factory('UserData',[function(){

  function setItem(key, value){
    if (value === undefined) { this.removeItem(key); }
    else { localStorage.setItem('fidd.io|'+key, JSON.stringify(value)); }
  }

  function getItem(key) {
    var obj = localStorage.getItem('fidd.io|' + key);
    var parsed = obj && JSON.parse(obj) || undefined;
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