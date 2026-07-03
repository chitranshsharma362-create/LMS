//////////////////// REGISTER ////////////////////

async function registerUser(event) {

    event.preventDefault();

    if (!validateForm()) return;

    const library_name = document.getElementById("library_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmpass").value;

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
                    library_name: library_name,
                    library_code: library_code
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

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {

        alert("Please enter Email & Password");
        return;

    }

    try {

        const response = await fetch("http://127.0.0.1:5000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email,
                password: password

            })

        });

        const result = await response.json();

        if (response.ok) {

            // Save Login Data

            localStorage.setItem("user_id", result.user_id);
            localStorage.setItem("name", result.name);
            localStorage.setItem("role", result.role);

            alert(result.message);

            // Role Wise Dashboard

            if (result.role === "admin") {

                window.location.href = "Dashboards/librarian.html";

            }

            else if (result.role === "student") {

                window.location.href = "Dashboards/student.html";

            }

            else if (result.role === "teacher") {

                window.location.href = "Dashboards/teacher.html";

            }

            else {

                alert("Unknown Role");

            }

        }

        else {

            alert(result.message);

        }

    }

    catch (err) {

        console.error(err);

        alert("Server Error");

    }

}
