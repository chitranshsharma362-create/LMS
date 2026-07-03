//////////////////// LOAD STUDENTS ////////////////////

async function loadStudentsDropdown() {

    const select = document.getElementById("issueStudent");

    if (!select) return;

    select.innerHTML = `<option value="">Select Student</option>`;

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("users")
        .select("user_id, name")
        .eq("library_id", library_id)
        .eq("role", "student")
        .order("name", { ascending: true });

    if (error) {
        console.error("Student Error:", error);
        return;
    }

    data.forEach(student => {

        const option = document.createElement("option");
        option.value = student.user_id;
        option.textContent = student.name;

        select.appendChild(option);

    });

}

//////////////////// LOAD BOOKS ////////////////////

async function loadBooksDropdown() {

    const select = document.getElementById("issueBook");

    if (!select) return;

    select.innerHTML = `<option value="">Select Book</option>`;

    const library_id = Number(localStorage.getItem("library_id"));

    const { data, error } = await supabaseClient
        .from("books")
        .select("book_id, book_name, available_quantity")
        .eq("library_id", library_id)
        .gt("available_quantity", 0)
        .order("book_name", { ascending: true });

    if (error) {
        console.error("Book Error:", error);
        return;
    }

    data.forEach(book => {

        const option = document.createElement("option");
        option.value = book.book_id;
        option.textContent = `${book.book_name} (${book.available_quantity})`;

        select.appendChild(option);

    });

}

//////////////////// PAGE LOAD ////////////////////

window.addEventListener("DOMContentLoaded", () => {

    loadStudentsDropdown();
    loadBooksDropdown();

});
