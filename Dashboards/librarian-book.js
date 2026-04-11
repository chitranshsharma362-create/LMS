async function addBookToDB(event) {
  if (event) event.preventDefault(); 

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


    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    
    alert(data.message || "Book added Successfully");

    
    document.getElementById("bookName").value = "";
    document.getElementById("bookAuthor").value = "";
    document.getElementById("bookQty").value = "";

    
    await loadBooks();

  } catch (err) {
    console.error("Error:", err);
    alert("Book not added ");
  }
}
