async function getLibraries() {

    const container = document.getElementById("libraryContainer");

    if (!container) {
        console.error("libraryContainer not found");
        return;
    }

    container.innerHTML = "<p>Loading libraries...</p>";

    try {

        const { data, error } = await supabaseClient
            .from("libraries")
            .select("library_name, library_code, city, address");

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            container.innerHTML = "<p>No libraries found.</p>";
            return;
        }

        let html = "";

        data.forEach(lib => {

            html += `
                <div class="card">

                    <h3>${lib.library_name ?? "Unnamed Library"}</h3>

                    <p>
                        Code:
                        <strong>${lib.library_code ?? "N/A"}</strong>
                    </p>

                    <p>
                        ${lib.city ?? "Not Available"}
                    </p>

                    <p>
                        ${lib.address ?? "Not Available"}
                    </p>

                    <button
                        class="btn"
                        onclick="copyCode('${lib.library_code ?? ""}')">
                        Copy Code
                    </button>

                </div>
            `;
        });

        container.innerHTML = html;

    } catch (err) {

        console.error("Error loading libraries:", err);

        container.innerHTML =
            "<p>Error loading libraries. Please try again.</p>";
    }
}

async function copyCode(code) {

    try {

        await navigator.clipboard.writeText(code);

        alert("Library Code Copied: " + code);

    } catch (err) {

        console.error("Copy failed:", err);

        alert("Unable to copy library code.");
    }
}

window.getLibraries = getLibraries;
window.copyCode = copyCode;
