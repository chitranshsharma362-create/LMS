async function addBookToDB() {
  const name = document.getElementById("bookName").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const quantity = document.getElementById("bookQty").value;

  const {error} = await supabase
  .from("books")
  .insert([
    {
      name: name,
      author: author,
      quantity: quantity
    }
    ]);

if (error) {
  alert("Book not Added");
  return;
}

alert("Successfully Added");
}
