const sections = document.querySelectorAll(".section");
        const menuItems = document.querySelectorAll(".menu li");

        function showSection(id, el) {
            sections.forEach(sec => sec.style.display = "none");
            document.getElementById(id).style.display = "block";
            menuItems.forEach(item => item.classList.remove("active"));
            el.classList.add("active");
        }
        showSection("dashboard", document.querySelector(".menu li"));

        function openModal(id) {
            document.getElementById(id).style.display = "flex";
        }
        function closeModal(id) {
            document.getElementById(id).style.display = "none";
        }

        function addBook() {
            if (!bookName.value || !bookAuthor.value || !bookQty.value) return alert("Fill all fields");
            bookTable.innerHTML += `<tr><td>${bookName.value}</td><td>${bookAuthor.value}</td><td>${bookQty.value}</td></tr>`;
            closeModal("bookModal");
            bookName.value = bookAuthor.value = bookQty.value = "";
        }

        function addStudent() {
            if (!studentName.value || !studentCourse.value) return alert("Fill all fields");
            studentTable.innerHTML += `<tr><td>${studentName.value}</td><td>${studentCourse.value}</td><td>${studentStatus.value}</td><td>${studentFees.value}</td></tr>`;
            closeModal("studentModal");
            studentName.value = studentCourse.value = studentFees.value = "";
        }

        function issuebook() {
            if (!issueStudentName.value || !issueBookName || !issueDuration) return alert("Fill all fields");
            IssuereturnTable.innerHTML += `<tr><td>${issueStudentName.value}</td><td>${issueBookName.value}</td><td>${issueDuration.value}</td><td>${issueReturnStatus.value}</td><td>${issueStudentFees.value}</td></tr>`;
            closeModal("issueModal");
            issueStudentName.value = issueBookName.value = issueDuration.value = issueStudentFees.value = "";
        }

        function removeRow(tableId) {
            const table = document.getElementById(tableId);
            if (table.rows.length > 1) table.deleteRow(-1);
            else alert("No data to remove");
        }

        function StartScanner() {
  const reader = document.getElementById("reader");
  if (!reader) return;

  reader.style.display = "block";

  if (!scanner) {
    scanner = new Html5Qrcode("reader");
  }

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    function () {
      // camera is running, nothing else
    }
  ).catch(function (err) {
    console.error(err);
  });
}
