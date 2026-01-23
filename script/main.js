fetch("header.html")
    .then(Response => Response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        let currentPage = window.location.pathname.split("/").pop();
        let links = document.querySelectorAll(".menu .menubar ul li a");
        if (!currentPage || currentPage == "#") {
            currentPage = "home.html"
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

document.addEventListener("click", function (e) {
     if (e.target.id === "loginBtn") {
        document.querySelector(".box").classList.add("show");
        document.querySelector(".form-overlay").classList.add("show");
    }

    if (e.target.classList.contains("form-overlay")) {
        document.querySelector(".box").classList.remove("show");
        document.querySelector(".form-overlay").classList.remove("show");
    }
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
