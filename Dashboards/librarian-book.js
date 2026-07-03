let selectedBookId = null;

//////////////////// ADD BOOK ////////////////////

async function addBookToDB() {

    const isbn = document.getElementById("bookIsbn").value.trim();
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = parseInt(document.getElementById("bookQty").value);

    if (!isbn || !name || !author || !quantity) {
        alert("Please fill all fields.");
        return;
    }

    const library_id = Number(localStorage.getItem("library_id"));

    if (!library_id) {
        alert("Please login first.");
        return;
    }

    try {

        // Check if ISBN already exists in this library
        const { data: existing } = await supabaseClient
            .from("books")
            .select("*")
            .eq("library_id", library_id)
            .eq("isbn", isbn)
            .maybeSingle();

        if (existing) {

            const { error } = await supabaseClient
                .from("books")
                .update({
                    total_quantity: existing.total_quantity + quantity,
                    available_quantity: existing.available_quantity + quantity
                })
                .eq("book_id", existing.book_id);

            if (error) throw error;

        } else {

            const { error } = await supabaseClient
                .from("books")
                .insert([{
                    library_id,
                    isbn,
                    book_name: name,
                    author,
                    total_quantity: quantity,
                    available_quantity: quantity
                }]);

            if (error) throw error;

        }

        alert("Book Added Successfully");

        document.getElementById("bookIsbn").value = "";
        document.getElementById("bookName").value = "";
        document.getElementById("bookAuthor").value = "";
        document.getElementById("bookQty").value = "";

        closeModal("bookModal");

        loadBooks();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//////////////////// LOAD BOOKS ////////////////////

async function loadBooks() {

    const library_id = Number(localStorage.getItem("library_id"));

    const tbody = document.getElementById("bookTableBody");

    tbody.innerHTML = "";

    try {

        const { data: books, error } = await supabaseClient
            .from("books")
            .select("*")
            .eq("library_id", library_id)
            .order("book_id");

        if (error) throw error;

        books.forEach(book => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.isbn}</td>
                <td>${book.book_name}</td>
                <td>${book.author}</td>
                <td>${book.available_quantity}/${book.total_quantity}</td>
            `;

            row.onclick = () => {

                document.querySelectorAll("#bookTableBody tr")
                    .forEach(r => r.classList.remove("selected"));

                row.classList.add("selected");

                selectedBookId = book.book_id;

            };

            tbody.appendChild(row);

        });

    }

    catch (err) {

        console.error(err);

    }

}

//////////////////// REMOVE BOOK ////////////////////

async function removeRow() {

    if (!selectedBookId) {

        alert("Please select a book.");

        return;

    }

    if (!confirm("Delete this book?")) return;

    try {

        const { error } = await supabaseClient
            .from("books")
            .delete()
            .eq("book_id", selectedBookId);

        if (error) throw error;

        selectedBookId = null;

        loadBooks();

        alert("Book Removed");

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    loadBooks();

});

//////////////////// LOAD STUDENTS ////////////////////

async function loadStudentsDropdown() {

    const select = document.getElementById("issueStudent");

    select.innerHTML = '<option value="">Select Student</option>';

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("users")
        .select("user_id,name")
        .eq("library_id", library_id)
        .eq("role", "student");

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(student => {

        select.innerHTML += `
            <option value="${student.user_id}">
                ${student.name}
            </option>
        `;

    });

}

//////////////////// LOAD BOOKS ////////////////////

async function loadBooksDropdown() {

    const select = document.getElementById("issueBook");

    select.innerHTML = '<option value="">Select Book</option>';

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("books")
        .select("book_id,book_name,available_quantity")
        .eq("library_id", library_id);

    if (error) {

        console.error(error);

        return;

    }

    data.forEach(book => {

        if (book.available_quantity > 0) {

            select.innerHTML += `
                <option value="${book.book_id}">
                    ${book.book_name}
                </option>
            `;

        }

    });

}

async function issueBook() {

    const student_id = Number(document.getElementById("issueStudent").value);

    const book_id = Number(document.getElementById("issueBook").value);

    const issue_date = document.getElementById("issueDate").value;

    const issued_by = Number(localStorage.getItem("user_id"));

    if (!student_id || !book_id || !issue_date) {

        alert("Fill all fields");

        return;

    }

    const due = new Date(issue_date);

    due.setDate(due.getDate() + 15);

    const due_date = due.toISOString().split("T")[0];

    try {

        const { error } = await supabaseClient

            .from("issued_books")

            .insert([{

                student_id,

                book_id,

                issued_by,

                issue_date,

                due_date,

                status: "Issued"

            }]);

        if (error) throw error;



        // Quantity Minus

        const { data: book } = await supabaseClient

            .from("books")

            .select("available_quantity")

            .eq("book_id", book_id)

            .single();

        await supabaseClient

            .from("books")

            .update({

                available_quantity: book.available_quantity - 1

            })

            .eq("book_id", book_id);

        alert("Book Issued");

        closeModal("issueModal");

        loadIssuedBooks();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

async function loadIssuedBooks() {

    const tbody = document.getElementById("IssuereturnTable");

    tbody.innerHTML = "";

    const { data, error } = await supabaseClient

        .from("issued_books")

        .select("*")

        .order("issue_id");

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

window.addEventListener("DOMContentLoaded", () => {

    loadStudentsDropdown();

    loadBooksDropdown();

    loadIssuedBooks();

});
