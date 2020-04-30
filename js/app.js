const App = (function(MapController, UIController, $) {
    var percentcharge = [0.15, 0.3];

    const UISelectors = UIController.getSelectors();

    const loadEventListeners = function() {
        $(UISelectors.confirmorder).on('click', createOrder);
        $(UISelectors.booktruck).on('click', doChecks);
        $(UISelectors.booknavli).on('click', calculateFare);
    };


    const baseFare = function(cartype) {
            var thecar = JSON.parse(UIController.getInput().truckdata);
            return thecar[cartype];
        },

        const Booking = function(theviewport, update1, update2) {
            UIController.updateTextContent(update1, update1);
            UIController.updateTextContent(update2, update2);
            UIController.updateTextContent('pp', pick);
            UIController.updateTextContent('dp', drop);
            UIController.updateTextContent('ct', thecartype);
            $('.fare').text(`UGX ${Math.ceil(price1)} - ${Math.ceil(price2)}`);
            if (theviewport == 'desktop') {
                UIController.showElement('successinstructions', 'isvisible');

            } else {
                UIController.showElement('successmobile', 'isvisible');
            }

        };

    const doChecks = function() {
        const { trackchosen, pickpoint, droppoint, } = UIController.getState();

        $(UISelectors.confirmorder).html("Confirm");
        $(UISelectors.cancelorder).html("Cancel");

        if (!trackchosen) {
            UIController.alerts('error', 'Please choose truck', 'red');
            exit();
        }
        if (pickpoint == "") {
            UIController.alerts('error', 'Uknown pickup point', 'red');
            exit();
        }
        if (droppoint == "") {
            UIController.alerts('error', 'Unknown drop-off point', 'red');
            exit();
        }
        var customernum = UIController.getInput().custnum;
        if (customernum == '' || (customernum.length !== 10)) {
            UIController.alerts('error', 'Please provide a valid phone number', 'red');
            exit();
        }

        if ($(UISelectors.sideawrapper).is(":visible")) {
            Booking('desktop', 'Confirm:', 'Click Confirm Button to Confirm Booking.');
        } else {
            Booking('mobile', 'Confirm:', 'Click Confirm Button to Confirm Booking.');
        }
    };

    const calculateFare = function(e) {
        const currentState = UIController.getState();
        if (currentState.googledist > 0) {
            var $this = $(this);
            $this
                .closest("ul")
                .find("div")
                .removeClass("selected");
            theitems = $this.find("div");
            theitems[0].classList.add("selected");
            theitems[3].classList.add("selected");
            thecartype = theitems[0].dataset.cartype;

            var carcapacity = baseFare(thecartype);
            var totalfuel = carcapacity["fuelpermile"] * currentState.googledist;
            var price1 = carcapacity["bfare"] + totalfuel + totalfuel * percentcharge[0];
            var price2 = carcapacity["bfare"] + totalfuel + totalfuel * percentcharge[1];
            UIController.setState({ 'price1': price1 });
            UIController.setState({ 'price2': price2 });
            UIController.updateTextContent('px1', nFormatter(price1))
            UIController.updateTextContent('px2', nFormatter(price2))
            UIController.setState({ 'trackchosen': true });

        }

    };

    const createOrder = function() {
        const {
            pickpoint,
            booking,
            droppoint,
            customernum,
            thecartype,
            googledist,
            price1,
            price2,
            esttime
        } = UIController.getState();

        var self = $(this);
        if (pickpoint == null) {
            return;
        }
        if (!booking) {
            UIController.setState({ 'booking': true });
            $.ajax({
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
                    $data = $(response);
                    UIController.FlushuP();
                    if ($(UISelectors.sideawrapper).is(":visible")) {
                        Booking('desktop', 'Carrier Booked:', 'Your request has been received. A member of our team will get in touch with you shortly.');
                    } else {
                        Booking('mobile', 'Carrier Booked:', 'Your request has been received. A member of our team will get in touch with you shortly.');
                    }
                    self.html("Truck Ordered");
                    $(UISelectors.cancelorder).html("Close");

                },
                error: function(response) {
                    UIController.FlushuP();
                    UIController.alerts('error', 'Failed to Send Request', 'red');

                }
            });
        }
    }
    return {
        init: function() {
            loadEventListeners();
        }
    }

})(MapController, UIController, jQuery);

App.init();