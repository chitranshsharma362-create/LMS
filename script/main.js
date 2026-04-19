fetch("header.html")
    .then(Response => Response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        let currentPage = window.location.pathname.split("/").pop();
        let links = document.querySelectorAll(".menu .menubar ul li a");

        if (!currentPage || currentPage == "#") {
            currentPage = "index.html"
        }

        links.forEach(link => {
            console.log("current Page:", currentPage);
            let linkPage = link.getAttribute("href");
            if (linkPage == currentPage) {
                link.closest("li").classList.add("underline_current");
            }
        })
    });

fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    });

fetch("about-section.html")
    .then(Response => Response.text())
    .then(data => {
        document.getElementById("about-section").innerHTML = data;
    });

fetch("features-section.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("features-section").innerHTML = data;
    });

fetch("contact-section.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("contact-section").innerHTML = data;
    });

fetch("form.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("login-form").innerHTML = data;
    });

document.addEventListener("click", function (e) {

    const loginBtn = document.getElementById("loginBtn");
    const dropdown = document.getElementById("loginDropdown");
    const box = document.querySelector(".box");
    const box1 = document.querySelector(".box1");
    const box2 = document.querySelector(".box2");
    const box3 = document.querySelector(".box3");
    const overlay = document.querySelector(".form-overlay");

    if (!loginBtn || !dropdown || !box || !box1 || !box2 || !box3 || !overlay) return;

    if (e.target === loginBtn) {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        return;
    }

    
   if (e.target.id === "librarian-form") {
    e.preventDefault();
    box.classList.add("show");
    overlay.classList.add("show");
    box3.classList.remove("show");
    dropdown.classList.remove("show");
    return;
}

    if (e.target.id === "student-form") {
        e.preventDefault();
        box1.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }

    if (e.target.id === "teacher-form") {
        e.preventDefault();
        box2.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }

     if (e.target.id === "librarian-login-form") {
        e.preventDefault();
        box3.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }
    
    if (e.target.classList.contains("form-overlay")) {
        box.classList.remove("show");
        box1.classList.remove("show");
        box2.classList.remove("show");
        box3.classList.remove("show");
        overlay.classList.remove("show");
        return;
    }
    dropdown.classList.remove("show");
});

let scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function getLibraries() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported ❌");
        return;
    }

    navigator.geolocation.getCurrentPosition(async function(pos) {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        // 🔥 Overpass query
        let query = `
        [out:json];
        (
          node["amenity"="library"](around:5000,${lat},${lon});
        );
        out;
        `;

        let url = "https://overpass-api.de/api/interpreter";

        try {
            let response = await fetch(url, {
                method: "POST",
                body: query
            });

            let data = await response.json();

            // 🔥 data save (localStorage)
            localStorage.setItem("libraries", JSON.stringify(data.elements));

            // redirect to page
            window.location.href = "nearby.html";

        } catch (error) {
            alert("Error fetching libraries ❌");
            console.log(error);
        }

    }, function() {
        alert("Location access denied ❌");
    });
}
