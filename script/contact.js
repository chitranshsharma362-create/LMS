emailjs.init("GTIwHs6WntgcGAxyF");

const form = document.getElementById("contactForm");
const btn = document.getElementById("sendBtn");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", function(e){

    e.preventDefault();

    btn.disabled = true;
    btn.innerHTML = "Sending...";

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    emailjs.send(
        "service_sa1fh49",
        "template_ua8takg",
        params
    )

    .then(() => {

        btn.disabled = false;
        btn.innerHTML = "Send Message";

        statusMsg.style.display = "block";
        statusMsg.className = "success";
        statusMsg.innerHTML = " Message Sent Successfully.";

        form.reset();

        setTimeout(()=>{
            statusMsg.style.display="none";
        },3000);

    })

    .catch((error)=>{

        console.log(error);

        btn.disabled = false;
        btn.innerHTML = "Send Message";

        statusMsg.style.display = "block";
        statusMsg.className = "error";
        statusMsg.innerHTML = " Message could not be sent. Please try again.";

        setTimeout(()=>{
            statusMsg.style.display="none";
        },3000);

    });

});
