// Get form elements
const form = document.getElementById("feedbackForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const confirmation = document.getElementById("confirmation");

// -------------------- Validation Functions --------------------
function validateName(name) {
    return name.trim().length >= 3;
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return re.test(email);
}

function validateMessage(message) {
    return message.trim().length > 0; // Accepts any non-empty input
}

// -------------------- Hover Effects --------------------
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener("mouseover", () => input.style.backgroundColor = "#e6f7ff");
    input.addEventListener("mouseout", () => input.style.backgroundColor = "#fff");
});

// -------------------- Real-Time Validation --------------------
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener("keyup", () => {
        if(input === nameInput && !validateName(nameInput.value)){
            nameInput.style.borderColor = "red";
        } else if(input === emailInput && !validateEmail(emailInput.value)){
            emailInput.style.borderColor = "red";
        } else if(input === messageInput && !validateMessage(messageInput.value)){
            messageInput.style.borderColor = "red";
        } else {
            input.style.borderColor = "#ccc";
        }
    });
});

// -------------------- Form Submit --------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    // -------------------- Validate Inputs --------------------
    if(!validateName(nameInput.value) || !validateEmail(emailInput.value) || !validateMessage(messageInput.value)){
        alert("Please fill all fields correctly!");
        return;
    }

    // -------------------- Send Data to Backend --------------------
    try {
        const response = await fetch('http://localhost:3000/submit-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            })
        });

        if(!response.ok){
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // -------------------- Show Confirmation --------------------
        confirmation.classList.remove("hidden");
        confirmation.style.color = data.success ? "green" : "red";
        confirmation.textContent = data.message;

        if(data.success){
            form.reset(); // clear form fields
            [nameInput, emailInput, messageInput].forEach(input => input.style.borderColor = "#ccc"); // reset border color
        }

    } catch (err) {
        console.error("Fetch error:", err);
        confirmation.classList.remove("hidden");
        confirmation.style.color = "red";
        confirmation.textContent = "Server error! Check console.";
    }
});
