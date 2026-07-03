async function loadDashboard() {

    const library_id = Number(localStorage.getItem("library_id"));

    // ================= BOOKS =================

    const { data: books } = await supabaseClient

        .from("books")

        .select("total_quantity")

        .eq("library_id", library_id);

    let totalBooks = 0;

    books.forEach(book => {

        totalBooks += book.total_quantity;

    });

    document.getElementById("totalBooks").textContent = totalBooks;



    // ================= STUDENTS =================

    const { count: studentCount } = await supabaseClient

        .from("users")

        .select("*", { count: "exact", head: true })

        .eq("library_id", library_id)

        .eq("role", "student");

    document.getElementById("totalStudents").textContent = studentCount || 0;



    // ================= ISSUED =================

    const { count: issuedCount } = await supabaseClient

        .from("issued_books")

        .select("*", { count: "exact", head: true })

        .eq("status", "Issued");

    document.getElementById("booksIssued").textContent =
        issuedCount || 0;



    // ================= RETURNED =================

    const { count: returnedCount } = await supabaseClient

        .from("issued_books")

        .select("*", { count: "exact", head: true })

        .eq("status", "Returned");

    document.getElementById("booksReturned").textContent =
        returnedCount || 0;



    // ================= RECENT ACTIVITY =================

    const tbody = document.getElementById("recentActivity");

    tbody.innerHTML = "";

    const { data: activity } = await supabaseClient

        .from("issued_books")

        .select("*")

        .order("issue_date", { ascending: false })

        .limit(5);

    for (const item of activity || []) {

        const { data: student } = await supabaseClient

            .from("users")

            .select("name")

            .eq("user_id", item.student_id)

            .single();

        const { data: book } = await supabaseClient

            .from("books")

            .select("book_name")

            .eq("book_id", item.book_id)

            .single();

        tbody.innerHTML += `

            <tr>

                <td>${student?.name ?? "-"}</td>

                <td>${book?.book_name ?? "-"}</td>

                <td>${item.status}</td>

                <td>${item.issue_date}</td>

            </tr>

        `;

    }

}

window.addEventListener("DOMContentLoaded", loadDashboard);
