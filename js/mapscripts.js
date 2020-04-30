// maps
var pickpoint,
    droppoint,
    pick,
    drop,
    directionsService,
    directionsRenderer,
    carcapacity,
    totalfuel,
    theitems,
    price1,
    esttime,
    thecartype,
    geo1,
    geo2,
    marker1,
    marker2,
    map,
    customernum,
    thelength,
    price2;
var price1 = 0;
var booking = false;
var percentcharge = [0.15, 0.3];
var googledist = 0;
var px1 = document.querySelector(".px1");
var px2 = document.querySelector(".px2");
var honeydp = jQuery(".honeydp").val();
var iconBase = 'https://ncarrierug.com/wp-content/themes/twentytwenty/img/';
var trackchosen = false;
jQuery('.successinstructions').addClass('isvisible');

function alerts(action, message, color) {
    if (action == 'error') {
        jQuery('.successnotif').text(message);
        jQuery('.successnotif').css('background-color', color).addClass('isvisible');
        setTimeout(() => {
            jQuery('.successnotif').removeClass('isvisible');
        }, 2000);

    } else {
        jQuery('.sentaction').text(message);
        jQuery('.successnotif2').addClass('isvisible');
        setTimeout(() => {
            jQuery('.successnotif2').removeClass('isvisible');
        }, 2000);

    }


}

function Booking(theviewport, update1, update2) {
    jQuery('.update1').text(update1);
    jQuery('.update2').text(update2);
    jQuery('.pp').text(pick);
    jQuery('.dp').text(drop);
    jQuery('.ct').text(thecartype);
    jQuery('.fare').text(`UGX ${Math.ceil(price1)} - ${Math.ceil(price2)}`);
    if (theviewport == 'desktop') {
        jQuery('.successinstructions').addClass('isvisible');

    } else {
        jQuery('.successmobile').addClass('isvisible');
    }

}

jQuery('.cancelorder').on('click', () => {
    jQuery('.successinstructions').removeClass('isvisible');
    jQuery('.successmobile').removeClass('isvisible');
    FlushuP();
});
jQuery('#pickup').focus(() => {
    jQuery('.successinstructions').removeClass('isvisible');
});

function initAutocomplete() {
    directionsService = new google.maps.DirectionsService();

    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("pickup"), {
            componentRestrictions: {
                country: "ug"
            }
        }
    );
    dropoff = new google.maps.places.Autocomplete(
        document.getElementById("dropoff"), {
            componentRestrictions: {
                country: "ug"
            }
        }
    );
    autocomplete.addListener("place_changed", fillInAddress);
    dropoff.addListener("place_changed", dropOffAddress);
    createMap();


}

function createMap() {
    var kampala = new google.maps.LatLng(0.347596, 32.58252);
    var mapOptions = {
        zoom: 7,
        center: kampala,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: false
    };
    mapEl = document.getElementById("map_canvas");
    mapEl.innerHTML = ' ';
    map = new google.maps.Map(
        mapEl,
        mapOptions
    );
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    }
    directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    directionsRenderer.setMap(map);
    return true;
}

function fillInAddress() {
    MiniFlushuP();
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alerts("error", "No details available for input: '" + place.name + "'", 'red');
        return;
    }

    if (place.geometry) {
        var val = place.place_id;
        pickpoint = place.name;
        pick = place.name;
        geo1 = place.geometry.location;

        // document.getElementById('venuid').value = '';
        // document.getElementById('venuid').disabled = false;
        // document.getElementById('venuname').value = '';
        // document.getElementById('venuname').disabled = false;
        // document.getElementById('venuid').value = val;
        // document.getElementById('venuname').value = placename;
    }
}

function dropOffAddress() {

    if (pickpoint == undefined) {
        // flush boxes
        FlushuP();
        alerts('error', 'Please set pick up point first', 'red');
        exit();

    }
    // Get the place details from the autocomplete object.
    var place = dropoff.getPlace();

    if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alerts('error', "No details available for input: '" + place.name + "'", 'red');
        return;
    }

    if (place.geometry) {
        var val = place.place_id;
        droppoint = place.name;
        drop = place.name;
        geo2 = place.geometry.location;

        // document.getElementById('venuid').value = '';
        // document.getElementById('venuid').disabled = false;
        // document.getElementById('venuname').value = '';
        // document.getElementById('venuname').disabled = false;
        // document.getElementById('venuid').value = val;
        // document.getElementById('venuname').value = placename;


        getDistance(geo1, geo2);
        document.querySelector("#mapdiv").classList.add("showmap");
    }
}

function baseFare(cartype) {
    var thecar = JSON.parse(jQuery("#truckdata").val());
    return thecar[cartype];
}
jQuery("#booknav li").on("click", function(e) {
    if (googledist > 0) {
        var $this = jQuery(this);
        $this
            .closest("ul")
            .find("div")
            .removeClass("selected");
        theitems = $this.find("div");
        theitems[0].classList.add("selected");
        theitems[3].classList.add("selected");
        thecartype = theitems[0].dataset.cartype;

        carcapacity = baseFare(thecartype);
        totalfuel = carcapacity["fuelpermile"] * googledist;
        price1 = carcapacity["bfare"] + totalfuel + totalfuel * percentcharge[0];
        price2 = carcapacity["bfare"] + totalfuel + totalfuel * percentcharge[1];
        px1.innerHTML = nFormatter(price1);
        px2.innerHTML = nFormatter(price2);
        trackchosen = true;

    }

});

function nFormatter(num, digits) {
    const si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function getDistance(geo1, geo2) {
    var request = {
        origin: pickpoint,
        destination: droppoint,
        travelMode: "DRIVING",
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: "pessimistic"
        },
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    directionsService.route(request, function(result, status) {
        if (status == "OK") {
            createMap();

            var str = result.routes[0].legs[0]["distance"].text;
            googledist = Math.ceil(Number(str.substr(0, str.indexOf(" "))));
            esttime = result.routes[0].legs[0]["duration"].text;
            directionsRenderer.setDirections(result);


            // set markers
            var icon1 = {
                url: iconBase + 'startmark.svg',
                scaledSize: new google.maps.Size(35, 35), // scaled size
                //origin: new google.maps.Point(0,1), // origin
                //anchor: new google.maps.Point(0, 0) // anchor
            };
            var icon2 = {
                url: iconBase + 'endmark.svg',
                scaledSize: new google.maps.Size(35, 35), // scaled size
                // origin: new google.maps.Point(0,1), // origin
                //anchor: new google.maps.Point(0, 0) // anchor
            };
            var steps = result.routes[0].legs[0].steps;
            geo1 = steps[0].end_location;
            geo2 = steps[steps.length - 1].end_location;
            marker1 = new google.maps.Marker({
                position: result.routes[0].legs[0]['start_location'],
                icon: icon1,
                animation: google.maps.Animation.DROP,

            });
            marker2 = new google.maps.Marker({
                position: geo2,
                animation: google.maps.Animation.DROP,
                icon: icon2

            });
            marker2.setMap(null);
            marker1.setMap(map);
            marker2.setMap(map);
            geo2 = null;
            marker2 = null;
        }
    });
}


jQuery(".booktruck").on("click", function() {
    jQuery('.confirmorder').html("Confirm");
    jQuery('.cancelorder').html("Cancel");

    if (!trackchosen) {
        alerts('error', 'Please choose truck', 'red');
        exit();
    }
    if (pickpoint == "") {
        alerts('error', 'Uknown pickup point', 'red');
        exit();
    }
    if (droppoint == "") {
        alerts('error', 'Unknown drop-off point', 'red');
        exit();
    }
    customernum = jQuery("#custnum").val();
    thelength = customernum.length;
    if (customernum == '' || (thelength !== 10)) {
        alerts('error', 'Please provide phone number', 'red');
        exit();
    }

    if (jQuery('.sideawrapper').is(":visible")) {
        Booking('desktop', 'Confirm:', 'Click Confirm Button to Confirm Booking.');
    } else {
        Booking('mobile', 'Confirm:', 'Click Confirm Button to Confirm Booking.');
    }


});

jQuery('.confirmorder').on('click', function() {
    var self = jQuery(this);
    if (pickpoint == null) {
        return;
    }
    if (!booking) {
        booking = true;
        jQuery.ajax({
            url: nmailAjax.ajaxurl,
            type: "POST",
            data: {
                pickup: pickpoint,
                dropoff: droppoint,
                pnum: customernum,
                cartype: thecartype,
                distance: googledist,
                prix1: price1,
                prix2: price2,
                thetime: esttime,
                honeydp: honeydp,
                action: "new_norder",
                security: nmailAjax.security
            },
            beforeSend: function() {
                self.html("Ordering...");
            },
            success: function(response) {
                $data = jQuery(response);
                FlushuP();
                if (jQuery('.sideawrapper').is(":visible")) {
                    Booking('desktop', 'Carrier Booked:', 'Your request has been received. A member of our team will get in touch with you shortly.');
                } else {
                    Booking('mobile', 'Carrier Booked:', 'Your request has been received. A member of our team will get in touch with you shortly.');
                }
                self.html("Truck Ordered");
                jQuery('.cancelorder').html("Close");

            },
            error: function(response) {
                FlushuP();
                alerts('error', 'Failed to Send Request', 'red');

            }
        });
    }

});

function FlushuP() {
    jQuery("#pickup").val("");
    jQuery("#dropoff").val("");
    jQuery("#custnum").val("");
    pickpoint = undefined;
    droppoint = undefined;
    px1.innerHTML = 0;
    px2.innerHTML = 0;
    googledist = 0;
    geo1 = '';
    geo2 = '';
    booking = false;
    trackchosen = false;
    createMap();
    document.querySelector("#mapdiv").classList.remove("showmap");
    jQuery("#booknav ul")
        .find("*")
        .removeClass("selected");

    return false;
}

function MiniFlushuP() {
    jQuery("#dropoff").val("");
    jQuery("#custnum").val("");
    droppoint = undefined;
    px1.innerHTML = 0;
    px2.innerHTML = 0;
    googledist = 0;
    geo1 = '';
    geo2 = '';
    booking = false;
    trackchosen = false;
    createMap();
    document.querySelector("#mapdiv").classList.remove("showmap");
    jQuery('.successinstructions').removeClass('isvisible');
    jQuery("#booknav ul")
        .find("*")
        .removeClass("selected");

    return false;
}