//////////////////// VALIDATION ////////////////////

function validateForm() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirmpass").value;

    let valid = true;

    if (name.length < 3) {
        document.getElementById("nameError").innerText = "Minimum 3 characters";
        valid = false;
    } else {
        document.getElementById("nameError").innerText = "";
    }

    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;

    if (!email.match(pattern)) {
        document.getElementById("mailError").innerText = "Invalid Email";
        valid = false;
    } else {
        document.getElementById("mailError").innerText = "";
    }

    if (password.length < 6) {
        document.getElementById("passError").innerText = "Minimum 6 characters";
        valid = false;
    } else {
        document.getElementById("passError").innerText = "";
    }

    if (password !== confirm) {
        document.getElementById("confirmError").innerText = "Password Mismatch";
        valid = false;
    } else {
        document.getElementById("confirmError").innerText = "";
    }

    return valid;
}


async function registerUser(event) {

    event.preventDefault();

    if (!validateForm()) return;

    const library_name = document.getElementById("library_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpass").value;

    if (password !== confirmPassword) {
        alert("Password Mismatch");
        return;
    }

    try {
        const { data: existingUser, error: checkError } =
            await supabaseClient
                .from("users")
                .select("user_id")
                .eq("email", email)
                .maybeSingle();

        if (checkError) throw checkError;
        if (existingUser) {
            alert("Email Already Exists");
            return;
        }

        let libraryCode;

        while (true) {

            libraryCode =
                "LIB" +
                Math.floor(100000 + Math.random() * 900000);

            const { data } =
                await supabaseClient
                    .from("libraries")
                    .select("library_id")
                    .eq("library_code", libraryCode)
                    .maybeSingle();

            if (!data) break;

        }

        // Insert Library

        const { data: libraryData, error: libraryError } =
            await supabaseClient
                .from("libraries")
                .insert([
                    {
                        library_name: library_name,
                        library_code: libraryCode
                    }
                ])
                .select()
                .single();

        if (libraryError) throw libraryError;

        // Insert Librarian

        const { data: userData, error: userError } =
            await supabaseClient
                .from("users")
                .insert([
                    {
                        library_id: libraryData.library_id,
                        name: name,
                        email: email,
                        password: password,
                        role: "librarian",
                        status: "Active"
                    }
                ])
                .select()
                .single();

        if (userError) throw userError;

        localStorage.setItem(
            "loggedUser",
            JSON.stringify({
                user_id: userData.user_id,
                library_id: libraryData.library_id,
                library_code: libraryCode,
                name: name,
                email: email,
                role: "librarian"
            })
        );

        alert("Registration Successful\n\nLibrary Code : " + libraryCode);

        document.getElementById("form").reset();

        window.location.href = "index.html";

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("login-email").value.trim().toLowerCase();

    const password =
        document.getElementById("login-password").value;

    if (!email || !password) {

        alert("Enter Email & Password");

        return;

    }

    try {

        const { data, error } =
            await supabaseClient
                .from("users")
                .select("*")
                .eq("email", email)
                .eq("password", password)
                .maybeSingle();

        if (error) throw error;

        if (!data) {

            alert("Invalid Credentials");

            return;

        }
        localStorage.setItem(
            "loggedUser",
            JSON.stringify(data)
        );

        if (data.role === "librarian") {

            window.location.href =
                "Dashboards/librarian.html";

        }

        else if (data.role === "student") {

            window.location.href =
                "Dashboards/student.html";

        }

        else if (data.role === "teacher") {

            window.location.href =
                "Dashboards/teacher.html";

        }

        else {
            alert("Unknown Role");
        }

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

async function loginStudent(event) {

    event.preventDefault();

    const code = document.getElementById("student-code").value.trim();
    const email = document.getElementById("student-email").value.trim().toLowerCase();
    const password = document.getElementById("student-password").value;

    if (!code || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        // Find Library
        const { data: library, error: libError } = await supabaseClient
            .from("libraries")
            .select("library_id, library_code")
            .eq("library_code", code)
            .maybeSingle();

        if (libError) throw libError;

        if (!library) {
            alert("Invalid Library Code");
            return;
        }

        // Find Student
        const { data: user, error: userError } = await supabaseClient
            .from("users")
            .select("*")
            .eq("library_id", library.library_id)
            .eq("email", email)
            .eq("password", password)
            .eq("role", "student")
            .maybeSingle();

        if (userError) throw userError;

        if (!user) {
            alert("Invalid Credentials");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));

        window.location.href = "Dashboards/student.html";

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

async function loginTeacher(event) {

    event.preventDefault();

    const code = document.getElementById("teacher-code").value.trim();
    const email = document.getElementById("teacher-email").value.trim().toLowerCase();
    const password = document.getElementById("teacher-password").value;

    if (!code || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        // Find Library
        const { data: library, error: libError } = await supabaseClient
            .from("libraries")
            .select("library_id, library_code")
            .eq("library_code", code)
            .maybeSingle();

        if (libError) throw libError;

        if (!library) {
            alert("Invalid Library Code");
            return;
        }

        // Find Teacher
        const { data: user, error: userError } = await supabaseClient
            .from("users")
            .select("*")
            .eq("library_id", library.library_id)
            .eq("email", email)
            .eq("password", password)
            .eq("role", "teacher")
            .maybeSingle();

        if (userError) throw userError;

        if (!user) {
            alert("Invalid Credentials");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));

        window.location.href = "Dashboards/teacher.html";

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

document.addEventListener("change", function (e) {

    if (e.target.id !== "showpass") return;

    const pass = document.getElementById("password");
    const confirm = document.getElementById("confirmpass");

    const type = e.target.checked ? "text" : "password";

    pass.type = type;
    confirm.type = type;

});
