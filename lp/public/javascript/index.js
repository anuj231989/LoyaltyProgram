var app = angular.module("loyalty", ["ngRoute"]);
app.service('userDetails', function() {

    return {
        setFirstName: function(fname) {
            this.firstName = fname;
        },
        setId : function (id){
            this._id = id;
        },
        getFirstName: function(){
            return this.firstName;
        },
        getId :function(){
            return this._id;
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
    })
    .when("/getTransactionDetails", {
        templateUrl : "transactionhistory.html"
    });

});

app.controller('dashboard', function($scope, $http, userDetails, $location){
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
                    //console.log("Response in $scope.vouchers ", $scope.vouchers[0] );
                    //$scope.vouchers.push(response.data);

                }),
            function(response){
                console.log("Dashboard loading failed");
            }
    }

    $scope.getTransactionDetails = function () {
        console.log("*************In transaction method client side *****************")
        var userid = userDetails.getId();
        console.log("User Id client side is ",userid);
        var url="/getTransactionDetails/"+userid;
        console.log("url is",url);
        $scope.orders = [];

        $http.get(url)
            .then(
                function(response){
                    console.log("Response in client side", response.data.orders);
                    $scope.orders = response.data.orders;
                    $location.path("/getTransactionDetails");
                    //console.log("Response in $scope.orders ", $scope.orders[0] );
                    //$scope.vouchers.push(response.data);
                }),
            function(response){
                console.log("Dashboard loading failed");
            }
    }
});

/*app.controller('transaction', function($scope, $http, userDetails){
    console.log("get first name");
    console.log(userDetails.getFirstName());
    $scope.firstName = userDetails.getFirstName();

    $scope.getTransactionDetails = function () {
        console.log("*************In client side *****************")
        var url="/getTransactionDetails/"
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
});*/






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
                userDetails.setId(response.data._id);
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

