document.addEventListener("DOMContentLoaded", function() {
    let container = document.querySelector(".grid");
    let libraries = JSON.parse(localStorage.getItem("libraries")) || [];

    if (libraries.length === 0) {
        container.innerHTML = "<p>No libraries found 😕</p>";
        return;
    }

    let html = "";

    libraries.forEach(lib => {
        html += `
        <div class="card">
            <h3>${lib.tags?.name || "Library"}</h3>
            <p>📍 Nearby location</p>
            <p class="distance">Within 5 KM</p>
        </div>`;
    });

    container.innerHTML = html;
});
