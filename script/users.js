//////////////////// REGISTER USER ////////////////////

async function registerUser(event) {

    event.preventDefault();

    if (!validateForm()) return;

    const library_name = document.getElementById("library_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpass").value;

    if (password !== confirmPassword) {

        alert("Password Mismatch");

        return;

    }

    try {

        const response = await fetch("http://127.0.0.1:5000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                library_name: library_name,
                name: name,
                email: email,
                password: password

            })

        });

        const result = await response.json();

        if (response.ok) {

            alert(result.message);

            localStorage.setItem("user_id", result.user_id);
            localStorage.setItem("library_id", result.library_id);
            localStorage.setItem("library_code", result.library_code);
            localStorage.setItem("name", result.name);
            localStorage.setItem("role", result.role);

            document.getElementById("form").reset();

            window.location.href = "Dashboards/librarian.html";

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
