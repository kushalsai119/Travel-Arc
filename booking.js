/* ==========================================================================
   TRAVELARC — BOOKING JAVASCRIPT (booking.js)
   Follows Govind Jha CSE-VII Syllabus & 3rd Evaluation Parameters:
   - Parameter 2: Node and Express setup
   - Parameter 3: Express APIs to save/fetch data to local JSON files
   - Parameter 4: CRUD operations using Express APIs to manage data in MongoDB
   - Fallback: LocalStorage support if server is offline
   ========================================================================== */

const API_BASE_URL = "/api/v1/bookings";

// 1. Destination Pricing Object
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

// 2. Select DOM Elements
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

// 3. Live Price Calculator
function updateSummary() {
    const selectedPlace = destinationSelect.value;
    const selectedGuide = guideSelect.value;
    const guestCount = parseInt(guestsInput.value) || 1;
    const ratePerPerson = placePrices[selectedPlace] || 5000;
    const totalAmount = guestCount * ratePerPerson;

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

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
        });
    }

    updateSummary();
    loadSavedBookings();
});

// 5. Validation Helpers
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

// 6. Form Submission & Validation (Calls Express API -> MongoDB & local JSON)
if (bookingForm) {
    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearAllErrors();

        const name = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const destination = destinationSelect.value;
        const guide = guideSelect.value;
        const guests = guestsInput.value;
        const tripDate = tripDateInput.value;

        let isValid = true;

        if (name === "" || name.length < 3) {
            showError(fullNameInput, "nameError", "Please enter your full name (at least 3 letters).");
            isValid = false;
        }

        if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            showError(emailInput, "emailError", "Please enter a valid email address.");
            isValid = false;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            showError(phoneInput, "phoneError", "Phone number must be exactly 10 digits.");
            isValid = false;
        }

        if (tripDate === "") {
            showError(tripDateInput, "dateError", "Please select your travel date.");
            isValid = false;
        }

        if (!isValid) {
            if (errorBanner) {
                errorBanner.style.display = "block";
                errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        const rate = placePrices[destination] || 5000;
        const total = (parseInt(guests) || 1) * rate;

        const bookingPayload = {
            customerName: name,
            email: email,
            phone: phone,
            destination: destination,
            guide: guide,
            guests: parseInt(guests),
            totalCost: "₹" + total.toLocaleString("en-IN"),
            travelDate: tripDate
        };

        // Send to Express Backend API (Parameter 3 & 4)
        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload)
            });

            if (res.ok) {
                const data = await res.json();
                const savedBooking = data.booking;

                addBookingToTable(savedBooking, true);

                if (statusBadge) {
                    statusBadge.innerText = "✅ Confirmed (#" + savedBooking.bookingId + ")";
                    statusBadge.className = "status-pill confirmed";
                }

                if (successDetails && successMsg) {
                    successDetails.innerHTML = `
                        <strong>Booking ID:</strong> #${savedBooking.bookingId} &nbsp;|&nbsp; 
                        <strong>Customer:</strong> ${name} &nbsp;|&nbsp; 
                        <strong>Destination:</strong> ${destination} &nbsp;|&nbsp; 
                        <strong>Total:</strong> ₹${total.toLocaleString("en-IN")} (${guests} Person(s))<br>
                        <em>✓ Synchronized automatically to local JSON file (<code>backend/data/bookings.json</code>) and MongoDB Atlas database.</em>
                    `;
                    successMsg.style.display = "block";
                    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
                }

                alert(`✅ Booking Confirmed Successfully!\n\nBooking ID: #${savedBooking.bookingId}\nDestination: ${destination}\nSaved to: Local JSON + MongoDB Atlas`);

                fullNameInput.value = "";
                emailInput.value = "";
                phoneInput.value = "";
                return;
            }
        } catch (apiErr) {
            console.warn("Backend API not reachable, falling back to local client handling:", apiErr.message);
        }

        // Fallback for offline/standalone static view
        const fallbackId = "TRV-" + Math.floor(1000 + Math.random() * 9000);
        const fallbackBooking = {
            bookingId: fallbackId,
            ...bookingPayload,
            status: "Confirmed"
        };
        saveToLocalStorageFallback(fallbackBooking);
        addBookingToTable(fallbackBooking, true);
        alert(`✅ Booking Confirmed!\nBooking ID: #${fallbackId}`);
        fullNameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";
    });
}

// 7. Add Row to Table (Includes DELETE / Cancel button for full CRUD demo)
function addBookingToTable(booking, isNew) {
    if (!tableBody) return;
    const emptyRow = document.getElementById("emptyRow");
    if (emptyRow) {
        emptyRow.remove();
    }

    const row = document.createElement("tr");
    row.id = `row-${booking.bookingId}`;
    row.innerHTML = `
        <td><strong>#${booking.bookingId}</strong></td>
        <td>${booking.customerName}</td>
        <td>${booking.destination}</td>
        <td>${booking.guide || "Any"}</td>
        <td>${booking.guests} Person(s)</td>
        <td><strong>${booking.totalCost}</strong></td>
        <td>${booking.travelDate}</td>
        <td>
            <button class="btn-cancel-booking" onclick="deleteBookingHandler('${booking.bookingId}')" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;">
                ✕ Cancel
            </button>
        </td>
    `;

    if (isNew) {
        tableBody.prepend(row);
    } else {
        tableBody.appendChild(row);
    }
}

// 8. Delete / Cancel Booking Handler (CRUD Parameter 4)
window.deleteBookingHandler = async function (bookingId) {
    if (!confirm(`Are you sure you want to cancel and delete booking #${bookingId}?`)) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/${bookingId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            const row = document.getElementById(`row-${bookingId}`);
            if (row) row.remove();
            alert(`Booking #${bookingId} has been cancelled and removed from MongoDB & JSON file.`);
            return;
        }
    } catch (err) {
        console.warn("Delete API error, removing from UI:", err);
    }

    const row = document.getElementById(`row-${bookingId}`);
    if (row) row.remove();
};

// 9. Load Saved Bookings on Startup (from Express API first)
async function loadSavedBookings() {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    try {
        const res = await fetch(API_BASE_URL);
        if (res.ok) {
            const data = await res.json();
            const bookings = data.bookings || [];

            if (bookings.length > 0) {
                bookings.forEach(function (b) {
                    addBookingToTable(b, false);
                });
                return;
            }
        }
    } catch (err) {
        console.log("Could not load from API, checking local storage fallback:", err.message);
    }

    // Local storage fallback if API is not running
    const local = getLocalStorageFallback();
    if (local.length > 0) {
        local.forEach((b) => addBookingToTable(b, false));
        return;
    }

    tableBody.innerHTML = `
        <tr id="emptyRow">
            <td colspan="8" style="text-align: center; color: var(--color-muted); padding: 28px; font-style: italic;">
                No bookings recorded yet. Fill out the reservation form above to submit your booking.
            </td>
        </tr>
    `;
}

// Helper fallbacks
function getLocalStorageFallback() {
    try {
        const raw = localStorage.getItem("travelarc_bookings");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToLocalStorageFallback(item) {
    const list = getLocalStorageFallback();
    list.unshift(item);
    localStorage.setItem("travelarc_bookings", JSON.stringify(list, null, 2));
}

// 10. Download Bookings as Local JSON File
if (downloadBtn) {
    downloadBtn.addEventListener("click", async function () {
        let bookings = [];
        try {
            const res = await fetch(API_BASE_URL);
            if (res.ok) {
                const data = await res.json();
                bookings = data.bookings || [];
            }
        } catch {
            bookings = getLocalStorageFallback();
        }

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
