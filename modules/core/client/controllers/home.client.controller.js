(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', '$location', 'Authentication', '$filter', 'UserFactory', 'Socket'];

  function HomeController($scope, $state, $location, Authentication, $filter, UserFactory, Socket) {
    var vm = this;

    // inviteReceived and loader should eventually be moved to their own file with the other socket call system code
    vm.inviteReceived = false;
    vm.loader = false;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    console.log('HomeController was triggered');

    vm.getStarted = function() {
      $location.path('/authentication/signup');
    }

    // videoChat is the function that triggers the socket call system



    // step 2. listen for 'initVideoCall' in config/lib/socket.io.js under the 'connection' listener.
      // 2a. put together a data object that will be able to assemble the socket room that only the receiving user is listening to.
      // 2b. emit an event called 'deliverInvite' into that room that will trigger the invite card to be viewable within the receiving user's view at the level of index.html and pass data about the sender and the receiver

    // step 3. listen for the event in the home controller and offer the option to accept or reject the request for videoChat

    vm.videoChat = function(sender, receiver) {
      console.log('VideoChat button for ' + receiver.displayName + ' was pressed by ' + sender.displayName);
      vm.loader = true;
      var inviteUrl = 'https://meet.jit.si/' + receiver._id + '_' + sender._id;
      // console.log(to);
       var inviteData = {
        sender: sender,
        receiver: receiver,
        link: inviteUrl
      }

      // step 1. emit 'initVideoCall' on the front end and send data objects for both sender and receivers
      Socket.emit('initVideoCall', inviteData);
    }

    // step 3. listen for the event in the home controller and offer the option to accept or reject the request for videoChat
    Socket.on('deliverInvite', function(inviteData) {
      vm.inviteReceived = true;
      vm.invitation = inviteData;
      console.log('deliverInvite has been received on the front end');
    })

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
