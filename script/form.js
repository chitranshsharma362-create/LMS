//////////////////// VALIDATION ////////////////////
function validateForm() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirmpass").value;

    let valid = true;

    if (name.length < 3) {
        document.getElementById("nameError").innerText = "Minimum 3 characters";
        valid = false;
    } else document.getElementById("nameError").innerText = "";

    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(pattern)) {
        document.getElementById("mailError").innerText = "Invalid email";
        valid = false;
    } else document.getElementById("mailError").innerText = "";

    if (password.length < 6) {
        document.getElementById("passError").innerText = "Min 6 characters";
        valid = false;
    } else document.getElementById("passError").innerText = "";

    if (password !== confirm) {
        document.getElementById("confirmError").innerText = "Password mismatch";
        valid = false;
    } else document.getElementById("confirmError").innerText = "";

    return valid;
}

//////////////////// REGISTER (LIBRARIAN) ////////////////////
async function registerUser(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const library_name = document.getElementById("library_name").value;

    try {
        const res = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password, library_name })
        });

        const data = await res.json();

        console.log("REGISTER:", data);

        if (res.ok) {
            localStorage.setItem("loggedUser", JSON.stringify(data));

            alert("Registered ✅\nLibrary Code: " + data.library_code);

            window.location.href = "Dashboards/librarian.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Server Error ❌");
    }
}

//////////////////// LOGIN (LIBRARIAN) ////////////////////
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Enter email & password");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("LOGIN:", data);

        if (res.ok) {
            localStorage.setItem("loggedUser", JSON.stringify(data));

            if (data.role === "admin") {
                window.location.href = "Dashboards/librarian.html";
            } 
            else if (data.role === "student") {
                window.location.href = "Dashboards/student.html";
            } 
            else if (data.role === "teacher") {
                window.location.href = "Dashboards/teacher.html";
            } 
            else {
                alert("Unknown role ❌");
            }

        } else {
            alert("Invalid Credentials ❌");
        }

    } catch (err) {
        console.error(err);
        alert("Server Error ❌");
    }
}

//////////////////// STUDENT LOGIN ////////////////////
async function loginStudent() {
    const code = document.getElementById("student-code").value;

    if (!code) return alert("Enter Library Code");

    try {
        const res = await fetch("http://127.0.0.1:5000/join_library", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                library_code: code,
                role: "student"
            })
        });

        const data = await res.json();

        console.log("STUDENT:", data);

        if (res.ok) {
            localStorage.setItem("loggedUser", JSON.stringify(data));
            window.location.href = "Dashboards/student.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Error ❌");
    }
}

//////////////////// TEACHER LOGIN ////////////////////
async function loginTeacher() {
    const code = document.getElementById("teacher-code").value;

    if (!code) return alert("Enter Library Code");

    try {
        const res = await fetch("http://127.0.0.1:5000/join_library", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                library_code: code,
                role: "teacher"
            })
        });

        const data = await res.json();

        console.log("TEACHER:", data);

        if (res.ok) {
            localStorage.setItem("loggedUser", JSON.stringify(data));
            window.location.href = "Dashboards/teacher.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Error ❌");
    }
}

//////////////////// SHOW PASSWORD ////////////////////
document.addEventListener("change", function (e) {
    if (e.target.id !== "showpass") return;

    const pass = document.getElementById("password");
    const confirm = document.getElementById("confirmpass");

    const type = e.target.checked ? "text" : "password";

    pass.type = type;
    if (confirm) confirm.type = type;
});
