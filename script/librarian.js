document.getElementById("form").addEventListener("submit" , async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password){
    alert("all fields are required");
    return;
  }

  const {data: existingUser, error: checkError } =
    await supabaseClient
  .from("users")
  .select("id")
  .eq("email", email)
  .maybeSingle();

  if (checkError){
    console.error(checkError);
    alert("Error checking user");
    return;
  }

  if (existingUser) {
    alert("Email already registerd");
    return;
  }

  const { error: insertError} =
    await supabaseClient
  .from("users")
  .insert([
  {
    name: name,
    email: email,
    password: password
}
]);

if (insertError){
  console.error(insertError);
  alert("registration failed");
  return;
}

alert("Registration successfully");
e.target.reset();
})
