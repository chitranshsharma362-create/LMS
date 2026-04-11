async function addBookToDB(event) {
    if (event) event.preventDefault();

    const name = bookName.value.trim();
    const author = bookAuthor.value.trim();
    const quantity = bookQty.value;

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
                user_id: window.userId, // 🔥 user link
                book_name: name,
                author: author,
                quantity: quantity
            })
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        alert(data.message || "Book added ✅");

        // ✅ UI update
        addBookToTable(name, author, quantity);

        closeModal("bookModal");

        // clear inputs
        bookName.value = "";
        bookAuthor.value = "";
        bookQty.value = "";

    } catch (err) {
        console.error(err);
        alert("Book not added ❌");
    }
}

// ✅ Table render function
function addBookToTable(name, author, quantity) {
    bookTable.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${author}</td>
            <td>${quantity}</td>
        </tr>
    `;
}

// ✅ Load books from DB
async function loadBooks() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_books/${window.userId}`);
        const data = await response.json();

        bookTable.innerHTML = "";

        data.forEach(book => {
            addBookToTable(book.book_name, book.author, book.quantity);
        });

    } catch (err) {
        console.error("Error loading books:", err);
    }
}
