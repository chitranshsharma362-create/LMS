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
