$(document).ready(function() {

    $('input[name="email"]').keypress(function(event) {
        email = $('input[name="email"]').val().toLowerCase();
        regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (email.match(regEx)) {
            x = true;
            document.querySelector('input[name="email"]').parentNode.classList.remove("error");
        } else {
            x = false;
        }
        keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            /**
             * Makes a request to ltv API to search an specific email address.
             * If there's a response, it gets stored in the local storage and redirects to results page
             */
            event.preventDefault();
            localStorage.clear(); //Clears storage for next request

            var x, y;


            if (x === true) {
                networkCheck() // check network
                showLoader(); //show loader
                apiCall(); //call api

            } else if (x !== true) {
                document.querySelector('input[name="email"]').parentNode.classList.add("error");
            }
        }
    });

    $('input[name="phone"]').keypress(function(event) {
        /* restrict special char */
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }

        /* mask phone no */
        var x = event.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{3})/);
        if (x != null) {
            event.target.value = '(' + x[1] + ') ' + x[2] + '-' + x[3];
        }

        phone = $('input[name="phone"]').val();
        if (phone != null && phone != "") {
            phone = phone.match(/\d/g, "");
            if (phone == null) {
                document.querySelector('input[name="phone"]').parentNode.classList.add("error");
                return false;
            }
            phone = phone.join().replace(/,/g, "");
        }
        regEx = /^\d{10}$/;
        if (phone.match(regEx)) {
            x = true;
            document.querySelector('input[name="phone"]').parentNode.classList.remove("error");
        } else {
            x = false;
        }
        keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {

            event.preventDefault();
            localStorage.clear(); //Clears storage for next request

            var x, y;


            if (x === true) {
                networkCheck() // check network
                showLoader(); //show loader
                apiCall(); //call api

            } else if (x !== true) {
                document.querySelector('input[name="phone"]').parentNode.classList.add("error");
            }
        }
    });


    /* on tab change clear input val and error */
    $(".nav-link").on("click", function() {
        $("form .input-group").removeClass("error");
        $('input').val("");
    })


});

/* show loader */
function showLoader() {
    $(".loader-container").show();
    $(".above-the-fold").hide();
    $(".features").hide();
    $(".result").hide();
    $(".search-again").hide();
}

/* submit form */
function sumbitForm(type, e) {
    var x, y, regEx;
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request

    if (type == 'email') {
        var email = $('input[name="email"]').val().toLowerCase();
        regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (email.match(regEx)) {
            x = true;
            document.querySelector('input[name="email"]').parentNode.classList.remove("error");
        } else {
            x = false;
        }
    } else {
        phone = $('input[name="phone"]').val();
        if (phone != null && phone != "") {
            phone = phone.match(/\d/g, "");
            if (phone == null) {
                document.querySelector('input[name="phone"]').parentNode.classList.add("error");
                return false;
            }
            phone = phone.join().replace(/,/g, "");
        }
        regEx = /^\d{10}$/;
        if (phone.match(regEx)) {
            x = true;
            document.querySelector('input[name="email"]').parentNode.classList.remove("error");
        } else {
            x = false;
        }
    }

    if (x === true) {
        networkCheck() //check network connction
        showLoader(); //show loader

        if (type == "email") {
            document.querySelector('input[name="email"]').parentNode.classList.remove("error");
            apiCall(email); //call api
        } else {
            document.querySelector('input[name="phone"]').parentNode.classList.remove("error");
            apiCall(phone); //call api
        }

    } else if (x !== true) {
        if (type == "email") {
            document.querySelector('input[name="email"]').parentNode.classList.add("error");
        } else {
            document.querySelector('input[name="phone"]').parentNode.classList.add("error");
        }
    }
}

/* check network connection */
function networkCheck() {
    if (navigator.onLine == false) {
        alert("Please check your internet connection");
        return false;
    }
}

/* call api */
function apiCall(type) {
    const proxyurl = "";
    var url = "";
    if (type == "email") {
        url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=' + email;
    } else {
        url = 'https://ltv-data-api.herokuapp.com/api/v1/records.json?phone=' + phone;
    }

    fetch(proxyurl + url)
        .then((response) => response.text())
        .then(function(contents) {
            console.log("contents :: " + contents);
            localStorage.setItem("userObject", contents);
            window.location.href = "result.html";
        })
        .catch((e) => console.log(e));
}