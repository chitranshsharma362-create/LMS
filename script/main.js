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
    const overlay = document.querySelector(".form-overlay");

    if (!loginBtn || !dropdown || !box || !overlay) return;

    if (e.target === loginBtn) {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        return;
    }

    if (e.target.id === "student-form") {
        e.preventDefault();
        box.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }

    if (e.target.id === "teacher-form") {
        e.preventDefault();
        box.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }

    if (e.target.id === "librarian-form") {
        e.preventDefault();
        box.classList.add("show");
        overlay.classList.add("show");
        dropdown.classList.remove("show");
        return;
    }
    
    if (e.target.classList.contains("form-overlay")) {
        box.classList.remove("show");
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

