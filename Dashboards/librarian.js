//////////////////// SECTIONS ////////////////////
const sections = document.querySelectorAll(".section");
const menuItems = document.querySelectorAll(".menu li");

function showSection(id, el) {
    sections.forEach(sec => sec.style.display = "none");

    const activeSection = document.getElementById(id);
    if (activeSection) activeSection.style.display = "block";

    menuItems.forEach(item => item.classList.remove("active"));
    if (el) el.classList.add("active");
}

showSection("dashboard", document.querySelector(".menu li"));

//////////////////// MODAL ////////////////////
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}
