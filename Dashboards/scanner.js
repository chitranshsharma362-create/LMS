let html5QrCode = null;

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    const scanBtn = document.getElementById("scanBtn");

    if (!scanBtn) {
        console.log("Scan button not found");
        return;
    }

    scanBtn.addEventListener("click", () => {

        openModal("bookModal");

        setTimeout(() => {
            startScanner();
        }, 500);

    });

});

//////////////////// START SCANNER ////////////////////

async function startScanner() {

    const reader = document.getElementById("reader");

    reader.style.display = "block";

    if (html5QrCode) return;

    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(

            { facingMode: "environment" },

            {
                fps: 10,
                qrbox: 250
            },

            onScanSuccess

        );

    } catch (err) {

        console.error(err);

        alert("Camera could not start.");

    }

}

//////////////////// SCAN SUCCESS ////////////////////

async function onScanSuccess(decodedText) {

    if (html5QrCode) {

        await html5QrCode.stop();
        await html5QrCode.clear();
        html5QrCode = null;

    }

    document.getElementById("reader").style.display = "none";

    const isbn = decodedText.replace(/\D/g, "");

    console.log("Scanned ISBN :", isbn);

    if (isbn.length !== 10 && isbn.length !== 13) {

        alert("Invalid ISBN");

        return;

    }

    fetchBookDetails(isbn);

}

//////////////////// FETCH BOOK DETAILS ////////////////////

async function fetchBookDetails(isbn) {

    document.getElementById("bookIsbn").value = isbn;

    try {

        // ================= GOOGLE BOOKS =================

        let response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );

        let data = await response.json();

        if (data.items && data.items.length > 0) {

            const book = data.items[0].volumeInfo;

            document.getElementById("bookName").value =
                book.title || "";

            document.getElementById("bookAuthor").value =
                book.authors ? book.authors.join(", ") : "";

            console.log("Google Books API Success");

            return;

        }

        console.log("Google Books Not Found");



        // ================= OPEN LIBRARY =================

        response = await fetch(
            `https://openlibrary.org/isbn/${isbn}.json`
        );

        if (response.ok) {

            data = await response.json();

            document.getElementById("bookName").value =
                data.title || "";

            if (data.authors && data.authors.length > 0) {

                const authorResponse = await fetch(
                    `https://openlibrary.org${data.authors[0].key}.json`
                );

                const author = await authorResponse.json();

                document.getElementById("bookAuthor").value =
                    author.name || "";

            } else {

                document.getElementById("bookAuthor").value = "";

            }

            console.log("Open Library API Success");

            return;

        }

        alert("Book Not Found");

        document.getElementById("bookName").value = "";
        document.getElementById("bookAuthor").value = "";

    }

    catch (err) {

        console.error(err);

        alert("Book details fetch failed.");

    }

}
