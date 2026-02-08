let scanner = null;

    function extractISBN(text) {
      return text.replace(/\D/g, "").slice(0, 13);
    }

    function fetchBook(isbn) {
      fetch(`https://openlibrary.org/search.json?q=${isbn}`)
        .then(res => res.json())
        .then(data => {
          if (!data.docs || data.docs.length === 0) {
            alert("Book details nahi mili");
            return;
          }

          const b = data.docs[0];

          title.innerText = b.title || "N/A";
          author.innerText = b.author_name ? b.author_name.join(", ") : "N/A";
          publisher.innerText = b.publisher ? b.publisher[0] : "N/A";
          year.innerText = b.first_publish_year || "N/A";

          if (b.cover_i) {
            cover.src = `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`;
          } else {
            cover.src = "";
          }
        })
        .catch(() => alert("Network error"));
    }

    function manualSearch() {
      const raw = document.getElementById("isbnInput").value.trim();
      const isbn = extractISBN(raw);

      if (isbn.length < 10) {
        alert("Valid ISBN enter karo");
        return;
      }
      fetchBook(isbn);
    }

    scanBtn.onclick = async () => {
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
