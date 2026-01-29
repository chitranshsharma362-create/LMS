async function addBookToDB() {
  try {
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("bookAuthor").value.trim();
    const quantity = Number(document.getElementById("bookQty").value);

    const { error } = await supabaseClient
      .from("books")
      .insert([{ name, author, quantity }]);

    if (error) throw error;

    alert("Successfully Added");
  }
  catch (err) {
    console.error(err);
    alert("Book not Added");
  }
}
