// JavaScript source code

//#region Scope angular ===========================================================
//instantiate the app
var app = angular.module('MyApp', []);

// Create services for each Roomtypes and Entries
app.controller("hotelCtrl", function ($scope, $http) {
    const url = "data.json";

    //Get the roomtypes from JSON
    $http.get(url)
        .then(function (response) {
            $scope.rooms = response.data[0].roomtypes;
        }, function (error) {
            console.log(error, "Something went wrong");
        });

    //Get the entries from JSON
    $http.get(url)
        .then(function (response) {
            $scope.entries = response.data[1].entries;

            var prices = [];
            for (var i in $scope.entries) {
                prices.push($scope.entries[i].price);
            }
            $scope.max = Math.max(...prices); // Give the max price to begin with
            $scope.rangemax = $scope.max;


        }, function (error) {
            console.log(error, "Something went wrong");
        });

    $scope.filterPrice = function (obj) {
        return obj.price > 0 && obj.price <= $scope.max;
    };

    //----------------------------
    app.filter('unique', function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };

    });


});


//#endregion

//#region Date Picker functionality ================================================

$(document).ready(function () {


    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    var checkin = $('#dp1').datepicker({
        beforeShowDay: function (date) {

            return date.valueOf() >= now.valueOf();
        },
        autoclose: true

    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout.datepicker("getDate").valueOf() || !checkout.datepicker("getDate").valueOf()) {

            var newDate = new Date(ev.date);
            newDate.setDate(newDate.getDate() + 1);
            checkout.datepicker("update", newDate);

        }
        $('#dp2')[0].focus();
    });


    var checkout = $('#dp2').datepicker({
        beforeShowDay: function (date) {
            if (!checkin.datepicker("getDate").valueOf()) {
                return date.valueOf() >= new Date().valueOf();
            } else {
                return date.valueOf() > checkin.datepicker("getDate").valueOf();
            }
        },
        autoclose: true

    }).on('changeDate', function (ev) { });

});

//#endregion

//#region Map functionality =======================================================
// New map
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(51.508742, -0.12085),
        zoom: 5,
    };
    var map = new google.maps.Map(
        document.getElementById("googleMap"),
        mapProp
    );
}

function initMap() {
    // Map options
    var options = {
        zoom: 3,
        center: { lat: 39.322709, lng: 23.134256 }
    }


    // Array of markers
    var markers = [
        {
            coords: { lat: 39.322709, lng: 23.134256 },
            iconImage: {
                url: 'images/tea-map-pin.png', // url
                scaledSize: new google.maps.Size(50, 50)
            },
            content: "<h3 style='color:blue'>Mountain Pelion Tea, Greece</h3>"
        },
        {
            coords: { lat: 51.536936, lng: -1.022447 },
            iconImage: {
                url: 'images/tea-map-pin.png', // url
                scaledSize: new google.maps.Size(50, 50)
            },
            content: '<h3>Pure London Tea, UK</h3>'
        },
        {
            coords: { lat: 59.957143, lng: 10.574013 },
            iconImage: {
                url: 'images/tea-map-pin.png', // url
                scaledSize: new google.maps.Size(50, 50)
            },
            content: '<h3>Oslo Mist Tea, Norway</h3>'
        }
    ];

    // Loop through markers
    for (var i = 0; i < markers.length; i++) {
        // Add marker
        addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            //icon:props.iconImage
        });

        // Check for customicon
        if (props.iconImage) {
            // Set icon image
            marker.setIcon(props.iconImage);
        }

        // Check content
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    }
}

//#endregion