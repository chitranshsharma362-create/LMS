async function addBookToDB() {

    const isbn = document.getElementById("bookIsbn").value.trim();
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = Number(document.getElementById("bookQty").value);

    if (!isbn || !name || !author || !quantity) {
        alert("Fill all fields");
        return;
    }
    const { error } = await supabase
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
        console.log(error);
        alert(error.message);
    } else {
        alert("Book Added Successfully");
        document.getElementById("bookIsbn").value = "";
        document.getElementById("bookName").value = "";
        document.getElementById("bookAuthor").value = "";
        document.getElementById("bookQty").value = "";
        closeModal("bookModal");
    }
}
