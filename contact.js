/* ==========================================================================
   TRAVELARC — CONTACT & FAQ JAVASCRIPT (contact.js)
   Developer: Kapil Saraswat (Roll No: 250876)
   Features:
   - Interactive FAQ Accordion (Govind Jha L16 DOM classList toggle)
   - Real-Time Visual Input Validation (Govind Jha L16 DOM input events)
   - Contact Form Multi-Field Validation & Custom Confirmation Banner
   ========================================================================== */

// 1. Interactive FAQ Accordion
function toggleFaq(item) {
    item.classList.toggle("open");
}

// 2. Real-Time Input Validation & Submit Handler (L16 DOM Events)
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("user-email");

    // Real-time live validation feedback (L16: input event)
    if (nameInput) {
        nameInput.addEventListener("input", function () {
            if (this.value.trim().length >= 2) {
                this.classList.add("field-valid");
                this.classList.remove("field-invalid");
            } else if (this.value.trim().length > 0) {
                this.classList.add("field-invalid");
                this.classList.remove("field-valid");
            } else {
                this.classList.remove("field-valid", "field-invalid");
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            const val = this.value.trim();
            if (val.includes("@") && val.includes(".") && val.indexOf("@") < val.lastIndexOf(".")) {
                this.classList.add("field-valid");
                this.classList.remove("field-invalid");
            } else if (val.length > 0) {
                this.classList.add("field-invalid");
                this.classList.remove("field-valid");
            } else {
                this.classList.remove("field-valid", "field-invalid");
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";

            if (name === "" || email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                alert("Please enter your name and a valid email address (e.g. name@gmail.com).");
                return;
            }

            const successBox = document.getElementById("contactFormSuccess");
            if (successBox) {
                successBox.innerHTML = `✓ Thank you, <strong>${name}</strong>! Your message has been received. Our team will contact you at <em>${email}</em> shortly.`;
                successBox.style.display = "block";
                successBox.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            contactForm.reset();
            if (nameInput) nameInput.classList.remove("field-valid", "field-invalid");
            if (emailInput) emailInput.classList.remove("field-valid", "field-invalid");
        });
    }
});
