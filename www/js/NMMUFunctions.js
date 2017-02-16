////Below is classic Jquery doc ready, use JQuery Mobile (JQM) page wide pageinit instead (or per page inits):
////$(document).ready() { 

////});
////Pageinit event will be executed every time page is about be be loaded and shown for the first time. 
////It will not trigger again unless page is manually refreshed or ajax page loading is turned off. 
////In case you want code to execute every time you visit a page it is better to use pagebeforeshow event. pageinit fire BEFORE pagebeforeshow JQM:

////Page events transition order

////First all events can be found here: http://api.jquerymobile.com/category/events/

////    Lets say we have a page A and a page B, this is a unload/load order:

////page B - event pagebeforecreate

////page B - event pagecreate

////page B - event pageinit

////page A - event pagebeforehide

////page B - event pagebeforeshow

////page A - event pageremove

////page A - event pagehide

////page B - event pagebeforeshow

////page B - event pageshow

////Page wide variables:

////Change comment

// PhoneGap is ready
//

function onDeviceReady() {

    // ########################## Login ################################ 


    //Hide the form for checks to happen
    $.mobile.loading('show');

    //NMMU LOGIC: Run the checkPreAuth function to determine whether the user is logged in and that the details are still correct. If so, auto login.
    checkPreAuth();

    $(".LogoutButton").on("click", function () {
        localStorage.clear("username");
        localStorage.clear("password");
        localStorage.clear("isStudent");

    //Show signed in or signe out sections
    //Signed in
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#ListviewSignedOut").css('display', 'none');
        $("#ListviewSignedIn").css('display', 'block');
    }
    else {
        $("#ListviewSignedOut").css('display', 'block');
        $("#ListviewSignedIn").css('display', 'none');
    }

    //NMMU LOGIC: Set the login form's submit to fire the handleLogin function. 
    //$("#loginForm").on("submit", handleLogin);

    
        $.mobile.loading('hide');

    //NMMU LOGIC: Set the login form's submit to fire the handleLogin function. 
     $(document).on('pageinit', '#PageLogin', function () {
            $("#loginForm").on("submit", handleLogin);
        });


    //NMMU LOGIC: Set the  PageLoggedInHome's logout click to clear localStorage. 
     $(document).on('pageinit', '#PageHome', function () {

        $(".LogoutButton").on("click", function () {
            localStorage.clear("username");
            localStorage.clear("password");
            localStorage.clear("isStudent");

            $.mobile.changePage("#PageHome");
            //$.mobile.activePage.trigger("create");
        });
    });

    // Determine whether to show staff or student menu
     $(document).on('pagebeforeshow', '#PageHome', function () {
        //Show student list items
         if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
            $("#ListviewSignedOut").css('display', 'none');
            $("#ListviewSignedIn").css('display', 'block');
        }
        else {
            $("#ListviewSignedOut").css('display', 'block');
            $("#ListviewSignedIn").css('display', 'none');
        }
    });
    // ########################## End Login ############################ 


    // My Journey Page
    //NMMU LOGIC: Need to set the InAppBrowser on the link click. We only need to do that once, so we set the event on pageinit.
    $(document).on('pageinit', '#PageMyJourney', function () {
        $(".MyJourneyLink").on('click', function (event) {
            var ref = window.open('http://myjourney.nmmu.ac.za', '_blank', 'location=yes');
            //ref.addEventListener('loadstart', function () { alert('start: ' + event.url); });
            //ref.addEventListener('loadstop', function () { alert('stop: ' + event.url); });
            //ref.addEventListener('exit', function () { alert(event.type); });
        });
    });

    // About us Page
    //NMMU LOGIC: On the about us page hide the phone number link if it is not a phone.
    $(document).on('pageinit', '#PageAboutUs', function () {
        var IsPhone = $.mobile.media("screen and (min-width: 320px) and (max-device-width : 480px)");
        if (IsPhone) {
            $('.NMMUPhoneNumberTablet').css('display', 'none');
            $('.NMMUPhoneNumber').css('display', 'block');
        }
    });



    //Reverse Geolocate
    function codeLatLng(lat, lon) {

        $.mobile.loading('show');

        var geocoder = new google.maps.Geocoder();

        var input = lat + "," + lon;
        var latlngStr = input.split(',', 2);
        var lat = parseFloat(latlngStr[0]);
        var lng = parseFloat(latlngStr[1]);
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    //$('#DivEmergency').html(results[1].formatted_address);
                    $('#LiWhereAmI').html(results[0].formatted_address);
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });

        $.mobile.loading('hide');
    }

    function locwhereamiError(error) {
        // initialize map with a static predefined latitude, longitude
        //alert('code: ' + error.code + '\n' +
        //              'message: ' + error.message + '\n');
        //initialize('', '');
        switch (error.code) {
            case error.PERMISSION_DENIED: alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE: alert("Location information is unavailable.");
                break;
            case error.TIMEOUT: alert("The request to get user location timed out.");
                break;
            default: alert("An unknown error occurred.");
                break;
        }
    }

    function locwhereamiSuccess(position) {
        codeLatLng(position.coords.latitude, position.coords.longitude);
    }

    // Emergency Page
    $(document).on('pageinit', '#PageEmergency', function () {
        var IsPhone = $.mobile.media("screen and (min-width: 320px) and (max-device-width : 480px)");
        if (IsPhone) {
            $('.NMMUPhoneNumberTablet').css('display', 'none');
            $('.NMMUPhoneNumber').css('display', 'block');
        }
    });

    $(document).on("pagebeforeshow", "#PageEmergency", function () {
        //Get user's location
        navigator.geolocation.getCurrentPosition(locwhereamiSuccess, locwhereamiError);
    });



    //Feedback form
    //NMMU LOGIC: Set the feedback form's submit to fire the handleFeedback function. 
    $(document).on('pageinit', '#PageFeedback', function () {
        //$("#FormFeedback").on("submit", handleFeedback);

        // validate signup form on keyup and submit
        $("#FormFeedback").validate({
        rules: {
                textareaFeedback: "required"
        },
        messages: {
            textareaFeedback: "Please provide your feedback."
        },
        submitHandler: function (form) {
            handleFeedback();
            return false;
        }
    });

    });

    $(document).on('pagebeforeshow', '#PageFeedback', function () {

        //Clear all the inputs.
        $("#FormFeedback").each(function () {
            this.reset();
        });

        GetADDetailsForFeedback(window.localStorage["username"], window.localStorage["password"]);
    });

    //Email Profile Details form
    $(document).on('pageinit', '#PageEmailProfile', function () {

        // validate signup form on keyup and submit
        $("#FormEmailProfile").validate({
            rules: {
                RecipientEmail: "required"
            },
            messages: {
                RecipientEmail: "Please a valid email address."
            },
            submitHandler: function (form) {
                handleSendProfileDetails(window.localStorage["username"]);
                return false;
            }
        });

    });

    $(document).on('pagebeforeshow', '#PageEmailProfile', function () {
        //Clear all the inputs.
        $("#FormEmailProfile").each(function () {
            this.reset();
        });
    });


    //NMMU Profile
    $(document).on('pageinit', '#PageNMMUID', function () {


        $(".SendContactDetailsLink").on('click', function (event) {
            $.mobile.changePage("#PageEmailProfile");
        });

        if (window.localStorage["isStudent"] == "true") {

            //Hide button
            var sendButton = document.getElementById('SendContactDetailsLink');
            sendButton.style.visibility = "hidden";
            sendButton.style.display = "none";

            GetStudentProfile(window.localStorage["username"], window.localStorage["password"]);
        }
        else {
            GetStaffProfile(window.localStorage["username"]);
        }
    });


    //Main page init
    $(document).on('pageinit', function () {

    });

}
//NMMU Written functions:


function init() {
    // Wait for PhoneGap to load
    //

    document.addEventListener("deviceready", onDeviceReady, false);

    //delete init;
}

//show loader
var showLoader = function () {
    $('.spinner').css('display', 'block');
}

//hide loader
var hideLoader = function () {
    $('.spinner').css('display', 'none');
}

function refreshPage() {
    $.mobile.changePage('#PageAdverts', {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}




function handleLogin() {

    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton", form).attr("disabled", "disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    //console.log("click");
    if (u != '' && p != '') {
        $.mobile.loading('show');
        $.ajax({
            type: "POST",
            url: "https://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
            contentType: 'application/json',
            data: '{ username: "' + u + '", password: "' + p + '" }',
            dataType: "json"
        }).done(function (msg) {



            if (msg.d.IsAuthenticated == true) {

                //store
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                window.localStorage["isStudent"] = msg.d.IsStudent;

                //Go to My NMMU menu page
                $.mobile.changePage("#PageHome");
            }
            else {
                //Login fail and local values exist = Password has changed. Clear local values
                if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
                    localStorage.clear("username");
                    localStorage.clear("password");
                    localStorage.clear("isStudent");
                }
                $("#submitButton").removeAttr("disabled");
                $.mobile.changePage("#LoginFailureDialog", { role: "dialog" });
            }

            $.mobile.loading('hide');

        }).fail(function (msg) {
            navigator.notification.alert("An error has occurred.", function () { });
            //alert("fail:" + msg);
        }).always(function () {

        });

    } else {
        //Thanks Igor!
        //navigator.notification.alert("You must enter a username and password", function () { });
        $.mobile.changePage("#FieldsMessageDialog", { role: "dialog" });
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function handleFeedback() {
    var form = $("#FormFeedback");
    //disable the button so we can't resubmit while we wait
    $("#submitFeedback", form).attr("disabled", "disabled");
    var user = $("#NameFeedback", form).val();
    var useremail = $("#EmailFeedback", form).val();
    var feedback = $("#textareaFeedback", form).val();

    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/Feedback.asmx/SendFeedback",
        contentType: 'application/json',
        data: '{ yourName: "' + user + '", yourEmail: "' + useremail + '", feedback: "' + feedback + '" }',
        dataType: "json",
        success: function (result) {
        if (result.d == "Success") {
            //alert("Success");
            $("#submitFeedback").removeAttr("disabled");
            $.mobile.loading('hide');
            $.mobile.changePage("#FeedbackPostSuccess", {
                role: "dialog"
            });
        }
        else {
            //alert("Error");
            $.mobile.changePage("#PageError", { role: "dialog" });
        }
    }

    });
    return false;
}

function handleSendProfileDetails(username) {
    var form = $("#FormEmailProfile");
    //disable the button so we can't resubmit while we wait
    $("#submitContactDetails", form).attr("disabled", "disabled");

    var recipientEmail = $("#RecipientEmail", form).val();

    $.mobile.loading('show');
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/EmailContactDetails.asmx/SendEmailContactDetails",
        contentType: 'application/json',
        data: '{ username: "' + username + '", recipientEmail: "' + recipientEmail + '" }',
        dataType: "json",
        success: function (result) {
            if (result.d == "Success") {
                //alert("Success");
                $("#submitContactDetails").removeAttr("disabled");
                $.mobile.loading('hide');
                $.mobile.changePage("#ContactDetailsSentSuccess", {
                    role: "dialog"
                });
            }
            else {
                //alert("Error");
                $.mobile.changePage("#PageError", { role: "dialog" });
            }
        }

    });
    return false;
}

function checkPreAuth() {
    $.mobile.loading('show');
    var form = $("#loginForm");
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {

        //Don't show the login form as it will be pre-populated
        form.css('display', 'none');

        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
    else {
        //First login or logged out. Clear form.
        $("#loginForm").each(function () {
            this.reset();
        });
        $("#submitButton").removeAttr("disabled");

        form.css('display', 'block');

        //Go to login page
        //$.mobile.changePage("#PageLogin");
    }
    $.mobile.loading('hide');
}


function GetADDetailsForFeedback(username, password) {
    var formFeedback = $("#FormFeedback");
    $.ajax({
        type: "POST",
        url: "https://webservices.nmmu.ac.za/mobileapp/adauthentication.asmx/IsAuthenticated",
        contentType: 'application/json',
        data: '{ username: "' + username + '", password: "' + password + '" }',
        dataType: "json"
    }).done(function (msg) {
        $("#NameFeedback", formFeedback).val(msg.d.FullName);
        $("#EmailFeedback", formFeedback).val(msg.d.Email);

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}



//Stores NMMU ID entries
var NMMUIDEntries = [];

function GetStaffProfile(username) {
    //Store the html in s
    var s = '';
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/NMMUID.asmx/GetNMMUID",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json",
        beforeSend: function () {
            // Here we show the loader
            $.mobile.loading('show');
        },
    }).done(function (msg) {

        ////Clear the array
        //NMMUIDEntries.length = 0;

        $.each(msg.d, function (i, v) {

            entry = {
                assFullName: v.FullName,
                assStaffNumber: v.StaffNumber,
                assEmail: v.Email,
                assTelephone: v.Telephone,
                assOffice: v.Office,
                assJobTitle: v.JobTitle,
                assDepartment: v.Department,
                assManager: v.Manager
            };
            NMMUIDEntries.push(entry);


                s += '<li style="height:100px;">';
                s += '<img class="ADImage" alt="User Image" src="http://webservices.nmmu.ac.za/mobileapp/GetADImage.ashx?u=' + window.localStorage["username"] + '" />'
                s += '<h2>'
                s += v.FullName
                s += '</h2>'
                s += '<p>Staff number: ' + v.StaffNumber + '</p>';
                s += '</li>'
                s += '<li data-role="list-divider">Details:</li>';
                s += '<li>'
                s += '<p><strong>Job title:</strong> ' + v.JobTitle + '</p>';
                s += '<p><strong>Department:</strong> ' + v.Department + '</p>';
                s += '<p><strong>Telephone:</strong> ' + v.Telephone + '</p>';
                s += '<p><strong>Office:</strong> ' + v.Office + '</p>';
                s += '<p><strong>Email:</strong> ' + v.Email + '</p>';
                s += '<p><strong>Manager:</strong> ' + v.Manager + '</p>';
                s += '</li>'

        });

        $("#UlNMMUID").html(s);
        $("#UlNMMUID").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {
        $.mobile.loading('hide');
    });
}

function GetStudentProfile(username) {

    var s = '';
    $.ajax({
        type: "POST",
        url: "http://webservices.nmmu.ac.za/mobileapp/NMMUStudentID.asmx/GetNMMUStudentID",
        contentType: 'application/json',
        data: '{ username: "' + username + '" }',
        dataType: "json"
    }).done(function (msg) {

        $.each(msg.d, function (i, v) {
            s += '<li style="height:100px;">';
            s += '<img  class="ADImage" alt="User Image" src="http://webservices.nmmu.ac.za/mobileapp/GetADImage.ashx?u=' + window.localStorage["username"] + '" />';
            s += '<h2>';
            s += v.Title + ' ' + v.Firstnames + ' ' + v.Surname;
            s += '</h2>';
            s += '<p>Student number: ' + v.StudentNumber + '</p>';
            s += '</li>';
            s += '<li data-role="list-divider">Details:</li>';
            s += '<li>';
            s += '<p><strong>DOB:</strong> ' + v.DOB + '</p>';
            s += '<p><strong>Qualification:</strong> ' + v.Qual_Desc + '</p>';
            s += '<p><strong>Faculty:</strong> ' + v.Faculty_Desc + '</p>';
            s += '<p><strong>Campus:</strong> ' + v.Campus_Desc + '</p>';            
            s += '<p><strong>Academic year:</strong> ' + v.Academicyear + '</p>';
            s += '</li>';
        });

        $("#UlNMMUID").html(s);
        $("#UlNMMUID").listview("refresh");

    }).fail(function (msg) {
        navigator.notification.alert("An error has occurred.", function () { });
        //alert("fail:" + msg);
    }).always(function () {

    });
}

function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    return content_height;
}

function GetPhotoOnDevice() {

}

//############### test zone ####################


//function win(r) {
//    alert("Sent = " + r.bytesSent);
//    //alert(r.response);
//    //alert(JSON.stringify(r));
//}

//function fail(error) {
//    switch (error.code) {
//        case FileTransferError.FILE_NOT_FOUND_ERR:
//            alert("Photo file not found");
//            break;
//        case FileTransferError.INVALID_URL_ERR:
//            alert("Bad Photo URL");
//            break;
//        case FileTransferError.CONNECTION_ERR:
//            alert("Connection error");
//            break;
//    }

//    alert("An error has occurred: Code = " + error.code);
//}


/**
 * Take picture with camera
 */
function takePicture() {
    navigator.camera.getPicture(
        function (uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function (e) {
            console.log("Error getting picture: " + e);
            document.getElementById('camera_status').innerHTML = "Error getting picture.";
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI });
};

/**
 * Select picture from library
 */
function selectPicture() {
    $.mobile.loading('show');

    navigator.camera.getPicture(
        function (uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function (e) {
            //console.log("Error getting picture: " + e);
            //document.getElementById('camera_status').innerHTML = "Error getting picture.";
            var camStatus = document.getElementById('camera_status');
            camStatus.style.visibility = "visible";
            camStatus.style.display = "block";
            camStatus.innerHTML = "Error getting picture."
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY });

    $.mobile.loading('hide');
};

/**
 * Upload current picture
 */
function uploadPicture() {

    $.mobile.loading('show');

    var form = $("#FormPostAdvert");
    //disable the button so we can't resubmit while we wait
    $("#submitAdvert", form).attr("disabled", "disabled");


    var yourUsername = window.localStorage["username"];
    var yourName = $("#YourName", form).val();
    var yourEmail = $("#YourEmail", form).val();
    var yourMobile = $("#YourMobile", form).val();
    var yourSubject = $("#YourSubject", form).val();
    var yourCategory = $("#AdCategory", form).val();
    var yourDescription = $("#textareaDescription", form).val();

    // Get URI of picture to upload
    var img = document.getElementById('camera_image');
    var imageURI = img.src;

    if (!imageURI || (img.style.display == "none")) {
        //document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
        //return;

        $.ajax({
            type: "POST",
            url: "http://webservices.nmmu.ac.za/mobileapp/FileUpload.ashx",
            // DO NOT SET CONTENT TYPE to json
            // contentType: "application/json; charset=utf-8", 
            // DataType needs to stay, otherwise the response object
            // will be treated as a single string
            //data: '{yourName: "' + yourName + '", yourEmail: "' + yourEmail + '", yourMobile: "' + yourMobile + '", yourSubject: "' + yourSubject + '", yourCategory: "' + yourCategory + '", yourDescription: "' + yourDescription + '" }',
            data: { yourUsername: yourUsername, yourName: yourName, yourEmail: yourEmail, yourMobile: yourMobile, yourSubject: yourSubject, yourCategory: yourCategory, yourDescription: yourDescription },
            dataType: "json",
            success: function (result) {
                if (result.message == "Success") {
                    $("#submitAdvert").removeAttr("disabled");
                    $.mobile.loading('hide');
                    $.mobile.changePage("#AdvertPostSuccess", {
                        role: "dialog", reverse: false,
                        changeHash: false
                    });
                }
                else {
                    $.mobile.changePage("#PageError", { role: "dialog" });
                }
            }
        });

        return false;
    }
        //picture to upload
    else {


        var myfileName;
        window.resolveLocalFileSystemURI(imageURI, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                myfileName = fileObj.fullPath;
                myfileName = myfileName.substr(myfileName.lastIndexOf('/') + 1);

            });
        });

        // Specify transfer options
        var options = new FileUploadOptions();
        options.fileKey = "file";
        //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.fileName = myfileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        //Rest of the form fields
        var params = new Object();
        params.yourUsername = window.localStorage["username"];
        params.yourName = yourName;
        params.yourEmail = yourEmail;
        params.yourMobile = yourMobile;
        params.yourSubject = yourSubject;
        params.yourCategory = yourCategory;
        params.yourDescription = yourDescription;

        options.params = params;

        // Transfer picture to server
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://webservices.nmmu.ac.za/mobileapp/FileUpload.ashx"), function (r) {
            document.getElementById('camera_status').innerHTML = "Upload successful: " + r.bytesSent + " bytes uploaded.";
            $("#submitAdvert").removeAttr("disabled");
            $.mobile.loading('hide');
            $.mobile.changePage("#AdvertPostSuccess", {
                role: "dialog", reverse: false,
                changeHash: false
            });
        }, function (error) {
            document.getElementById('camera_status').innerHTML = "Upload failed: Code = " + error.code;
            $.mobile.loading('hide');
            $.mobile.changePage("#PageError", {
                role: "dialog", reverse: false,
                changeHash: false
            });
        }, options);
    }
}
