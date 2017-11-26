var app = angular.module("loyalty", ["ngRoute"]);
app.service('userDetails', function() {

    return {
        setFirstName: function(fname) {
            this.firstName = fname;
        },
        getFirstName: function(){
            return this.firstName;
        }
    };
  
  });

app.service('voucherDetails', function() {

    return {
        setVoucherName: function(voucherName) {
            this.voucherName = voucherName;
        },
        getVoucherName: function(){
            return this.voucherName;
        }
    };

});
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/signup", {
        templateUrl : "signup.html"
    })
    .when("/dashboard", {
        templateUrl : "dashboard.html"
    })
    .when("/admin", {
        templateUrl : "admin.html"
    });

});

app.controller('dashboard', function($scope, $http, userDetails){
    console.log("get first name");
    console.log(userDetails.getFirstName());
    $scope.firstName = userDetails.getFirstName();

    $scope.getVoucherDetails = function () {
        console.log("*************In client side *****************")
        var url="/getVoucherDetails"
        $scope.vouchers = [];

        $http.get(url)
            .then(
                function(response){
                    console.log("Response in client side", response.data.vouchers);
                    $scope.vouchers = response.data.vouchers;
                    console.log("Response in $scope.vouchers ", $scope.vouchers[0] );
                    //$scope.vouchers.push(response.data);

                }),
            function(response){
                console.log("Dashboard loading failed");
            }
    }
});

app.controller('signup', function($scope, $http, $location, userDetails) {
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.userName = "";
    $scope.password = "";
    $scope.passwordConfirm = "";
    $scope.email = "";
    $scope.phone = "";

	$scope.submitData = function(){
		console.log($scope.firstName, $scope.lastName, $scope.userName, $scope.password, $scope.email, $scope.phone);
		var url="/userSignup"
		var data = {
			"firstName" : $scope.firstName,
			"lastName" : $scope.lastName,
			"userName" : $scope.userName,
			"password" : $scope.password,
			"email" : $scope.email,
			"phone" : $scope.phone,
		};
                $http.post(url, data)
                   .then(
                       function(response){
                         // success callback
                           $location.path("/login");
			console.log("saved");
                       }, 
                       function(response){
                         // failure callback
			console.log("failed");
                       }
                    );
}
    
    $scope.login = function(){
        var url="/login"
		var data = {
			"userName" : $scope.userName,
			"password" : $scope.password
		};
        $http.post(url, data)
        .then(
            function(response){
                console.log("logged in");
                //$scope.data = response.data;
                userDetails.setFirstName(response.data.fname);
                $location.path("/dashboard");
            }), 
            function(response){
                console.log("log in failure");
            }
    }

});

app.controller('admin', function($scope, $http, $location, userDetails) {
        $scope.voucherName = "";
        $scope.points = "";
        $scope.value = "";
        $scope.voucherCode = "";
    
        $scope.addItemData = function(){
            console.log($scope.voucherName, $scope.points, $scope.value, $scope.voucherCode);
            var url="/addItem"
            var data = {
                "voucherName" : $scope.voucherName,
                "points" : $scope.points,
                "value" : $scope.value,
                "voucherCode" : $scope.voucherCode
            };
                    $http.post(url, data)
                       .then(
                           function(response){
                             // success callback
                             console.log("Data saved");
                           }, 
                           function(response){
                             // failure callback
                             console.log("failed");
                           }
                       );
        }
});

