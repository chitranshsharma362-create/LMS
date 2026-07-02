let html5QrCode = null;

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

async function onScanSuccess(decodedText) {

    await html5QrCode.stop();
    await html5QrCode.clear();

    html5QrCode = null;

    document.getElementById("reader").style.display = "none";

    const isbn = decodedText.replace(/\D/g, "").substring(0, 13);

    document.getElementById("bookIsbn").value = isbn;

    fetchBook(isbn);

}
