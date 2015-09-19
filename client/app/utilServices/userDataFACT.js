angular.module('fiddio')

.factory('UserData',[function(){

  function setItem(key, value){
    if (value === undefined) { this.removeItem(key); }
    else { localStorage.setItem('fidd.io|'+key, angular.toJson(value)); }
    if (key === 'authenticated') {
      this.authenticated = value;
    }
  }

  function getItem(key) {
    var obj = localStorage.getItem('fidd.io|' + key);
    var parsed = obj && angular.fromJson(obj) || undefined;
    return parsed;
  }

  function removeItem(key){
    localStorage.removeItem('fidd.io|'+key);
  }

  var authMethods = ['gh', 'mp', 'fb'];

  /**
   * Returns authMethod from localStorage based on stored profile id
   * If not available, will return null
   * @return {string}
   *
   * authMethods = 'gh', 'fb', 'mp'
   * Notes: '!memo[0]' is shorthand for memo.length > 0
   */
  function getProfileId() {
    var userInfo = this.getItem('userInfo');
    for (var i = 0; i < authMethods.length; i++) {
      var id = userInfo[authMethods[i] + '_id'];
      if (id) { return authMethods[i]; }
    }

    return null;
  }

  return {
      setItem: setItem,
      getItem: getItem,
      removeItem: removeItem,
      getProfileId: getProfileId
    };
}]);