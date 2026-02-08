let scanner = null;

function extractISBN(text) {
  return text.replace(/\D/g, "").slice(0, 13);
}

function fetchBook(isbn) {
  fetch(`https://openlibrary.org/search.json?q=${isbn}`)
    .then(res => res.json())
    .then(data => {
      if (!data.docs || data.docs.length === 0) {
        alert("Book not found");
        return;
      }

      const b = data.docs[0];
      
      document.getElementById("bookISBN").value = isbn;
      document.getElementById("bookName").value = b.title || "";
      document.getElementById("bookAuthor").value =
        b.author_name ? b.author_name.join(", ") : "";
    })
    .catch(() => alert("Network error"));
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
