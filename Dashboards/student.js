// ================== BASE URL ==================
const BASE_URL = "http://127.0.0.1:5000";


// ================== SECTION SWITCH ==================
function showSection(id, el) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";

  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  if (el) el.classList.add("active");
}


// ================== PAGE LOAD ==================
window.onload = function () {
  const student_id = localStorage.getItem("student_id");
  const student_name = localStorage.getItem("student_name");

  // 🔒 अगर login nahi hai
  if (!student_id) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  // 👤 Welcome + Profile
  if (student_name) {
    document.getElementById("welcome").innerText = "Welcome " + student_name;
    document.getElementById("studentName").innerText = student_name;
  }

  // 📚 Load data
  loadMyBooks();
  loadProfile();
};


// ================== LOAD BOOKS ==================
async function loadMyBooks() {
  try {
    const student_id = localStorage.getItem("student_id");

    const res = await fetch(`${BASE_URL}/student/books/${student_id}`);
    const books = await res.json();

    const table = document.getElementById("myBooksTable");
    table.innerHTML = "";

    let total = 0;
    let returned = 0;
    let pending = 0;

    if (books.length === 0) {
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

      if (status.toLowerCase() === "returned") {
        returned++;
      } else {
        pending++;
      }
    });

    // 📊 Update stats
    document.getElementById("totalBooks").innerText = total;
    document.getElementById("returnedBooks").innerText = returned;
    document.getElementById("pendingBooks").innerText = pending;

  } catch (err) {
    console.error("Error loading books:", err);
    alert("Failed to load books");
  }
}


// ================== LOAD PROFILE ==================
async function loadProfile() {
  try {
    const student_id = localStorage.getItem("student_id");

    const res = await fetch(`${BASE_URL}/student/profile/${student_id}`);
    const data = await res.json();

    // 🧾 Fill profile
    document.getElementById("studentEmail").value = data.email || "";
    document.getElementById("rollNo").value = data.roll_no || "";
    document.getElementById("semester").value = data.semester || "";
    document.getElementById("department").value = data.department || "";

  } catch (err) {
    console.error("Profile load error:", err);
  }
}


// ================== EDIT PROFILE ==================
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
      // 💾 SAVE PROFILE
      await saveProfile();
    }

    editBtn.innerText = isEditing ? "Save Profile" : "Edit Profile";
  });
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

    alert("Profile updated successfully");

  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to update profile");
  }
}


// ================== LOGOUT ==================
function logout() {
  localStorage.removeItem("student_id");
  localStorage.removeItem("student_name");

  window.location.href = "../index.html";
}
