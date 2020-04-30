// UI Controller
const UIController = (function() {
    const UISelectors = {
        honeydp: '.honeydp',
        px1: '.px1',
        px2: '.px2',
        successinstructions: '.successinstructions',
        successnotif: '.successnotif',
        sentaction: '.sentaction',
        successnotif2: '.successnotif2',
        successmobile: '.successmobile',
        update1: '.update1',
        update2: '.update2',
        pp: '.pp',
        dp: '.dp',
        ct: '.ct',
        fare: '.fare',
        pickup: '#pickup',
        booktruck: '.booktruck',
        confirmorder: '.confirmorder',
        cancelorder: '.cancelorder',
        sideawrapper: '.sideawrapper',
        pickup: '#pickup',
        dropoff: '#dropoff',
        custnum: '#custnum',
        mapdiv: '#mapdiv',
        booknavul: '#booknav ul',
        booknavli: '#booknav li',
        map_canvas: '#map_canvas',
        truckdata: '#truckdata'
    };

    const state = {
        pick: '',
        drop: '',
        thecartype: '',
        directionsService: '',
        directionsRenderer: '',
        pickpoint: '',
        geo1: '',
        geo2: '',
        droppoint: '',
        googledist: 0,
        esttime: '',
        marker1: '',
        marker2: '',
        map: '',
        price1: 0,
        price2: 0,
        trackchosen = false,
        booking: false
    };

    return {
        initVariables: function() {
            getElement('px1').innerHTML = 0;
            getElement('px2').innerHTML = 0;
            hideElement('mapdiv', 'showmap');
            jQuery(UISelectors['booknavul']).find("*").removeClass("selected");

        },
        getState: function() {
            return state;
        },
        setState: function(attr) {
            Object.keys(attr).forEach(key => {
                state[key] = attr[key];
            })

        },
        getElement: function(element) {
            return document.querySelector(UISelectors[element]);
        },
        getSelectors: function() {
            return UISelectors;
        },
        getInput: function() {
            return {
                pickup: getElement('pickup').value,
                dropoff: getElement('dropoff').value,
                custnum: getElement('custnum').value,
                truckdata: getElement('truckdata').value
            }
        },
        showElement: function(element, selector) {
            jQuery(UISelectors[element]).addClass(selector);
        },
        hideElement: function(element, selector = 'isvisible') {
            jQuery(UISelectors[element]).removeClass(selector);
        },
        alerts: function(action, message, color) {
            if (action == 'error') {
                getElement('successnotif').textContent = message;
                jQuery(UISelectors.successnotif).css('background-color', color).addClass('isvisible');
                setTimeout(() => {
                    hideElement('successnotif');
                }, 2000);

            } else {
                getElement('sentaction').textContent = message;
                showElement('successnotif2', 'isvisible');
                setTimeout(() => {
                    hideElement('successnotif2');
                }, 2000);

            }

        },
        FlushuP: function() {
            getInput().pickup.value = '';
            getInput().dropoff.value = '';
            getInput().custnum.value = '';
            initVariables();
            MapController.createMap();
            return false;
        },
        MiniFlushuP = function() {
            getInput().dropoff.value = '';
            getInput().custnum.value = '';
            initVariables();
            MapController.createMap();
            hideElement('successinstructions');
            return false;
        },
        updateTextContent: function(element, text) {
            getElement(element).textContent = text;
        }

    }

})();