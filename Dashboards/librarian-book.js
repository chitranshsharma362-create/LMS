async function addBookToDB() {
  try {
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = Number(document.getElementById("bookQty").value);

    const { error } = await supabaseClient
       .from("books")
  .insert([{
    "book name": name,
    "author name": author,
    quantity: quantity}]);

    if (error) throw error;
    addBook();
    closeModal("bookModal");
    alert("Successfully Added");
  }
  catch (err) {
    console.error(err);
    alert("Book not Added");
  }
}

async function loadBooks() {

    const { data, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {
        console.error("Error loading books:", error);
        return;
    }

    const table = document.getElementById("bookTable");

    data.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book["book name"]}</td>
            <td>${book["author name"]}</td>
            <td>${book.quantity}</td>
        `;

        table.appendChild(row);
    });
}
