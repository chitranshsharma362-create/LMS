//////////////////// LOAD STUDENTS ////////////////////

async function loadStudentsDropdown() {

    const select = document.getElementById("issueStudent");

    if (!select) return;

    select.innerHTML = `<option value="">Select Student</option>`;

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("users")
        .select("user_id, name")
        .eq("library_id", library_id)
        .eq("role", "student")
        .order("name", { ascending: true });

    if (error) {
        console.error("Student Error:", error);
        return;
    }

    data.forEach(student => {

        const option = document.createElement("option");
        option.value = student.user_id;
        option.textContent = student.name;

        select.appendChild(option);

    });

}

//////////////////// LOAD BOOKS ////////////////////

async function loadBooksDropdown() {

    const select = document.getElementById("issueBook");

    if (!select) return;

    select.innerHTML = `<option value="">Select Book</option>`;

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("books")
        .select("book_id, book_name, available_quantity")
        .eq("library_id", library_id)
        .gt("available_quantity", 0)
        .order("book_name", { ascending: true });

    if (error) {
        console.error("Book Error:", error);
        return;
    }

    data.forEach(book => {

        const option = document.createElement("option");
        option.value = book.book_id;
        option.textContent = `${book.book_name} (${book.available_quantity})`;

        select.appendChild(option);

    });

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    loadStudentsDropdown();
    loadBooksDropdown();
    loadIssuedBooks();

});

async function issueBook() {

    const student_id = Number(document.getElementById("issueStudent").value);
    const book_id = Number(document.getElementById("issueBook").value);
    const issue_date = document.getElementById("issueDate").value;
    const fine = Number(document.getElementById("issueFine").value) || 0;
    const status = document.getElementById("issueStatus").value;

    const issued_by = Number(localStorage.getItem("user_id"));

    if (!student_id || !book_id || !issue_date) {
        alert("Please fill all fields.");
        return;
    }

    try {

        // Check if same book already issued to student
        const { data: alreadyIssued } = await supabaseClient
            .from("issued_books")
            .select("issue_id")
            .eq("student_id", student_id)
            .eq("book_id", book_id)
            .eq("status", "Issued")
            .maybeSingle();

        if (alreadyIssued) {
            alert("This student already has this book.");
            return;
        }

        // Get book quantity
        const { data: bookData, error: bookError } = await supabaseClient
            .from("books")
            .select("available_quantity")
            .eq("book_id", book_id)
            .single();

        if (bookError) throw bookError;

        if (bookData.available_quantity <= 0) {
            alert("Book Not Available");
            return;
        }

        // Due date = Issue date + 15 days
        const due = new Date(issue_date);
        due.setDate(due.getDate() + 15);
        const due_date = due.toISOString().split("T")[0];

        // Insert Issue Record
        const { error } = await supabaseClient
            .from("issued_books")
            .insert([{
                student_id,
                book_id,
                issued_by,
                issue_date,
                due_date,
                status,
                fine
            }]);

        if (error) throw error;

        // Reduce available quantity
        const { error: updateError } = await supabaseClient
            .from("books")
            .update({
                available_quantity: bookData.available_quantity - 1
            })
            .eq("book_id", book_id);

        if (updateError) throw updateError;

       alert("Book Issued Successfully");

document.getElementById("issueStudent").value = "";
document.getElementById("issueBook").value = "";
document.getElementById("issueDate").value = "";
document.getElementById("issueStatus").value = "issued";
document.getElementById("issueFine").value = "";

closeModal("issueModal");

loadIssuedBooks();
loadBooksDropdown();
loadBooks();

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

async function loadIssuedBooks() {

    const tbody = document.getElementById("IssuereturnTable");

    if (!tbody) return;

    tbody.innerHTML = "";

    const { data, error } = await supabaseClient
        .from("issued_books")
        .select("*")
        .order("issue_id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    for (const item of data) {

        const { data: student } = await supabaseClient
            .from("users")
            .select("name")
            .eq("user_id", item.student_id)
            .single();

        const { data: book } = await supabaseClient
            .from("books")
            .select("book_name")
            .eq("book_id", item.book_id)
            .single();

        tbody.innerHTML += `
            <tr>
                <td>${student?.name ?? "-"}</td>
                <td>${book?.book_name ?? "-"}</td>
                <td>${item.due_date}</td>
                <td>${item.status}</td>
                <td>₹0</td>
            </tr>
        `;
    }

}
