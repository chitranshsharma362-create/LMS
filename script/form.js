//////////////////// VALIDATION ////////////////////
function validateForm() {
    let nameInput = document.getElementById("name");
    let mailInput = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let confirmInput = document.getElementById("confirmpass");

    let nameError = document.getElementById("nameError");
    let mailError = document.getElementById("mailError");
    let passError = document.getElementById("passError");
    let confirmError = document.getElementById("confirmError");

    let valid = true;

    if (nameInput.value.length < 3) {
        nameError.innerText = "Minimum 3 Character";
        valid = false;
    } else nameError.innerText = "";

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!mailInput.value.match(emailPattern)) {
        mailError.innerText = "Invalid email";
        valid = false;
    } else mailError.innerText = "";

    let password = passwordInput.value;
    if (
        password.length < 8 ||
        !(/\d/.test(password)) ||
        !(/[!@#$%^&*]/.test(password))
    ) {
        passError.innerText = "Min 8 chars, 1 number & 1 special char required";
        valid = false;
    } else passError.innerText = "";

    if (password !== confirmInput.value) {
        confirmError.innerText = "Password mismatch";
        valid = false;
    } else confirmError.innerText = "";

    return valid;
}

//////////////////// REGISTER ////////////////////
async function registerUser(event) {
    event.preventDefault(); // 🔥 VERY IMPORTANT

    if (!validateForm()) return;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const library_name = document.getElementById("library_name").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                library_name
            })
        });

        const data = await response.json();

        console.log("Register Response:", data); // 🔥 debug

        // ✅ CORRECT CHECK
        if (response.ok) {

            // 🔥 SAVE FULL USER OBJECT
            localStorage.setItem("loggedUser", JSON.stringify(data));

            alert("Registered Successfully 🎉");

            // 🔥 REDIRECT
            window.location.href = "Dashboards/librarian.html";

        } else {
            alert(data.message || "Registration Failed ❌");
        }

    } catch (error) {
        console.error(error);
        alert("Server Error ❌");
    }
}

//////////////////// LOGIN ////////////////////
async function loginUser() {
    const email = document.getElementById("login-email")?.value;
    const password = document.getElementById("login-password")?.value;

    if (!email || !password) {
        alert("Please enter email & password");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

            // 🔥 SAVE USER PROPERLY
            localStorage.setItem("loggedUser", JSON.stringify(data));

            alert("Login Success 🎉");

            if (data.role === "admin") {
                window.location.href = "Dashboards/librarian.html";
            } else {
                window.location.href = "Dashboards/student.html";
            }

        } else {
            alert("Invalid Credentials ❌");
        }

    } catch (error) {
        console.error(error);
        alert("Server Error ❌");
    }
}


async function loginStudent() {
    const code = document.getElementById("student-code").value;

    if (!code) return alert("Enter Library Code");

    const response = await fetch("http://127.0.0.1:5000/join_library", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            library_code: code,
            role: "student",
            name: "Student"
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("loggedUser", JSON.stringify(data));
        window.location.href = "Dashboards/student.html";
    } else {
        alert(data.message);
    }
}
 //Teacher login

async function loginTeacher() {
    const code = document.getElementById("teacher-code").value;

    if (!code) return alert("Enter Library Code");

    const response = await fetch("http://127.0.0.1:5000/join_library", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            library_code: code,
            role: "teacher",
            name: "Teacher"
        })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("loggedUser", JSON.stringify(data));
        window.location.href = "Dashboards/teacher.html";
    } else {
        alert(data.message);
    }
}

//////////////////// SHOW PASSWORD ////////////////////
document.addEventListener("change", function (e) {
    if (e.target.id !== "showpass") return;

    let passwordInput = document.getElementById("password");
    let confirmInput = document.getElementById("confirmpass");

    let type = e.target.checked ? "text" : "password";
    passwordInput.type = type;
    if (confirmInput) confirmInput.type = type;
});


