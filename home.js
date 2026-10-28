/* ==========================================================================
   TRAVELARC — HOME PAGE JAVASCRIPT (home.js)
   Developer: Kushal (Roll No: 250418) - Team Lead
   Features:
   - Dynamic Time-of-Day Greeting Badge (Govind Jha L11 Date Object)
   - Interactive Travel Season Matcher Widget (L12 Objects & L16 DOM Events)
   ========================================================================== */

// 1. Dynamic Time-of-Day Greeting
document.addEventListener("DOMContentLoaded", function () {
    const greetingEl = document.getElementById("heroGreeting");
    if (greetingEl) {
        const hour = new Date().getHours();
        let greet = "Good Evening";
        let icon = "🌙";

        if (hour < 12) {
            greet = "Good Morning";
            icon = "☀️";
        } else if (hour < 17) {
            greet = "Good Afternoon";
            icon = "🌤️";
        }

        greetingEl.innerText = `${icon} ${greet}, Explorer`;
    }
});

// 2. Interactive Season Matcher Widget (L12 Objects & Arrays, L16 DOM)
const seasonData = {
    winter: {
        icon: "❄️",
        title: "Winter: Royal Deserts & Calm Tropical Waters",
        desc: "Mild, pleasant daytime weather makes winter ideal for exploring Rajasthan's desert forts, cruising Kerala's palm-fringed backwaters, and experiencing early morning boat rides in Varanasi.",
        tags: ["📍 Rajasthan (Jaipur & Jodhpur)", "📍 Kerala (Alleppey & Kochi)", "📍 Varanasi Ghats", "🌡️ Avg 18°C – 25°C"]
    },
    spring: {
        icon: "🌸",
        title: "Spring & Summer: Blooming Valleys & Cedar Meadows",
        desc: "Spring brings vibrant wildflowers and blossoming apple orchards to Kashmir and Himachal Pradesh. Cool highland breezes make it the best escape from coastal humidity.",
        tags: ["📍 Kashmir (Dal Lake & Pahalgam)", "📍 Himachal (Manali & Parvati Valley)", "📍 Meghalaya Root Bridges", "🌡️ Avg 14°C – 22°C"]
    },
    monsoon: {
        icon: "☀️",
        title: "High Altitude & Rain Shadows: The Trans-Himalayan Frontier",
        desc: "While the plains receive heavy rainfall, Ladakh sits in the rain-shadow zone with dry, crystal-clear blue skies, open high-altitude mountain passes, and lively Buddhist monastery festivals.",
        tags: ["📍 Ladakh (Pangong Lake & Nubra)", "📍 Meghalaya Living Waterfalls", "📍 Himachal Highland Trails", "🌡️ Avg 12°C – 20°C"]
    }
};

function switchSeason(seasonKey, btn) {
    const btns = document.querySelectorAll(".season-tab-btn");
    btns.forEach(function (b) {
        b.classList.remove("active");
    });
    if (btn) {
        btn.classList.add("active");
    }

    const data = seasonData[seasonKey];
    if (!data) return;

    const iconEl = document.getElementById("seasonIcon");
    const titleEl = document.getElementById("seasonTitle");
    const descEl = document.getElementById("seasonDesc");
    const tagsEl = document.getElementById("seasonTags");

    if (iconEl) iconEl.innerText = data.icon;
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;
    if (tagsEl) {
        tagsEl.innerHTML = data.tags.map(function (t) {
            return `<span class="season-tag">${t}</span>`;
        }).join(" ");
    }
}


// 3. Floating Back to Top Button (Kushal - Govind Jha L16 window scroll)
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// 4. Newsletter Instant Subscription (Kushal - Govind Jha L13 & L16)
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        const successToast = document.getElementById("newsletterSuccess");
        const val = emailInput ? emailInput.value.trim() : "";

        if (val.includes("@") && val.includes(".")) {
            if (successToast) {
                successToast.innerText = `✓ Thank you! You're subscribed with ${val}.`;
                successToast.style.display = "block";
                setTimeout(() => {
                    successToast.style.display = "none";
                }, 4000);
            }
            newsletterForm.reset();
        } else {
            alert("Please enter a valid email address.");
        }
    });
}
// Kushal: newsletter subscription handler
