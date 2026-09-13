document.addEventListener("DOMContentLoaded", () => {
    getLibraries();
});

async function getLibraries() {

    const container = document.getElementById("libraryContainer");

    if (!container) {
        console.error("libraryContainer not found");
        return;
    }

    container.innerHTML = "<p>Loading libraries...</p>";

    try {

        // Check Supabase
        if (typeof supabaseClient === "undefined") {
            throw new Error("supabaseClient is not defined");
        }

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

        container.innerHTML = data.map(lib => {

            const name = lib.library_name || "Unnamed Library";
            const code = lib.library_code || "N/A";
            const city = lib.city || "Not Available";
            const address = lib.address || "Not Available";

            return `
                <div class="card">

                    <h3>${name}</h3>

                    <p>
                        <span>Library Code:</span>
                        <strong>${code}</strong>
                    </p>

                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${city}
                    </p>

                    <p>
                        <i class="fa-solid fa-map-location-dot"></i>
                        ${address}
                    </p>

                    <button
                        class="btn"
                        onclick="copyCode('${code.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-copy"></i>
                        Copy Code
                    </button>

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error("Error loading libraries:", error);

        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load libraries.</p>
                <small>Please try again later.</small>
            </div>
        `;
    }
}


async function copyCode(code) {

    if (!code || code === "N/A") {
        alert("Library code is not available.");
        return;
    }

    try {

        await navigator.clipboard.writeText(code);

        alert("Library Code Copied: " + code);

    } catch (error) {

        console.error("Copy failed:", error);

        // Fallback copy method
        const textarea = document.createElement("textarea");

        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        try {
            document.execCommand("copy");
            alert("Library Code Copied: " + code);
        } catch (err) {
            alert("Unable to copy library code.");
        }

        document.body.removeChild(textarea);
    }
}


window.getLibraries = getLibraries;
window.copyCode = copyCode;
