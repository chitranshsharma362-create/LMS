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

//////////////////// STUDENT ////////////////////
function addStudent() {
    const name = document.getElementById("studentName")?.value;
    const course = document.getElementById("studentCourse")?.value;
    const status = document.getElementById("studentStatus")?.value;
    const fees = document.getElementById("studentFees")?.value;

    if (!name || !course) {
        return alert("Fill all fields");
    }

    const table = document.getElementById("studentTable");

    table.innerHTML += `
        <tr>
            <td>${name}</td>
            <td>${course}</td>
            <td>${status}</td>
            <td>${fees}</td>
        </tr>
    `;

    closeModal("studentModal");
}

//////////////////// ISSUE BOOK ////////////////////
function issuebook() {
    const student = document.getElementById("issueStudentName")?.value;
    const book = document.getElementById("issueBookName")?.value;
    const duration = document.getElementById("issueDuration")?.value;
    const status = document.getElementById("issueReturnStatus")?.value;
    const fees = document.getElementById("issueStudentFees")?.value;

    if (!student || !book || !duration) {
        return alert("Fill all fields");
    }

    const table = document.getElementById("IssuereturnTable");

    table.innerHTML += `
        <tr>
            <td>${student}</td>
            <td>${book}</td>
            <td>${duration}</td>
            <td>${status}</td>
            <td>${fees}</td>
        </tr>
    `;

    closeModal("issueModal");
}

//////////////////// REMOVE ROW ////////////////////
function removeRow(tableId) {
    const table = document.getElementById(tableId);

    if (!table) return;

    if (table.rows.length > 1) {
        table.deleteRow(-1);
    } else {
        alert("No data to remove");
    }
}

//////////////////// LOGIN CHECK ////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    if (!user.user_id) {
        alert("Session expired ❌ Please login again");
        localStorage.removeItem("loggedUser");
        window.location.href = "../index.html";
        return;
    }

    // 🔥 GLOBAL USER ID
    window.userId = user.user_id;

    // ✅ Welcome text
    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText) {
        welcomeText.innerText = `Welcome ${user.name || "User"}`;
    }

    const subText = document.getElementById("welcome-subtext");
    if (subText) {
        subText.innerText = "This is your library dashboard";
    }

    // 🔥 Load books
    if (typeof loadBooks === "function") {
        loadBooks();
    }
});
