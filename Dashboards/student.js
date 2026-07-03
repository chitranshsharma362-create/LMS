let selectedStudentId = null;

//////////////////// ADD STUDENT ////////////////////

async function addStudent() {

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim().toLowerCase();
    const password = document.getElementById("studentPassword").value;
    const course = document.getElementById("studentCourse").value.trim();
    const fees = Number(document.getElementById("studentFees").value);
    const status = document.getElementById("studentStatus").value;

    const library_id = Number(localStorage.getItem("library_id"));

    if (!name || !email || !password) {
        alert("Fill all required fields");
        return;
    }

    try {

        // Email Exists ?

        const { data: existing } = await supabaseClient

            .from("users")

            .select("user_id")

            .eq("email", email)

            .maybeSingle();

        if (existing) {

            alert("Email Already Exists");

            return;

        }

        const { error } = await supabaseClient

            .from("users")

            .insert([{

                library_id,

                name,

                email,

                password,

                role: "student",

                course,

                fees,

                status

            }]);

        if (error) throw error;

        alert("Student Added Successfully");

        closeModal("studentModal");

        document.getElementById("studentName").value = "";
        document.getElementById("studentEmail").value = "";
        document.getElementById("studentPassword").value = "";
        document.getElementById("studentCourse").value = "";
        document.getElementById("studentFees").value = "";

        loadStudents();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//////////////////// LOAD STUDENTS ////////////////////

async function loadStudents() {

    const library_id = Number(localStorage.getItem("library_id"));

    const tbody = document.getElementById("studentTable");

    tbody.innerHTML = "";

    const { data, error } = await supabaseClient

        .from("users")

        .select("*")

        .eq("library_id", library_id)

        .eq("role", "student")

        .order("user_id");

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${student.name}</td>
        <td>${student.course ?? ""}</td>
        <td>${student.status}</td>
        <td>${student.fees ?? 0}</td>

        `;

        row.onclick = () => {

            document.querySelectorAll("#studentTable tr")

                .forEach(r => r.classList.remove("selected"));

            row.classList.add("selected");

            selectedStudentId = student.user_id;

        };

        tbody.appendChild(row);

    });

}

//////////////////// REMOVE STUDENT ////////////////////

async function removeRow() {

    if (!selectedStudentId) {

        alert("Select Student");

        return;

    }

    if (!confirm("Delete Student?")) return;

    const { error } = await supabaseClient

        .from("users")

        .delete()

        .eq("user_id", selectedStudentId);

    if (error) {

        alert(error.message);

        return;

    }

    selectedStudentId = null;

    loadStudents();

}

window.addEventListener("DOMContentLoaded", loadStudents);
