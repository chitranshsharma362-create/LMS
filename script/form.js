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
  showpass.addEventListener("change", () => {
    const type = showpass.checked ? "text" : "password";
    passwordInput.type = type;
    confirmInput.type = type;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    if (nameInput.value.trim().length < 3) {
      nameError.innerText = "Minimum 3 characters";
      valid = false;
    } else nameError.innerText = "";

    let email = mailInput.value.trim().toLowerCase();
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
      mailError.innerText = "Invalid email";
      valid = false;
    } else mailError.innerText = "";

    let password = passwordInput.value.trim();
    if (
      password.length < 8 ||
      !(/\d/.test(password)) ||
      !(/[!@#$%^&*]/.test(password))
    ) {
      passError.innerText =
        "Minimum 8 characters, 1 number & 1 special character required";
      valid = false;
    } else passError.innerText = "";

    if (password !== confirmInput.value) {
      confirmError.innerText = "Password mismatch";
      valid = false;
    } else confirmError.innerText = "";

    if (!valid) return;

    const { data: existingUser, error: checkError } =
      await supabaseClient
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (checkError) {
      alert("Error checking user");
      return;
    }

    if (existingUser) {
      alert("Email already registered");
      return;
    }

    const { error: insertError } =
      await supabaseClient
        .from("users")
        .insert([{
          name: nameInput.value.trim(),
          email,
          password
        }]);

    if (insertError) {
      alert("Registration failed");
      return;
    }

    alert("Registration successful 🎉");
    form.reset();
  });
