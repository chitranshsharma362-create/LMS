let html5QrCode = null;

const scanBtn = document.getElementById("scanBtn");

scanBtn.addEventListener("click", () => {

    openModal("bookModal");

    setTimeout(() => {
        startScanner();
    }, 300);

});

function startScanner() {

    const reader = document.getElementById("reader");

    reader.style.display = "block";

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        onScanSuccess,
        () => { }
    ).catch(err => {
        console.log(err);
        alert("Camera Error");
    });

}

async function onScanSuccess(decodedText) {

    await html5QrCode.stop();
    await html5QrCode.clear();

    html5QrCode = null;

    document.getElementById("reader").style.display = "none";

    const isbn = decodedText.replace(/\D/g, "").substring(0,13);

    document.getElementById("bookIsbn").value = isbn;

    fetchBook(isbn);

}

async function fetchBook(isbn){

    //-----------------------------
    // 1 GOOGLE BOOKS
    //-----------------------------

    try{

        let res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );

        let data = await res.json();

        if(data.totalItems > 0){

            const book = data.items[0].volumeInfo;

            document.getElementById("bookName").value =
                book.title || "";

            document.getElementById("bookAuthor").value =
                book.authors ? book.authors.join(", ") : "";

            return;

        }

    }

    catch(err){

        console.log("Google Books Error",err);

    }

    //-----------------------------
    // 2 OPEN LIBRARY
    //-----------------------------

    try{

        let res = await fetch(
            `https://openlibrary.org/isbn/${isbn}.json`
        );

        if(res.ok){

            let book = await res.json();

            document.getElementById("bookName").value =
                book.title || "";

            if(book.authors){

                let authorRes = await fetch(
                    "https://openlibrary.org"+
                    book.authors[0].key+
                    ".json"
                );

                let author = await authorRes.json();

                document.getElementById("bookAuthor").value =
                    author.name || "";

            }

            return;

        }

    }

    catch(err){

        console.log("Open Library Error",err);

    }

    //-----------------------------
    // BOOK NOT FOUND
    //-----------------------------

    alert("Book Not Found.\nPlease enter details manually.");

}
