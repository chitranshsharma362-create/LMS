//////////////////// ADD BOOK ////////////////////

async function addBookToDB() {

    const isbn = document.getElementById("bookIsbn").value.trim();
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = parseInt(document.getElementById("bookQty").value);

    if (!isbn || !name || !author || !quantity) {
        alert("Please fill all fields!");
        return;
    }

    // Duplicate ISBN check
    const { data: existingBook } = await supabaseClient
        .from("books")
        .select("id")
        .eq("isbn", isbn)
        .maybeSingle();

    if (existingBook) {
        alert("Book already exists!");
        return;
    }

    const { error } = await supabaseClient
        .from("books")
        .insert([
            {
                isbn: isbn,
                book_name: name,
                author: author,
                quantity: quantity
            }
        ]);

    if (error) {
        console.error(error);
        alert("Book not added ❌");
        return;
    }

    alert("Book Added Successfully ✅");

    document.getElementById("bookIsbn").value = "";
    document.getElementById("bookName").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookQty").value = "";

    closeModal("bookModal");

    loadBooks();
}

//////////////////// LOAD BOOKS ////////////////////

async function loadBooks() {

    const { data, error } = await supabaseClient
        .from("books")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById("bookTableBody");

    tbody.innerHTML = "";

    data.forEach(book => {

        tbody.innerHTML += `
        <tr>
            <td>${book.isbn}</td>
            <td>${book.book_name}</td>
            <td>${book.author}</td>
            <td>${book.quantity}</td>
            <td>
                <button class="btn delete-btn"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

//////////////////// DELETE BOOK ////////////////////

async function deleteBook(id) {

    if (!confirm("Delete this book?")) return;

    const { error } = await supabaseClient
        .from("books")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Delete Failed ❌");
        return;
    }

    alert("Book Deleted ✅");

    loadBooks();

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {
    loadBooks();
});
