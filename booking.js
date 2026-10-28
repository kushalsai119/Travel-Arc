/* ==========================================================================
   TRAVELARC — BOOKING JAVASCRIPT (booking.js)
   Follows Govind Jha CSE-VII Syllabus:
   - L12: Objects & Arrays
   - L13: Strings & Length checks
   - L14: Functions
   - L16: DOM Selection & DOM Events (addEventListener, submit, e.preventDefault)
   - L17: JSON handling & Data saving (localStorage, Blob download)
   ========================================================================== */

// Immediate purge of sample entries from localStorage (Govind Jha L17)
(function purgeLegacySamples() {
    try {
        const raw = localStorage.getItem("travelarc_bookings");
        if (raw && (raw.includes("Vikram Malhotra") || raw.includes("Pooja Hegde") || raw.includes("TRV-8941"))) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const cleaned = parsed.filter(function(b) {
                    return b && b.customerName !== "Vikram Malhotra" && b.customerName !== "Pooja Hegde";
                });
                localStorage.setItem("travelarc_bookings", JSON.stringify(cleaned, null, 2));
            } else {
                localStorage.removeItem("travelarc_bookings");
            }
        }
    } catch (e) {
        localStorage.removeItem("travelarc_bookings");
    }
})();



// 1. Destination Pricing Object (L12: Objects)
const placePrices = {
    "Kashmir": 6000,
    "Kerala": 5500,
    "Rajasthan": 5000,
    "Goa": 4500,
    "Himachal Pradesh": 5000,
    "Varanasi": 4000,
    "Meghalaya": 6500,
    "Ladakh": 7000
};

// 2. Select DOM Elements (L16: getElementById)
const bookingForm = document.getElementById("bookingForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const destinationSelect = document.getElementById("destination");
const guideSelect = document.getElementById("guideSelect");
const guestsInput = document.getElementById("guests");
const tripDateInput = document.getElementById("tripDate");

const summaryPlace = document.getElementById("summaryPlace");
const summaryGuide = document.getElementById("summaryGuide");
const summaryRate = document.getElementById("summaryRate");
const summaryGuests = document.getElementById("summaryGuests");
const totalPrice = document.getElementById("totalPrice");
const statusBadge = document.getElementById("statusBadge");

const successMsg = document.getElementById("successMsg");
const successDetails = document.getElementById("successDetails");
const errorBanner = document.getElementById("errorBanner");
const tableBody = document.getElementById("tableBody");
const downloadBtn = document.getElementById("downloadBtn");

// 3. Live Price Calculator (L16: DOM Events - change & input)
function updateSummary() {
    const selectedPlace = destinationSelect.value;
    const selectedGuide = guideSelect.value;
    const guestCount = parseInt(guestsInput.value) || 1;
    const ratePerPerson = placePrices[selectedPlace] || 5000;
    const totalAmount = guestCount * ratePerPerson;

    // Update text content in summary box (L16 DOM)
    if (summaryPlace) summaryPlace.innerText = selectedPlace;
    if (summaryGuide) summaryGuide.innerText = selectedGuide;
    if (summaryRate) summaryRate.innerText = "₹" + ratePerPerson.toLocaleString("en-IN");
    if (summaryGuests) summaryGuests.innerText = guestCount + (guestCount === 1 ? " Person" : " Persons");
    if (totalPrice) totalPrice.innerText = "₹" + totalAmount.toLocaleString("en-IN");
}

if (destinationSelect) destinationSelect.addEventListener("change", updateSummary);
if (guideSelect) guideSelect.addEventListener("change", updateSummary);
if (guestsInput) guestsInput.addEventListener("input", updateSummary);

// 4. Page Setup on Startup
window.addEventListener("DOMContentLoaded", function () {
    // Read URL Parameters (e.g. booking.html?place=Goa&guide=Meera+Nair&guests=2)
    const urlParams = new URLSearchParams(window.location.search);
    const placeParam = urlParams.get("place");
    const guideParam = urlParams.get("guide");
    const guestsParam = urlParams.get("guests");

    if (placeParam && placePrices[placeParam]) {
        destinationSelect.value = placeParam;
    }
    if (guideParam) {
        for (let i = 0; i < guideSelect.options.length; i++) {
            if (guideSelect.options[i].value.toLowerCase().includes(guideParam.toLowerCase())) {
                guideSelect.selectedIndex = i;
                break;
            }
        }
    }
    if (guestsParam) {
        const gNum = parseInt(guestsParam);
        if (gNum >= 1 && gNum <= 10) {
            guestsInput.value = gNum;
        }
    }

    // Set default travel date to tomorrow and restrict past dates
    if (tripDateInput) {
        const today = new Date();
        const tY = today.getFullYear();
        const tM = String(today.getMonth() + 1).padStart(2, "0");
        const tD = String(today.getDate()).padStart(2, "0");
        tripDateInput.min = `${tY}-${tM}-${tD}`;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        tripDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Restrict phone input to 10 numerical digits (L13: String handling)
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
        });
    }

    updateSummary();
    loadSavedBookings();
});

// 5. Validation Helpers (L16 DOM styling)
function showError(inputElement, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (inputElement) inputElement.style.border = "2px solid #ef4444";
    if (errorElement) {
        errorElement.innerText = message;
        errorElement.style.display = "block";
    }
}

function clearAllErrors() {
    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach(function (input) {
        input.style.border = "1px solid #cbd5e1";
    });

    const errors = document.querySelectorAll(".error-msg");
    errors.forEach(function (error) {
        error.innerText = "";
        error.style.display = "none";
    });

    if (errorBanner) errorBanner.style.display = "none";
}

// 6. Form Submission & Validation (L16: DOM-EVENT submit)
if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Stop page reload

        clearAllErrors();

        const name = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const destination = destinationSelect.value;
        const guide = guideSelect.value;
        const guests = guestsInput.value;
        const tripDate = tripDateInput.value;

        let isValid = true;

        // Check 1: Name minimum 3 letters
        if (name === "" || name.length < 3) {
            showError(fullNameInput, "nameError", "Please enter your full name (at least 3 letters).");
            isValid = false;
        }

        // Check 2: Email must contain @ and .
        if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            showError(emailInput, "emailError", "Please enter a valid email address (e.g. name@gmail.com).");
            isValid = false;
        }

        // Check 3: Phone number must be 10 digits
        if (phone.length !== 10 || isNaN(phone)) {
            showError(phoneInput, "phoneError", "Phone number must be exactly 10 digits.");
            isValid = false;
        }

        // Check 4: Date must be chosen
        if (tripDate === "") {
            showError(tripDateInput, "dateError", "Please select your travel date.");
            isValid = false;
        }

        // If validation failed, show banner and scroll to top of form
        if (!isValid) {
            if (errorBanner) {
                errorBanner.style.display = "block";
                errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        // Calculation
        const rate = placePrices[destination] || 5000;
        const total = (parseInt(guests) || 1) * rate;
        const bookingId = "TRV-" + Math.floor(1000 + Math.random() * 9000);

        // Create Booking Object (L12: Objects)
        const newBooking = {
            bookingId: bookingId,
            customerName: name,
            email: email,
            phone: phone,
            destination: destination,
            guide: guide,
            guests: parseInt(guests),
            totalCost: "₹" + total.toLocaleString("en-IN"),
            travelDate: tripDate,
            status: "Confirmed"
        };

        // Save into LocalStorage (L17: JSON format)
        saveBookingToStorage(newBooking);

        // Add new row to the table (L16: createElement & append)
        addBookingToTable(newBooking, true);

        // Update Right-side Status Pill
        if (statusBadge) {
            statusBadge.innerText = "✅ Confirmed (#" + bookingId + ")";
            statusBadge.className = "status-pill confirmed";
        }

        // Show Big Green Confirmation Banner
        if (successDetails && successMsg) {
            successDetails.innerHTML = `
                <strong>Booking ID:</strong> #${bookingId} &nbsp;|&nbsp; 
                <strong>Customer:</strong> ${name} &nbsp;|&nbsp; 
                <strong>Destination:</strong> ${destination} &nbsp;|&nbsp; 
                <strong>Total:</strong> ₹${total.toLocaleString("en-IN")} (${guests} Person(s))<br>
                Your reservation has been saved to local storage! Click "Download bookings.json" below to export your data.
            `;
            successMsg.style.display = "block";
            successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Native Browser Alert (Guaranteed to pop up on screen)
        alert(`✅ Booking Confirmed Successfully!\n\nBooking ID: #${bookingId}\nDestination: ${destination}\nTotal Amount: ₹${total.toLocaleString("en-IN")}`);

        // Reset Form fields
        fullNameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
    });
}

// 7. LocalStorage Functions (L17: JSON.stringify & JSON.parse)
function getBookingsFromStorage() {
    const data = localStorage.getItem("travelarc_bookings");
    if (!data) {
        return [];
    }
    try {
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        // Filter out sample dummy bookings so only user-submitted bookings appear
        return parsed.filter(b => b && b.customerName !== "Vikram Malhotra" && b.customerName !== "Pooja Hegde");
    } catch (e) {
        return [];
    }
}

function saveBookingToStorage(booking) {
    const bookings = getBookingsFromStorage();
    bookings.unshift(booking); // add to top
    localStorage.setItem("travelarc_bookings", JSON.stringify(bookings, null, 2));
}

// 8. Add Row to Table (L16: DOM createElement)
function addBookingToTable(booking, isNew) {
    if (!tableBody) return;
    const emptyRow = document.getElementById("emptyRow");
    if (emptyRow) {
        emptyRow.remove();
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><strong>#${booking.bookingId}</strong></td>
        <td>${booking.customerName}</td>
        <td>${booking.destination}</td>
        <td>${booking.guide || "Any"}</td>
        <td>${booking.guests} Person(s)</td>
        <td><strong>${booking.totalCost}</strong></td>
        <td>${booking.travelDate}</td>
        <td><span class="badge-confirmed">Confirmed</span></td>
    `;

    if (isNew) {
        tableBody.prepend(row);
    } else {
        tableBody.appendChild(row);
    }
}

// 9. Load Saved Bookings on Startup
function loadSavedBookings() {
    if (!tableBody) return;
    const bookings = getBookingsFromStorage();
    tableBody.innerHTML = "";

    if (bookings.length === 0) {
        tableBody.innerHTML = `
            <tr id="emptyRow">
                <td colspan="8" style="text-align: center; color: var(--color-muted); padding: 28px; font-style: italic;">
                    No bookings recorded yet. Fill out the reservation form above to submit your booking.
                </td>
            </tr>
        `;
        return;
    }

    bookings.forEach(function (b) {
        addBookingToTable(b, false);
    });
}

// 10. Download Bookings as Local JSON File (Parameter 4 requirement)
if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
        const bookings = getBookingsFromStorage();

        if (bookings.length === 0) {
            alert("No bookings saved yet! Please submit at least one booking first.");
            return;
        }

        const jsonString = JSON.stringify(bookings, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "bookings.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}
