(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', '$location', 'Authentication', '$filter', 'UserFactory'];

  function HomeController($scope, $state, $location, Authentication,$filter, UserFactory) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    console.log('HomeController was triggered');

    vm.getStarted = function() {
      $location.path('/authentication/signup');
    }

    UserFactory.query(function (data) {
      vm.users = data;
      vm.buildPager();
      console.log(vm.users);
    });



    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
