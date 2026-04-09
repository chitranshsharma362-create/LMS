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

    if (nameInput && nameInput.value.length < 3) {
        nameError.innerText = "Minimum 3 Character";
        valid = false;
    } else if(nameError) nameError.innerText = "";

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
        passError.innerText = "Minimum 8 characters, 1 number & 1 special character required";
        valid = false;
    } else passError.innerText = "";

    if (confirmInput && password !== confirmInput.value) {
        confirmError.innerText = "Password mismatch";
        valid = false;
    } else if(confirmError) confirmError.innerText = "";

    return valid;
}


async function registerUser() {
    if (!validateForm()) return;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const library_name = document.getElementById("library_name").value;

    const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            library_name: library_name
        })
    });

    const data = await response.json();

    if (data.message === "Registered Successfully") {
        alert("Registered Successfully \nLibrary Code: " + data.library_code);
    } else {
        alert("Registration Failed ❌");
    }
}


async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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

    const data = await response.json();

    if (data.message === "Login Success") {

       
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        alert("Login Success ");

        
        if (data.role === "admin") {
            window.location.href = "Dashboards/librarian.html";
        } else {
            window.location.href = "Dashboards/student.html";
        }

    } else {
        alert("Invalid Credentials ❌");
    }
}



document.addEventListener("change", function (e) { 
    if (e.target.id !== "showpass") return; 
    let passwordInput = document.getElementById("password"); 
    let confirmInput = document.getElementById("confirmpass"); 
    if (!passwordInput) return; 
    let type = e.target.checked ? "text" : "password"; 
    passwordInput.type = type;
    if(confirmInput) confirmInput.type = type; 
});
