document.addEventListener("submit", async (e) => {
  if (e.target.id !== "form") return;

  e.preventDefault();
  
  if (!validateForm()) return;

  const libraryInput = document.getElementById("library_name");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if ( !library_name || !nameInput || !emailInput || !passwordInput) return;

  const library_name = libraryInput.value.trim();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const { data: existingUser, error: checkError } =
      await supabaseClient
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      alert("Email already registered");
      return;
    }

    const { error: insertError } = await supabaseClient
      .from("users")
      .insert([
        {
          library_name,
          name,
          email,
          password
        }
      ]);

    if (insertError) throw insertError;

    localStorage.setItem(
      "loggedUser",
      JSON.stringify({name , email , library_name })
    );

    alert("Registration successful");
    e.target.reset();

    window.location.href = "Dashboards/librarian.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});
