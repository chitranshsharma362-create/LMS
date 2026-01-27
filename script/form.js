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
        nameError.innerText = "Minimum 3 characters";
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
        passError.innerText = "Weak password";
        valid = false;
    } else passError.innerText = "";

    if (password !== confirmInput.value) {
        confirmError.innerText = "Password mismatch";
        valid = false;
    } else confirmError.innerText = "";

    return valid;
}
