async function registerUser(event) {
    event.preventDefault();

    const libraryName = document.getElementById("library_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpass").value;

    // Password Check
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {

        // Check Email Exists
        const { data: existingUser, error: checkError } = await supabaseClient
            .from("users")
            .select("user_id")
            .eq("email", email)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser) {
            alert("Email already exists");
            return;
        }

        // Generate Library Code
        const libraryCode = "LIB" + Math.floor(1000 + Math.random() * 9000);

        // Insert Library
        const { data: libraryData, error: libraryError } = await supabaseClient
            .from("libraries")
            .insert({
                library_name: libraryName,
                library_code: libraryCode
            })
            .select()
            .single();

        if (libraryError) throw libraryError;

        // Insert Librarian
        const { error: userError } = await supabaseClient
            .from("users")
            .insert({
                library_id: libraryData.library_id,
                name: name,
                email: email,
                password: password,
                role: "librarian",
                status: "Active"
            });

        if (userError) throw userError;

        alert("Registration Successful!");

        console.log({
            library_id: libraryData.library_id,
            library_code: libraryCode
        });

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}
