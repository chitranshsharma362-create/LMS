async function addBookToDB() {
  const name = document.getElementById("").value;
  const author = document.getElementById("").value;
  const quantity = document.getElementById("").value;

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
