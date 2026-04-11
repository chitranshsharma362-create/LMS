const sections = document.querySelectorAll(".section");
const menuItems = document.querySelectorAll(".menu li");

// ✅ Section switch
function showSection(id, el) {
    sections.forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
    menuItems.forEach(item => item.classList.remove("active"));
    el.classList.add("active");
}
showSection("dashboard", document.querySelector(".menu li"));

// ✅ Modal
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// ✅ Student
function addStudent() {
    if (!studentName.value || !studentCourse.value) return alert("Fill all fields");

    studentTable.innerHTML += `
        <tr>
            <td>${studentName.value}</td>
            <td>${studentCourse.value}</td>
            <td>${studentStatus.value}</td>
            <td>${studentFees.value}</td>
        </tr>
    `;

    closeModal("studentModal");
    studentName.value = studentCourse.value = studentFees.value = "";
}

// ✅ Issue Book
function issuebook() {
    if (!issueStudentName.value || !issueBookName.value || !issueDuration.value) {
        return alert("Fill all fields");
    }

    IssuereturnTable.innerHTML += `
        <tr>
            <td>${issueStudentName.value}</td>
            <td>${issueBookName.value}</td>
            <td>${issueDuration.value}</td>
            <td>${issueReturnStatus.value}</td>
            <td>${issueStudentFees.value}</td>
        </tr>
    `;

    closeModal("issueModal");

    issueStudentName.value = "";
    issueBookName.value = "";
    issueDuration.value = "";
    issueStudentFees.value = "";
}

// ✅ Remove row
function removeRow(tableId) {
    const table = document.getElementById(tableId);
    if (table.rows.length > 1) table.deleteRow(-1);
    else alert("No data to remove");
}

// ✅ Login check + UI setup
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    document.getElementById("welcome-text").innerText = `Welcome ${user.name}`;
    document.getElementById("welcome-subtext").innerText =
        "This is your library overview and insight";

    // 🔥 IMPORTANT → user_id global bana diya
    window.userId = user.id;

    if (user.library_name) {
        const formattedName = user.library_name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");

        const logo = document.getElementById("libraryLogo");
        if (logo) logo.innerText = "e" + formattedName + "+";

        document.title = "e" + formattedName + " Dashboard";
    }

    // 🔥 Books load on login
    loadBooks();
});
