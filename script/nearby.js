document.addEventListener("DOMContentLoaded", () => {
    getLibraries();
});

const RADIUS_KM = 5;

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
                const [dbLibraries, osmLibraries] = await Promise.all([
                    getDatabaseLibraries(userLat, userLon),
                    getOSMLibraries(userLat, userLon)
                ]);

                const allLibraries = mergeLibraries(dbLibraries, osmLibraries);

                if (allLibraries.length === 0) {
                    container.innerHTML = `
                        <div class="error-message">
                            <p>No libraries found within 5 KM.</p>
                            <small>Try searching from another location.</small>
                        </div>
                    `;
                    return;
                }

                allLibraries.sort((a, b) => a.distance - b.distance);

                container.innerHTML = allLibraries
                    .map(createLibraryCard)
                    .join("");

            } catch (error) {
                console.error("Error loading nearby libraries:", error);

                container.innerHTML = `
                    <div class="error-message">
                        <p>Unable to load nearby libraries.</p>
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

async function getDatabaseLibraries(userLat, userLon) {
    const { data, error } = await supabaseClient
        .from("libraries")
        .select("library_id, library_name, library_code, city, address, lat, lon");

    if (error) throw error;

    if (!data) return [];

    return data
        .filter(lib => lib.lat !== null && lib.lon !== null)
        .map(lib => {
            const distance = calculateDistance(
                userLat,
                userLon,
                Number(lib.lat),
                Number(lib.lon)
            );

            return {
                id: `db-${lib.library_id}`,
                name: lib.library_name || "Unnamed Library",
                code: lib.library_code || "N/A",
                city: lib.city || "Not Available",
                address: lib.address || "Not Available",
                lat: Number(lib.lat),
                lon: Number(lib.lon),
                distance,
                source: "database",
                registered: true
            };
        })
        .filter(lib => lib.distance <= RADIUS_KM);
}

async function getOSMLibraries(userLat, userLon) {
    const radiusMeters = RADIUS_KM * 1000;

    const query = `
        [out:json][timeout:25];
        (
            node["amenity"="library"](around:${radiusMeters},${userLat},${userLon});
            way["amenity"="library"](around:${radiusMeters},${userLat},${userLon});
            relation["amenity"="library"](around:${radiusMeters},${userLat},${userLon});
        );
        out center tags;
    `;

    const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "data=" + encodeURIComponent(query)
        }
    );

    if (!response.ok) {
        throw new Error("OpenStreetMap request failed");
    }

    const result = await response.json();

    if (!result.elements) return [];

    return result.elements
        .map(place => {
            const lat = place.lat ?? place.center?.lat;
            const lon = place.lon ?? place.center?.lon;

            if (lat === undefined || lon === undefined) {
                return null;
            }

            const tags = place.tags || {};

            const distance = calculateDistance(
                userLat,
                userLon,
                Number(lat),
                Number(lon)
            );

            return {
                id: `osm-${place.type}-${place.id}`,
                name: tags.name || "Library",
                code: null,
                city: tags["addr:city"] || "",
                address: buildOSMAddress(tags),
                lat: Number(lat),
                lon: Number(lon),
                distance,
                source: "osm",
                registered: false
            };
        })
        .filter(lib => lib !== null && lib.distance <= RADIUS_KM);
}

function mergeLibraries(dbLibraries, osmLibraries) {
    const result = [...dbLibraries];

    osmLibraries.forEach(osmLibrary => {
        const duplicate = dbLibraries.some(dbLibrary => {
            const distance = calculateDistance(
                dbLibrary.lat,
                dbLibrary.lon,
                osmLibrary.lat,
                osmLibrary.lon
            );

            const sameName =
                normalizeName(dbLibrary.name) ===
                normalizeName(osmLibrary.name);

            return distance <= 0.15 && sameName;
        });

        if (!duplicate) {
            result.push(osmLibrary);
        }
    });

    return result;
}

function createLibraryCard(lib) {
    const distance =
        lib.distance < 1
            ? `${Math.round(lib.distance * 1000)} m away`
            : `${lib.distance.toFixed(2)} KM away`;

    const badge = lib.registered
        ? `<span class="library-badge registered">LMS Registered</span>`
        : `<span class="library-badge nearby">Nearby Library</span>`;

    const codeHTML = lib.registered
        ? `
            <p>
                <span>Library Code:</span>
                <strong>${escapeHTML(lib.code)}</strong>
            </p>
        `
        : "";

    const address =
        lib.address || lib.city || "Address not available";

    return `
        <div class="card">
            <div class="card-top">
                <i class="fa-solid fa-book-open-reader"></i>
                ${badge}
            </div>

            <h3>${escapeHTML(lib.name)}</h3>

            ${codeHTML}

            <p>
                <i class="fa-solid fa-location-dot"></i>
                ${escapeHTML(address)}
            </p>

            <p>
                <i class="fa-solid fa-route"></i>
                ${distance}
            </p>

            <div class="card-buttons">
                ${
                    lib.registered
                        ? `
                            <button
                                class="btn"
                                onclick="copyCode('${escapeAttribute(lib.code)}')">
                                <i class="fa-solid fa-copy"></i>
                                Copy Code
                            </button>
                        `
                        : ""
                }

                <button
                    class="btn direction-btn"
                    onclick="openDirections(${lib.lat}, ${lib.lon})">
                    <i class="fa-solid fa-diamond-turn-right"></i>
                    Directions
                </button>
            </div>
        </div>
    `;
}

function buildOSMAddress(tags) {
    const parts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:suburb"],
        tags["addr:city"]
    ].filter(Boolean);

    return parts.join(", ");
}

function normalizeName(name) {
    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return earthRadius * c;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function openDirections(lat, lon) {
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
        "_blank"
    );
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

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

window.getLibraries = getLibraries;
window.copyCode = copyCode;
window.openDirections = openDirections;
