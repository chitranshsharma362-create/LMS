async function studentLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const library_code = document.getElementById("libcode").value;

  const res = await fetch("http://127.0.0.1:5000/student/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password, library_code })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("student_id", data.student_id);
    localStorage.setItem("student_name", data.name);

    document.getElementById("welcome").innerText = 
      "Welcome " + data.name;

    loadMyBooks();
  } else {
    alert("Invalid credentials");
  }
}


async function loadMyBooks() {
  const student_id = localStorage.getItem("student_id");

  const res = await fetch(`http://127.0.0.1:5000/student/books/${student_id}`);
  const books = await res.json();

  const table = document.getElementById("myBooksTable");
  table.innerHTML = "";

  books.forEach(b => {
    table.innerHTML += `
      <tr>
        <td>${b.book_name}</td>
        <td>${b.author}</td>
        <td>${b.issue_date}</td>
      </tr>
    `;
  });
}

