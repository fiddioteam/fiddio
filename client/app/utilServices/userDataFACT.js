angular.module('fiddio')

.factory('UserData',[function(){

  function setItem(key, value){
    localStorage.setItem('fidd.io|'+key, JSON.stringify(value));
    this[key] = value;
  }

  function getItem(key) {
    return this[key] || JSON.parse(localStorage.getItem('fidd.io|' + key));
  }

  function loadData(){
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      if (key.startsWith('fidd.io|')) {
        this[key.substring(8)] = localStorage.getItem(key);
      }
    }
  }

  return {
      setItem: setItem,
      getItem: getItem,
      loadData: loadData
    };
}]);