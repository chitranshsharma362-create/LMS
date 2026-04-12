//////////////////// ADD BOOK ////////////////////
async function addBookToDB(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("bookName")?.value.trim();
    const author = document.getElementById("bookAuthor")?.value.trim();
    const quantity = document.getElementById("bookQty")?.value;
    const isbn = document.getElementById("bookIsbn").values;

    if (!name || !author || !quantity) {
        return alert("Fill all fields");
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/add_book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: window.userId,
                book_name: name,
                author: author,
                quantity: quantity,
                isbn: isbn
            })
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        alert(data.message || "Book added ✅");

        // 🔥 Reload from DB (BEST PRACTICE)
        loadBooks();

        closeModal("bookModal");

        // clear inputs
        document.getElementById("bookName").value = "";
        document.getElementById("bookAuthor").value = "";
        document.getElementById("bookQty").value = "";

    } catch (err) {
        console.error(err);
        alert("Book not added ❌");
    }
}

//////////////////// LOAD BOOKS ////////////////////
async function loadBooks() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_books/${window.userId}`);
        const data = await response.json();

        const table = document.getElementById("bookTable");
        if (!table) return;

        table.innerHTML = "";

        data.forEach(book => {
            table.innerHTML += `
            <tr>
                <td>${book.isbn}</td>
                <td>${book.book_name}</td>
                <td>${book.author}</td>
                <td>${book.quantity}</td>
                <td>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                </td>
            </tr>
            `;
        });

    } catch (err) {
        console.error("Error loading books:", err);
    }
}

//////////////////// DELETE BOOK ////////////////////
async function deleteBook(id) {
    try {
        await fetch(`http://127.0.0.1:5000/delete_book/${id}`, {
            method: "DELETE"
        });

        // 🔥 reload
        loadBooks();

    } catch (err) {
        console.error(err);
        alert("Delete failed ❌");
    }
}
