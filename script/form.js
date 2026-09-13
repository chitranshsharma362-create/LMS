//////////////////// FORM VALIDATION ////////////////////

function validateForm() {

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmpass").value;

    document.getElementById("nameError").innerText = "";
    document.getElementById("mailError").innerText = "";
    document.getElementById("passError").innerText = "";
    document.getElementById("confirmError").innerText = "";

    // Name Validation
    if (name.length < 3) {

        document.getElementById("nameError").innerText =
            "Minimum 3 characters required";

        valid = false;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        document.getElementById("mailError").innerText =
            "Enter a valid email";

        valid = false;
    }

    // Password Validation
    const passwordPattern =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    if (!passwordPattern.test(password)) {

        document.getElementById("passError").innerText =
            "Minimum 8 characters, 1 number & 1 special character";

        valid = false;
    }

    // Confirm Password
    if (password !== confirm) {

        document.getElementById("confirmError").innerText =
            "Password does not match";

        valid = false;
    }

    return valid;
}


//////////////////// SHOW PASSWORD ////////////////////

function initializeShowPassword() {

    const showPass = document.getElementById("showpass");

    if (!showPass) {
        return;
    }

    // Prevent duplicate event listener
    if (showPass.dataset.initialized === "true") {
        return;
    }

    showPass.addEventListener("change", function () {

        const type = this.checked ? "text" : "password";

        const password = document.getElementById("password");
        const confirm = document.getElementById("confirmpass");

        if (password) {
            password.type = type;
        }

        if (confirm) {
            confirm.type = type;
        }

    });

    showPass.dataset.initialized = "true";
}


//////////////////// LIBRARY LOCATION MAP ////////////////////

let libraryMap = null;
let libraryMarker = null;


function initializeLibraryMap() {

    const mapElement = document.getElementById("map");

    // Form/map abhi load nahi hua
    if (!mapElement) {
        return false;
    }

    // Leaflet load nahi hua
    if (typeof L === "undefined") {
        console.log("Waiting for Leaflet...");
        return false;
    }

    // Map already initialized
    if (libraryMap) {
        return true;
    }

    // Jaipur default location
    libraryMap = L.map("map").setView(
        [26.9124, 75.7873],
        13
    );


    // OpenStreetMap Tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    ).addTo(libraryMap);


    // Map Click
    libraryMap.on("click", function (e) {

        // Remove old marker
        if (libraryMarker) {
            libraryMap.removeLayer(libraryMarker);
        }


        // Add new marker
        libraryMarker = L.marker(e.latlng)
            .addTo(libraryMap);


        // Save Latitude
        const latInput = document.getElementById("lat");

        // Save Longitude
        const lonInput = document.getElementById("lon");


        if (latInput) {
            latInput.value = e.latlng.lat;
        }

        if (lonInput) {
            lonInput.value = e.latlng.lng;
        }


        console.log("Latitude :", e.latlng.lat);
        console.log("Longitude :", e.latlng.lng);

    });


    // Fix map rendering inside modal
    setTimeout(function () {

        if (libraryMap) {
            libraryMap.invalidateSize();
        }

    }, 500);


    console.log("Library map initialized.");

    return true;
}


//////////////////// INITIALIZE DYNAMIC FORM ////////////////////

function initializeFormElements() {

    initializeShowPassword();

    initializeLibraryMap();
}


//////////////////// WATCH FOR DYNAMIC FORM ////////////////////

const formObserver = new MutationObserver(function () {

    const mapElement = document.getElementById("map");
    const showPass = document.getElementById("showpass");

    // Form dynamically load ho gaya
    if (mapElement || showPass) {

        initializeFormElements();

    }

});


//////////////////// START OBSERVER ////////////////////

if (document.body) {

    formObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

}


// In case form already exists
initializeFormElements();


//////////////////// WINDOW LOAD ////////////////////

window.addEventListener("load", function () {

    initializeFormElements();

});
