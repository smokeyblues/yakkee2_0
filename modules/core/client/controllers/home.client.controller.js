(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', 'Authentication'];

  function HomeController($location, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.getStarted = function() {
      $location.path('/authentication/signup');
    }
  }
}());
