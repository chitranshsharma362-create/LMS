const sections = document.querySelectorAll(".section");
const menuItems = document.querySelectorAll(".menu li");

// ✅ Section switch
function showSection(id, el) {
    sections.forEach(sec => sec.style.display = "none");

    const activeSection = document.getElementById(id);
    if (activeSection) activeSection.style.display = "block";

    menuItems.forEach(item => item.classList.remove("active"));
    if (el) el.classList.add("active");
}
showSection("dashboard", document.querySelector(".menu li"));

// ✅ Modal
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// ✅ Student
function addStudent() {
    if (!studentName.value || !studentCourse.value) {
        return alert("Fill all fields");
    }

    studentTable.innerHTML += `
        <tr>
            <td>${studentName.value}</td>
            <td>${studentCourse.value}</td>
            <td>${studentStatus.value}</td>
            <td>${studentFees.value}</td>
        </tr>
    `;

    closeModal("studentModal");

    studentName.value = "";
    studentCourse.value = "";
    studentFees.value = "";
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
    if (!table) return;

    if (table.rows.length > 1) {
        table.deleteRow(-1);
    } else {
        alert("No data to remove");
    }
}

// ✅ Login check + setup
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    console.log("Logged User:", user); // 🔥 debug

    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    // 🔥 IMPORTANT FIX (safe check)
    if (!user.user_id) {
        alert("User ID missing ❌ Please login again");
        localStorage.removeItem("loggedUser");
        window.location.href = "../index.html";
        return;
    }

    // ✅ Global userId set
    window.userId = user.user_id;
    console.log("User ID set:", window.userId); // 🔥 debug

    // ✅ Welcome text (safe)
    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText) {
        welcomeText.innerText = `Welcome ${user.name || "User"}`;
    }

    const subText = document.getElementById("welcome-subtext");
    if (subText) {
        subText.innerText = "This is your library overview and insight";
    }

    // ✅ Library branding
    if (user.library_name) {
        const formattedName = user.library_name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join("");

        const logo = document.getElementById("libraryLogo");
        if (logo) logo.innerText = "e" + formattedName + "+";

        document.title = "e" + formattedName + " Dashboard";
    }

    // 🔥 Load books safely
    if (typeof loadBooks === "function") {
        loadBooks();
    } else {
        console.warn("loadBooks() not found");
    }
});
