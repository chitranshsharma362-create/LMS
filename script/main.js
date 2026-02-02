
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    let currentPage = window.location.pathname.split("/").pop();
    if (!currentPage || currentPage === "#") currentPage = "home.html";

    let links = document.querySelectorAll(".menu .menubar ul li a");
    links.forEach(link => {
      let linkPage = link.getAttribute("href");
      if (linkPage === currentPage) {
        link.closest("li").classList.add("underline_current");
      }
    });
  });

fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

fetch("about-section.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("about-section").innerHTML = data;
  });

fetch("features-section.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("features-section").innerHTML = data;
  });

fetch("contact-section.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("contact-section").innerHTML = data;
  });

fetch("form.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("login-form").innerHTML = data;
  });


document.addEventListener("click", function (e) {

  const loginBtn = document.getElementById("loginBtn");
  const dropdown = document.getElementById("loginDropdown");
  const box = document.querySelector(".box");
  const overlay = document.querySelector(".form-overlay");
  const forms = document.querySelectorAll(".loginForm");

  if (!loginBtn || !dropdown || !box || !overlay) return;

  if (e.target === loginBtn) {
    e.stopPropagation();
    dropdown.classList.toggle("show");
    return;
  }
  function openForm(formId) {
    forms.forEach(form => form.style.display = "none");

    const activeForm = document.getElementById(formId);
    if (activeForm) {
      activeForm.style.display = "block";
      box.classList.add("show");
      overlay.classList.add("show");
      dropdown.classList.remove("show");
    }
  }
  if (e.target.id === "student-form") {
    e.preventDefault();
    openForm("studentForm");
    return;
  }
  if (e.target.id === "teacher-form") {
    e.preventDefault();
    openForm("teacherForm");
    return;
  }
  if (e.target.id === "librarian-form") {
    e.preventDefault();
    openForm("librarianForm");
    return;
  }

  if (e.target.classList.contains("form-overlay")) {
    box.classList.remove("show");
    overlay.classList.remove("show");
    return;
  }

  dropdown.classList.remove("show");
});

const scrollBtn = document.getElementById("scrollTopBtn");

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
