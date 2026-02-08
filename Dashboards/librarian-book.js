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

let scanner = null;
function extractISBN(text){
  return text.replace(/\D/g,"").slice(0, 13);
}

function fetchBook(isbn){
  fetch(`https://openlibrary.org/search.json?q=${isbn}`)
  .then(res => res.json())
  .then(data => {
    if (!data.docs || data.docs.length === 0) {
      alert("Book not found");
      return;
    }
    const b = data.docs[0];
            document.getElementById("bookName").value = b.title || "";
            document.getElementById("bookAuthor").value =
                b.author_name ? b.author_name.join(", ") : "";
        })
        .catch(() => alert("Network error"));
}

// Manual search
function manualSearch() {
    const raw = document.getElementById("isbnInput").value.trim();
    const isbn = extractISBN(raw);

    if (isbn.length < 10) {
        alert("Valid ISBN enter karo");
        return;
    }
    fetchBook(isbn);
}

// Scan ISBN
document.getElementById("scanBtn").onclick = async () => {
    openModal('bookModal');
    const reader = document.getElementById("reader");
    reader.style.display = "block";

    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }

    await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (text) => {
            const isbn = extractISBN(text);
            if (isbn.length < 10) {
                alert("Valid ISBN nahi mili");
                return;
            }

            fetchBook(isbn);
            scanner.stop();
            reader.style.display = "none";
        }
    );
};
  }
}
