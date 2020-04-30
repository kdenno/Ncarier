const MapController = (function() {
    var iconBase = 'https://ncarrierug.com/wp-content/themes/twentytwenty/img/';

    return {

        initAutocomplete: function() {
            directionsService = new google.maps.DirectionsService();

            autocomplete = new google.maps.places.Autocomplete(
                UIController.getElement("pickup"), {
                    componentRestrictions: {
                        country: "ug"
                    }
                }
            );
            dropoff = new google.maps.places.Autocomplete(
                UIController.getElement("dropoff"), {
                    componentRestrictions: {
                        country: "ug"
                    }
                }
            );
            autocomplete.addListener("place_changed", fillInAddress);
            dropoff.addListener("place_changed", dropOffAddress);
            this.createMap();
        },

        createMap: function() {
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
            mapEl = UIController.getElement("map_canvas");
            mapEl.innerHTML = ' ';
            var map = new google.maps.Map(
                mapEl,
                mapOptions
            );
            var rendererOptions = {
                map: map,
                suppressMarkers: true
            }
            directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
            directionsRenderer.setMap(map);
            UIController.setState({ 'map': map });
            return true;
        },

        fillInAddress: function() {
            UIController.MiniFlushuP();
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                UIController.alerts("error", "No details available for input: '" + place.name + "'", 'red');
                return;
            }

            if (place.geometry) {
                var val = place.place_id;
                UIController.setState({ 'pickpoint': place.name });
                UIController.setState({ 'pick': place.name });
                UIController.setState({ 'geo1': place.geometry.location });
            }
        },

        dropOffAddress: function() {

            if (pickpoint == undefined) {
                // flush boxes
                UIController.FlushuP();
                UIController.alerts('error', 'Please set pick up point first', 'red');
                exit();

            }
            // Get the place details from the autocomplete object.
            var place = dropoff.getPlace();

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                UIController.alerts('error', "No details available for input: '" + place.name + "'", 'red');
                return;
            }

            if (place.geometry) {
                var val = place.place_id;
                UIController.setState({ 'droppoint': place.name });
                UIController.setState({ 'drop': place.name });
                UIController.setState({ 'geo2': place.geometry.location });
                this.getDistance();
                UIController.getElement("mapdiv").classList.add("showmap");
            }
        },

        getDistance: function() {
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
                    this.createMap();

                    var str = result.routes[0].legs[0]["distance"].text;
                    UIController.setState({ 'googledist': Math.ceil(Number(str.substr(0, str.indexOf(" ")))) });
                    UIController.setState({ 'esttime': result.routes[0].legs[0]["duration"].text });
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
                    var marker1 = new google.maps.Marker({
                        position: result.routes[0].legs[0]['start_location'],
                        icon: icon1,
                        animation: google.maps.Animation.DROP,

                    });
                    var marker2 = new google.maps.Marker({
                        position: steps[steps.length - 1].end_location,
                        animation: google.maps.Animation.DROP,
                        icon: icon2

                    });
                    var currentState = UIController.getState();
                    marker2.setMap(null);
                    marker1.setMap(currentState.map);
                    marker2.setMap(currentState.map);
                    currentState.geo2 = null;
                    marker2 = null;
                }
            });
        }
    }


})();