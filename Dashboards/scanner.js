let html5QrCode = null;

const scanBtn = document.getElementById("scanBtn");
const reader = document.getElementById("reader");

scanBtn.addEventListener("click", startScanner);

function startScanner() {

    reader.style.display = "block";

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (!cameras.length) {
                alert("No Camera Found");
                return;
            }

            html5QrCode.start(

                { facingMode: "environment" },

                {
                    fps: 10,
                    qrbox: 250
                },

                onScanSuccess,

                () => { }

            );

        })

        .catch(err => {
            console.log(err);
            alert("Camera Error");
        });

}

async function onScanSuccess(decodedText) {

    await html5QrCode.stop();

    reader.style.display = "none";

    let isbn = decodedText.replace(/\D/g, "");

    if (isbn.length > 13)
        isbn = isbn.substring(0,13);

    document.getElementById("bookIsbn").value = isbn;

    fetchBook(isbn);

}

async function fetchBook(isbn){

    try{

        const response = await fetch(
            `https://openlibrary.org/isbn/${isbn}.json`
        );

        if(!response.ok){

            alert("Book Not Found");

            return;
        }

        const book = await response.json();

        document.getElementById("bookName").value =
            book.title || "";

        if(book.authors && book.authors.length){

            const authorRes = await fetch(
                "https://openlibrary.org" +
                book.authors[0].key +
                ".json"
            );

            const authorData = await authorRes.json();

            document.getElementById("bookAuthor").value =
                authorData.name || "";

        }

    }

    catch(err){

        console.log(err);

        alert("Error Fetching Book");

    }

}
