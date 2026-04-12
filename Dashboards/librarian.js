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

//////////////////// LOAD STUDENTS ////////////////////
async function loadStudents() {
    try {
        console.log("UserID:", window.userId);

        const res = await fetch(`http://127.0.0.1:5000/get_students/${window.userId}`);
        const data = await res.json();

        console.log("Students:", data);

        const table = document.getElementById("studentTable");
        if (!table) return;

        table.innerHTML = "";

        data.forEach(s => {
            table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.course || "-"}</td>
                <td>${s.status || "-"}</td>
                <td>${s.fees || 0}</td>
            </tr>
            `;
        });

    } catch (err) {
        console.error("Load student error:", err);
    }
}

//////////////////// ADD STUDENT ////////////////////
async function addStudent() {
    const name = document.getElementById("studentName")?.value;
    const email = document.getElementById("studentEmail")?.value;
    const password = document.getElementById("studentPassword")?.value;
    const course = document.getElementById("studentCourse")?.value;
    const status = document.getElementById("studentStatus")?.value;
    const fees = document.getElementById("studentFees")?.value;

    if (!name || !email || !password) {
        return alert("Name, Email & Password required ❌");
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/add_student", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                admin_id: window.userId,
                name,
                email,
                password,
                course,
                status,
                fees
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Student Added ✅");

        loadStudents();
        loadStudentDropdown();

        // clear
        document.getElementById("studentName").value = "";
        document.getElementById("studentEmail").value = "";
        document.getElementById("studentPassword").value = "";
        document.getElementById("studentCourse").value = "";
        document.getElementById("studentFees").value = "";

        closeModal("studentModal");

    } catch (err) {
        console.error(err);
        alert("Failed ❌");
    }
}

//////////////////// LOAD BOOKS ////////////////////
async function loadBooks() {
    try {
        const res = await fetch(`http://127.0.0.1:5000/get_books/${window.userId}`);
        const data = await res.json();

        console.log("Books:", data);

        const tableBody = document.getElementById("bookTableBody");
        if (!tableBody) return;

        tableBody.innerHTML = "";

        data.forEach(b => {
            tableBody.innerHTML += `
            <tr>
                <td>${b.isbn}</td>
                <td>${b.book_name}</td>
                <td>${b.author}</td>
                <td>${b.quantity}</td>
            </tr>
            `;
        });

    } catch (err) {
        console.error("Load books error:", err);
    }
}

//////////////////// DROPDOWNS ////////////////////
async function loadStudentDropdown() {
    try {
        const res = await fetch(`http://127.0.0.1:5000/get_students/${window.userId}`);
        const data = await res.json();

        const select = document.getElementById("issueStudent");
        if (!select) return;

        select.innerHTML = `<option value="">Select Student</option>`;

        data.forEach(s => {
            select.innerHTML += `<option value="${s.user_id}">${s.name}</option>`;
        });

    } catch (err) {
        console.error("Student dropdown error:", err);
    }
}

async function loadBookDropdown() {
    try {
        const res = await fetch(`http://127.0.0.1:5000/get_books/${window.userId}`);
        const data = await res.json();

        const select = document.getElementById("issueBook");
        if (!select) return;

        select.innerHTML = `<option value="">Select Book</option>`;

        data.forEach(b => {
            select.innerHTML += `<option value="${b.id}">${b.book_name}</option>`;
        });

    } catch (err) {
        console.error("Book dropdown error:", err);
    }
}

//////////////////// ISSUE BOOK ////////////////////
async function issuebook() {
    const user_id = document.getElementById("issueStudent")?.value;
    const book_id = document.getElementById("issueBook")?.value;
    const date = document.getElementById("issueDate")?.value;
    const status = document.getElementById("issueStatus")?.value;
    const fine = document.getElementById("issueFine")?.value || 0;

    if (!user_id || !book_id || !date) {
        return alert("Fill all fields ❌");
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/issue_book", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_id,
                book_id,
                issue_date: date,
                status,
                fine
            })
        });

        if (!res.ok) throw new Error();

        alert("Book Issued ✅");

        closeModal("issueModal");

        loadIssuedBooks();

    } catch (err) {
        console.error(err);
        alert("Failed ❌");
    }
}

//////////////////// LOAD ISSUED ////////////////////
async function loadIssuedBooks() {
    try {
        const res = await fetch(`http://127.0.0.1:5000/get_issued_books/${window.userId}`);
        const data = await res.json();

        const table = document.getElementById("IssuereturnTable");
        if (!table) return;

        table.innerHTML = "";

        data.forEach(item => {
            table.innerHTML += `
            <tr>
                <td>${item.student}</td>
                <td>${item.book}</td>
                <td>${item.date}</td>
                <td>${item.status}</td>
                <td>${item.fine}</td>
            </tr>
            `;
        });

    } catch (err) {
        console.error("Issue load error:", err);
    }
}

//////////////////// INIT ////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user || !user.user_id) {
        alert("Session expired ❌");
        localStorage.removeItem("loggedUser");
        window.location.href = "../index.html";
        return;
    }

    window.userId = user.user_id;

    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText) {
        welcomeText.innerText = `Welcome ${user.name || "User"}`;
    }

    // 🔥 LOAD EVERYTHING
    loadStudents();
    loadBooks();
    loadStudentDropdown();
    loadBookDropdown();
    loadIssuedBooks();
});
