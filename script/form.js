document.addEventListener("submit", function(e){
    if (e.target.id !=="form") return;
    e.preventDefault();
let nameInput = document.getElementById("name");
let nameError = document.getElementById("nameError");
let mailInput = document.getElementById("email");
let mailError = document.getElementById("mailError");
let passwordInput = document.getElementById("password");
let passError = document.getElementById("passError");
let confirmInput = document.getElementById("confirmpass");
let confirmError = document.getElementById("confirmError");
let showpass = document.getElementById("showpass");

if(form){
    console.log("me form me aagya");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
    
        let valid = true;
    
        if (nameInput.value.length < 3) {
            nameError.innerText = "Minimum 3 characters";
            valid = false;
        } else nameError.innerText = "";
    
        let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!mailInput.value.match(emailPattern)) {
            mailError.innerText = "Invalid email";
            valid = false;
        } else mailError.innerText = "";
    
        let password = passwordInput.value;
        if (password.length < 8 || !(/\d/.test(password)) || !(/[!@#$%^&*]/.test(password))) {
            passError.innerText = "Minimum 8 characters, 1 number & 1 special character required";
            valid = false;
        } else passError.innerText = "";
    
        if (password !== confirmInput.value) {
            confirmError.innerText = "Password mismatch";
            valid = false;
        } else confirmError.innerText = "";
    
        alert("Signup Successful");
        form.reset();
    });
}

if(showpass){
    showpass.addEventListener("change", function () {
        let type = showpass.checked ? "text" : "password";
        passwordInput.type = type;
        confirmInput.type = type;
    });
}
})

