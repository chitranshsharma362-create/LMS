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

    if (showPass.dataset.initialized === "true") {
        return;
    }

    showPass.addEventListener("change", function () {

        const type = this.checked ? "text" : "password";

        const password =
            document.getElementById("password");

        const confirm =
            document.getElementById("confirmpass");

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

    // Form abhi load nahi hua
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
        setTimeout(() => {
            libraryMap.invalidateSize();
        }, 300);

        return true;
    }


    /*
       Default location only used temporarily.
       Browser ki current location milte hi
       map automatically wahan move ho jayega.
    */

    const defaultLat = 26.9124;
    const defaultLon = 75.7873;


    // Create Map
    libraryMap = L.map("map").setView(
        [defaultLat, defaultLon],
        13
    );


    // OpenStreetMap Tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap"
        }
    ).addTo(libraryMap);


    // Fix map rendering inside modal
    setTimeout(() => {

        libraryMap.invalidateSize();

    }, 500);


    //////////////////// CURRENT LOCATION ////////////////////

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const currentLat =
                    position.coords.latitude;

                const currentLon =
                    position.coords.longitude;


                // Move map to current location
                libraryMap.setView(
                    [currentLat, currentLon],
                    16
                );


                // Remove previous marker
                if (libraryMarker) {

                    libraryMap.removeLayer(
                        libraryMarker
                    );

                }


                // Add current location marker
                libraryMarker = L.marker([
                    currentLat,
                    currentLon
                ]).addTo(libraryMap);


                libraryMarker
                    .bindPopup("Your Current Location")
                    .openPopup();


                console.log(
                    "Current Latitude:",
                    currentLat
                );

                console.log(
                    "Current Longitude:",
                    currentLon
                );

            },

            function (error) {

                console.log(
                    "Unable to get current location."
                );

                console.log(error);

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

    } else {

        console.log(
            "Geolocation is not supported."
        );

    }


    //////////////////// MAP CLICK ////////////////////

    libraryMap.on("click", function (e) {

        const selectedLat =
            e.latlng.lat;

        const selectedLon =
            e.latlng.lng;


        // Remove old marker
        if (libraryMarker) {

            libraryMap.removeLayer(
                libraryMarker
            );

        }


        // Add selected location marker
        libraryMarker = L.marker([
            selectedLat,
            selectedLon
        ]).addTo(libraryMap);


        libraryMarker
            .bindPopup("Selected Library Location")
            .openPopup();


        // Save Latitude
        const latInput =
            document.getElementById("lat");


        // Save Longitude
        const lonInput =
            document.getElementById("lon");


        if (latInput) {

            latInput.value =
                selectedLat;

        }


        if (lonInput) {

            lonInput.value =
                selectedLon;

        }


        console.log(
            "Selected Latitude:",
            selectedLat
        );

        console.log(
            "Selected Longitude:",
            selectedLon
        );

    });


    console.log(
        "Library map initialized successfully."
    );

    return true;
}


//////////////////// FORM INITIALIZATION ////////////////////

function initializeFormElements() {

    initializeShowPassword();

    initializeLibraryMap();
}


//////////////////// DYNAMIC FORM OBSERVER ////////////////////

const formObserver =
    new MutationObserver(function () {

        const mapElement =
            document.getElementById("map");

        const showPass =
            document.getElementById("showpass");


        if (mapElement || showPass) {

            initializeFormElements();

        }

    });


//////////////////// START OBSERVER ////////////////////

if (document.body) {

    formObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

}


//////////////////// INITIAL CHECK ////////////////////

initializeFormElements();


//////////////////// WINDOW LOAD ////////////////////

window.addEventListener(
    "load",
    function () {

        initializeFormElements();

    }
);

//////////////////// STUDENT LOGIN ////////////////////

async function loginStudent(event) {

    event.preventDefault();

    const libraryCode =
        document.getElementById("student-code").value.trim().toUpperCase();

    const email =
        document.getElementById("student-email").value.trim().toLowerCase();

    const password =
        document.getElementById("student-password").value;

    // Empty fields check
    if (!libraryCode || !email || !password) {

        alert("Please enter Library Code, Email & Password");
        return;
    }

    try {

        //////////////////// CHECK LIBRARY ////////////////////

        const { data: library, error: libraryError } =
            await supabaseClient
                .from("libraries")
                .select("library_id, library_name, library_code")
                .eq("library_code", libraryCode)
                .maybeSingle();

        if (libraryError) {
            throw libraryError;
        }

        if (!library) {

            alert("Invalid Library Code");
            return;
        }


        //////////////////// CHECK STUDENT ////////////////////

        const { data: student, error: studentError } =
            await supabaseClient
                .from("users")
                .select("*")
                .eq("library_id", library.library_id)
                .eq("email", email)
                .eq("password", password)
                .eq("role", "student")
                .maybeSingle();

        if (studentError) {
            throw studentError;
        }


        //////////////////// INVALID LOGIN ////////////////////

        if (!student) {

            alert("Invalid Email or Password");
            return;
        }


        //////////////////// STATUS CHECK ////////////////////

        if (
            student.status &&
            student.status.toLowerCase() !== "active"
        ) {

            alert("Your account is inactive.");
            return;
        }


        //////////////////// SAVE LOGIN DATA ////////////////////

        localStorage.setItem(
            "user_id",
            student.user_id
        );

        localStorage.setItem(
            "library_id",
            student.library_id
        );

        localStorage.setItem(
            "library_code",
            library.library_code
        );

        localStorage.setItem(
            "library_name",
            library.library_name
        );

        localStorage.setItem(
            "name",
            student.name
        );

        localStorage.setItem(
            "email",
            student.email
        );

        localStorage.setItem(
            "role",
            student.role
        );

        localStorage.setItem(
            "course",
            student.course || ""
        );


        //////////////////// LOGIN SUCCESS ////////////////////

        alert("Student Login Successful");

        window.location.href =
            "Dashboards/student.html";


    } catch (error) {

        console.error(
            "Student Login Error:",
            error
        );

        alert(
            "Login Failed. Please try again."
        );
    }
}
