async function addBookToDB() {
  const name = document.getElementById("bookName").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const quantity = document.getElementById("bookQty").value;

  const { error: insertError } = await supabaseClient
      .from("books")
      .insert([
        {
          name,
          author,
          quantity
        }
      ]);

if (error) {
  alert("Book not Added");
  return;
}

alert("Successfully Added");
}
