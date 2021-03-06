(function() {
	'use strict';

	angular.module('app', ['ngRoute', 'ngCookies']).config(config).run(run);

	config.$inject = ['$routeProvider', '$locationProvider'];
	function config($routeProvider, $locationProvider) {
		$routeProvider.when('/login', {
			controller : 'LoginController',
			templateUrl : 'login/login-view.html',
			controllerAs : 'vm'
		})

		.when('/home', {
			controller : 'HomeController',
			templateUrl : 'home/home.html',
			controllerAs : 'vm'
		})

		.when('/register', {
			controller : 'RegisterController',
			templateUrl : 'register/registerView.html',
			controllerAs : 'vm'
		})

		.when('/update', {
			controller : 'UpdateController',
			templateUrl : 'update/updateUserView.html',
			controllerAs : 'vm'
		})

		.otherwise({
			redirectTo : '/login'
		});
	}

	run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
	function run($rootScope, $location, $cookies, $http) {
		// keep user logged in after page refresh
		// alert('in inject');
		$rootScope.globals = $cookies.getObject('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic '
					+ $rootScope.globals.currentUser.authdata;
		}

		$rootScope.$on('$locationChangeStart', function(event, next, current) {
			// redirect to login page if not logged in and trying to access a
			// restricted page
			var restrictedPage = $.inArray($location.path(), ['/login',
					'/register']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
		});
	}

})();