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
            headers: {
                "Content-Type": "application/json"
            },
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

        if (!res.ok) throw new Error(data.message);

        alert("Student Added ✅");

        // 🔥 reload list
        loadStudents();

        // 🔥 clear form
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

//////////////////// ISSUE BOOK (UI ONLY) ////////////////////
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
    if (!table) return;

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

    // ✅ welcome text
    const welcomeText = document.getElementById("welcome-text");
    if (welcomeText) {
        welcomeText.innerText = `Welcome ${user.name || "User"}`;
    }

    const subText = document.getElementById("welcome-subtext");
    if (subText) {
        subText.innerText = "This is your library dashboard";
    }

    // 🔥 load data
    if (typeof loadBooks === "function") {
        loadBooks();
    }

    loadStudents(); // 🔥 important fix
});
