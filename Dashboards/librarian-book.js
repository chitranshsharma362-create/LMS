async function addBookToDB() {

    const isbn = document.getElementById("bookIsbn").value.trim();
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = parseInt(document.getElementById("bookQty").value);

    if (!isbn || !name || !author || !quantity) {
        alert("Please fill all fields.");
        return;
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("Please login first.");
        return;
    }
    try {
        const response = await fetch("http://127.0.0.1:5000/add_book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                isbn: isbn,
                book_name: name,
                author: author,
                quantity: quantity
            })
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById("bookIsbn").value = "";
            document.getElementById("bookName").value = "";
            document.getElementById("bookAuthor").value = "";
            document.getElementById("bookQty").value = "";
            closeModal("bookModal");
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error(err);
        alert("Server Error");
    }
}
