// ================== DEBUG ==================
console.log("✅ student.js loaded");

// ================== BASE URL ==================
const BASE_URL = "http://127.0.0.1:5000";


// ================== SECTION SWITCH ==================
function showSection(id, el = null) {
  console.log("Switching to:", id);

  const sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.style.display = "none");

  const target = document.getElementById(id);
  if (target) target.style.display = "block";

  const menuItems = document.querySelectorAll(".menu li");
  menuItems.forEach(li => li.classList.remove("active"));

  if (el) el.classList.add("active");
}


// ================== SAFE DOM LOAD ==================
document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ DOM ready");

  const student_id = localStorage.getItem("student_id");
  const student_name = localStorage.getItem("student_name");

  // 🔒 Login check
  if (!student_id) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  // 👤 Welcome
  if (student_name) {
    const welcome = document.getElementById("welcome");
    const nameBox = document.getElementById("studentName");

    if (welcome) welcome.innerText = "Welcome " + student_name;
    if (nameBox) nameBox.innerText = student_name;
  }

  // 📚 Load data
  loadMyBooks();
  loadProfile();

  // ================== MENU CLICK (BACKUP METHOD) ==================
  document.querySelectorAll(".menu li").forEach(item => {
    item.addEventListener("click", function () {
      const text = this.innerText.toLowerCase();

      if (text.includes("dashboard")) showSection("dashboard", this);
      else if (text.includes("my books")) showSection("mybooks", this);
      else if (text.includes("history")) showSection("history", this);
      else if (text.includes("profile")) showSection("profile", this);
      else if (text.includes("notifications")) showSection("notifications", this);
    });
  });

  // ================== EDIT BUTTON ==================
  const editBtn = document.getElementById("editBtn");
  let isEditing = false;

  if (editBtn) {
    editBtn.addEventListener("click", async () => {
      const inputs = document.querySelectorAll("#profileForm input");

      isEditing = !isEditing;

      inputs.forEach(input => {
        input.readOnly = !isEditing;
      });

      if (!isEditing) {
        await saveProfile();
      }

      editBtn.innerText = isEditing ? "Save Profile" : "Edit Profile";
    });
  }

});


// ================== LOAD BOOKS ==================
async function loadMyBooks() {
  try {
    const student_id = localStorage.getItem("student_id");

    const res = await fetch(`${BASE_URL}/student/books/${student_id}`);
    const books = await res.json();

    const table = document.getElementById("myBooksTable");
    if (!table) return;

    table.innerHTML = "";

    let total = 0;
    let returned = 0;
    let pending = 0;

    if (!books || books.length === 0) {
      table.innerHTML = `<tr><td colspan="4">No books issued</td></tr>`;
      return;
    }

    books.forEach(b => {
      const status = b.status || "Issued";

      table.innerHTML += `
        <tr>
          <td>${b.book_name}</td>
          <td>${b.author}</td>
          <td>${b.issue_date}</td>
          <td>${status}</td>
        </tr>
      `;

      total++;

      if (status.toLowerCase() === "returned") returned++;
      else pending++;
    });

    // 📊 Stats update
    const totalEl = document.getElementById("totalBooks");
    const returnedEl = document.getElementById("returnedBooks");
    const pendingEl = document.getElementById("pendingBooks");

    if (totalEl) totalEl.innerText = total;
    if (returnedEl) returnedEl.innerText = returned;
    if (pendingEl) pendingEl.innerText = pending;

  } catch (err) {
    console.error("❌ Error loading books:", err);
  }
}


// ================== LOAD PROFILE ==================
async function loadProfile() {
  try {
    const student_id = localStorage.getItem("student_id");

    const res = await fetch(`${BASE_URL}/student/profile/${student_id}`);
    const data = await res.json();

    const email = document.getElementById("studentEmail");
    const roll = document.getElementById("rollNo");
    const sem = document.getElementById("semester");
    const dept = document.getElementById("department");

    if (email) email.value = data.email || "";
    if (roll) roll.value = data.roll_no || "";
    if (sem) sem.value = data.semester || "";
    if (dept) dept.value = data.department || "";

  } catch (err) {
    console.error("❌ Profile error:", err);
  }
}


// ================== SAVE PROFILE ==================
async function saveProfile() {
  try {
    const student_id = localStorage.getItem("student_id");

    const data = {
      email: document.getElementById("studentEmail").value,
      roll_no: document.getElementById("rollNo").value,
      semester: document.getElementById("semester").value,
      department: document.getElementById("department").value
    };

    await fetch(`${BASE_URL}/student/profile/${student_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    alert("Profile updated");

  } catch (err) {
    console.error("❌ Save error:", err);
  }
}


// ================== LOGOUT ==================
function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
