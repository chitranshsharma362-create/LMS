document.addEventListener("DOMContentLoaded", () => {
    getLibraries();
});

async function getLibraries() {
    const container = document.getElementById("libraryContainer");

    if (!container) {
        console.error("libraryContainer not found");
        return;
    }

    container.innerHTML = "<p>Finding libraries near you...</p>";

    if (typeof supabaseClient === "undefined") {
        container.innerHTML = "<p>Supabase is not connected.</p>";
        return;
    }

    if (!navigator.geolocation) {
        container.innerHTML = "<p>Location is not supported by your browser.</p>";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            try {
                const { data, error } = await supabaseClient
                    .from("libraries")
                    .select("library_id, library_name, library_code, city, address, lat, lon");

                if (error) throw error;

                if (!data || data.length === 0) {
                    container.innerHTML = "<p>No libraries found.</p>";
                    return;
                }

                const nearbyLibraries = data
                    .filter(lib => lib.lat !== null && lib.lon !== null)
                    .map(lib => {
                        const distance = calculateDistance(
                            userLat,
                            userLon,
                            Number(lib.lat),
                            Number(lib.lon)
                        );

                        return {
                            ...lib,
                            distance
                        };
                    })
                    .filter(lib => lib.distance <= 5)
                    .sort((a, b) => a.distance - b.distance);

                if (nearbyLibraries.length === 0) {
                    container.innerHTML = `
                        <div class="error-message">
                            <p>No libraries found within 5 KM.</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = nearbyLibraries.map(lib => {
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

                            <p>
                                <i class="fa-solid fa-route"></i>
                                ${lib.distance.toFixed(2)} KM away
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
        },
        error => {
            console.error("Location error:", error);

            container.innerHTML = `
                <div class="error-message">
                    <p>Unable to access your location.</p>
                    <small>Please allow location permission and try again.</small>
                </div>
            `;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
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
