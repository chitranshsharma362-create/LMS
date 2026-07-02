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

    // Duplicate ISBN Check
    const { data: existingBook, error: checkError } = await supabaseClient
        .from("books")
        .select("book_id")
        .eq("isbn", isbn)
        .maybeSingle();

    if (checkError) {
        console.log(checkError);
    }

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
                total_quantity: quantity,
                available_quantity: quantity
            }
        ]);

    if (error) {
        console.error(error);
        alert(error.message);
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
        .order("book_id", { ascending: false });

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
            <td>${book.total_quantity}</td>
            <td>
                <button class="btn delete-btn"
                    onclick="deleteBook(${book.book_id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

//////////////////// DELETE BOOK ////////////////////

async function deleteBook(book_id) {

    if (!confirm("Delete this book?")) return;

    const { error } = await supabaseClient
        .from("books")
        .delete()
        .eq("book_id", book_id);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    alert("Book Deleted Successfully ✅");

    loadBooks();

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    loadBooks();

});
