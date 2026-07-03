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

        // ISBN Already Exists

        const { data: existing, error: checkError } = await supabaseClient

            .from("books")

            .select("*")

            .eq("library_id", library_id)

            .eq("isbn", isbn)

            .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {

            const { error } = await supabaseClient

                .from("books")

                .update({

                    total_quantity: existing.total_quantity + quantity,

                    available_quantity: existing.available_quantity + quantity

                })

                .eq("book_id", existing.book_id);

            if (error) throw error;

        }

        else {

            const { error } = await supabaseClient

                .from("books")

                .insert([{

                    library_id,

                    isbn,

                    book_name: name,

                    author,

                    total_quantity: quantity,

                    available_quantity: quantity,

                    category_id: 1

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

    const tbody = document.getElementById("bookTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    const library_id = Number(localStorage.getItem("library_id"));

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

async function removeBook() {

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

        alert("Book Removed Successfully");

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

//////////////////// SUPPORT FUNCTION ////////////////////

function removeRow() {

    removeBook();

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    loadBooks();

});
