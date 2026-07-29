let map;
let marker;

window.addEventListener("DOMContentLoaded", () => {

    map = L.map("map").setView([26.9124,75.7873],13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
        attribution:"© OpenStreetMap"
    }).addTo(map);

    map.on("click",function(e){

        const lat=e.latlng.lat;
        const lon=e.latlng.lng;

        document.getElementById("lat").value=lat;
        document.getElementById("lon").value=lon;

        if(marker){

            marker.setLatLng(e.latlng);

        }else{

            marker=L.marker(e.latlng).addTo(map);

        }

    });

});

//////////////////// REGISTER ////////////////////

async function registerUser(event) {

    event.preventDefault();

    if (!validateForm()) return;

    const library_name = document.getElementById("library_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmpass").value;
    const city = document.getElementById("city").value.trim();

const address = document.getElementById("address").value.trim();

const lat = parseFloat(document.getElementById("lat").value);

const lon = parseFloat(document.getElementById("lon").value);

if(isNaN(lat) || isNaN(lon)){

    alert("Please select your library on the map.");

    return;

}

    if (password !== confirm) {
        alert("Password Mismatch");
        return;
    }

    try {

        // Check Email
        const { data: existing, error: checkError } = await supabaseClient
            .from("users")
            .select("user_id")
            .eq("email", email)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
            alert("Email Already Registered");
            return;
        }

        // Generate Library Code
        const library_code = "LIB" + Math.floor(1000 + Math.random() * 9000);

        // Insert Library
        const { data: library, error: libraryError } = await supabaseClient
            .from("libraries")
            .insert([
                {
                   {
    library_name: library_name,
    library_code: library_code,
    city: city,
    address: address,
    lat: lat,
    lon: lon
}
                }
            ])
            .select()
            .single();

        if (libraryError) throw libraryError;

        // Insert User
        const { data: user, error: userError } = await supabaseClient
            .from("users")
            .insert([
                {
                    library_id: library.library_id,
                    name: name,
                    email: email,
                    password: password,
                    role: "librarian",
                    status: "Active"
                }
            ])
            .select()
            .single();

        if (userError) throw userError;

        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("library_id", user.library_id);
        localStorage.setItem("library_code", library.library_code);
        localStorage.setItem("library_name", library.library_name);
        localStorage.setItem("name", user.name);
        localStorage.setItem("role", user.role);

        alert("Registration Successful");

        document.getElementById("form").reset();

        window.location.href = "Dashboards/librarian.html";

    }
    catch (err) {

        console.error(err);
        alert(err.message);

    }

}
//////////////////// LOGIN ////////////////////

//////////////////// LOGIN ////////////////////

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Please enter Email & Password");
        return;
    }

    try {

        const { data: user, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .maybeSingle();

        if (error) throw error;

        if (!user) {
            alert("Invalid Email or Password");
            return;
        }

        // Check Account Status
        if (user.status && user.status.toLowerCase() !== "active") {
            alert("Your account is inactive.");
            return;
        }

        // Save User Data
        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("library_id", user.library_id);
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);
        localStorage.setItem("course", user.course);

        alert("Login Successful");

        const role = user.role.toLowerCase();

        if (role === "admin" || role === "librarian") {

            window.location.href = "Dashboards/librarian.html";

        }
        else if (role === "student") {

            window.location.href = "Dashboards/student.html";

        }
        else if (role === "teacher") {

            window.location.href = "Dashboards/teacher.html";

        }
        else {

            alert("Unknown User Role");

        }

    } catch (err) {

        console.error("Login Error:", err);
        alert("Login Failed!");

    }

}
