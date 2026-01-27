let form = document.getElementById("form");
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
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;

  let name = nameInput.value.trim();
  let email = mailInput.value.trim().toLowerCase();
  let password = passwordInput.value.trim();
  let confirm = confirmInput.value.trim();

  if (name.length < 3) {
    nameError.innerText = "Minimum 3 characters";
    valid = false;
  } else nameError.innerText = "";

  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.match(emailPattern)) {
    mailError.innerText = "Invalid email";
    valid = false;
  } else mailError.innerText = "";

  if (password.length < 8 || !(/\d/.test(password)) || !(/[!@#$%^&*]/.test(password))) {
    passError.innerText = "Minimum 8 chars, 1 number & 1 special char";
    valid = false;
  } else passError.innerText = "";

  if (password !== confirm) {
    confirmError.innerText = "Password mismatch";
    valid = false;
  } else confirmError.innerText = "";

  if (!valid) return;

  const { data: existingUser } = await supabaseClient
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    alert("Email already registered");
    return;
  }

  const { error } = await supabaseClient
    .from("users")
    .insert([{ name, email, password }]);

  if (error) {
    alert("Registration failed");
    return;
  }

  alert("Registration successful");
  form.reset();
});
}

if(showpass){
showpass.addEventListener("change", () => {
  const type = showpass.checked ? "text" : "password";
  passwordInput.type = type;
  confirmInput.type = type;
});
}
