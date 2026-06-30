document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("libraryContainer");

    try {

        const { data, error } = await supabaseClient
            .from("libraries")
            .select("library_name, library_code, city, address");

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No libraries found </p>";
            return;
        }

        let html = "";

        data.forEach(lib => {

            html += `
            <div class="card">

                <h3>${lib.library_name}</h3>

                <p> Code: <strong>${lib.library_code}</strong></p>

                <p> ${lib.city ?? "Not Available"}</p>

                <p> ${lib.address ?? "Not Available"}</p>

                <button class="btn"
                    onclick="copyCode('${lib.library_code}')">
                    Copy Code
                </button>

            </div>
            `;

        });

        container.innerHTML = html;

    }

    catch (err) {

        console.error(err);

        container.innerHTML = "<p>Error loading libraries </p>";

    }

});

function copyCode(code) {

    navigator.clipboard.writeText(code);

    alert("Library Code Copied : " + code);

}
