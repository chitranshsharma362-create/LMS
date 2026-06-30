let scanner = null;

function extractISBN(text) {
  return text.replace(/\D/g, "").slice(0, 13);
}

function fetchBook(isbn) {

  fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)

    .then(res => res.json())

    .then(data => {

      if (!data.items || data.items.length === 0) {
        alert("Book not found");
        return;
      }

      const book = data.items[0].volumeInfo;

      document.getElementById("bookIsbn").value = isbn;

      document.getElementById("bookName").value =
        book.title || "";
      document.getElementById("bookAuthor").value =
        book.authors
          ? book.authors.join(", ")
          : "";
    })

    .catch(err => {
      console.error(err);
      alert("Network Error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const reader = document.getElementById("reader");

  scanBtn.addEventListener("click", async () => {
    openModal("bookModal");
    reader.style.display = "block";

    if (!scanner) {
      scanner = new Html5Qrcode("reader");
    }

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (text) => {
        const isbn = extractISBN(text);
        if (isbn.length < 10) return;

        fetchBook(isbn);
        scanner.stop();
        reader.style.display = "none";
      }
    );
  });
});
