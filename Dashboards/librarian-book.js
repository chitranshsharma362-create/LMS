async function addBookToDB() {
  try {
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = Number(document.getElementById("bookQty").value);

    const response = await fetch("http://127.0.0.1:5000/add_book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        book_name: name,
        author: author,
        quantity: quantity
      })
    });

    const data = await response.json();

    alert(data.message);

    loadBooks(); // reload table

  } catch (err) {
    console.error(err);
    alert("Book not added ❌");
  }
}
