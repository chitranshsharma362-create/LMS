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

//////////////////// SHOW PASSWORD ////////////////////

const showPass = document.getElementById("showpass");

if (showPass) {

    showPass.addEventListener("change", function () {

        const type = this.checked ? "text" : "password";

        const password = document.getElementById("password");
        const confirm = document.getElementById("confirmpass");

        if (password) password.type = type;
        if (confirm) confirm.type = type;

    });

}
