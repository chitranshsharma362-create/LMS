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
        book_name: name,
        author: author,
        quantity: quantity
      })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    alert(data.message || "Book added ✅");

    // 🔥 UI me turant add karo (NO need loadBooks)
    bookTable.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${author}</td>
        <td>${quantity}</td>
      </tr>
    `;

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
