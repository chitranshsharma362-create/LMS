document.addEventListener("DOMContentLoaded", async function () {

    let container = document.getElementById("libraryContainer");

    try {
        let res = await fetch("http://127.0.0.1:5000/get_libraries");
        let data = await res.json();

        if (data.length === 0) {
            container.innerHTML = "<p>No libraries found 😕</p>";
            return;
        }

        let html = "";

        data.forEach(lib => {
            html += `
            <div class="card">
                <h3>${lib.name}</h3>
                <p>📍 ${lib.city}</p>
                <p>🏠 ${lib.address}</p>
            </div>
            `;
        });

        container.innerHTML = html;

    } catch (err) {
        console.log(err);
        container.innerHTML = "<p>Error loading data ❌</p>";
    }

});
