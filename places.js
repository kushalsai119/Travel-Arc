/* ==========================================================================
   TRAVELARC — DESTINATIONS JAVASCRIPT (places.js)
   Developer: Gnaneshwar Reddy (Roll No: 250306)
   Enhanced for 3rd Evaluation:
   - Parameter 1: Live Weather API integration for destinations
   - Category Filter Pills (Mountains, Coastal, Heritage)
   - Real-Time Search Bar
   - Ribbon Bookmark Toggle
   ========================================================================== */

const API_BASE = (window.location.protocol.startsWith("http")) ? "" : "http://localhost:5000";
console.log("%c[TravelArc] places.js loaded successfully", "color: #0284c7; font-weight: bold; font-size: 13px;");
console.log("[TravelArc] Weather API Endpoint: " + (API_BASE || window.location.origin) + "/api/v1/weather");

// 1. Category Filter Pills
function filterPlaces(category, pillBtn) {
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(function (pill) {
        pill.classList.remove("active");
    });
    if (pillBtn) {
        pillBtn.classList.add("active");
    }

    const cards = document.querySelectorAll(".destination-card");
    let visibleCount = 0;

    cards.forEach(function (card) {
        const cardCategory = card.getAttribute("data-category") || "";
        if (category === "all" || cardCategory === category) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    const countEl = document.getElementById("destinationCount");
    if (countEl) {
        countEl.innerText = `Showing ${visibleCount} destination(s)`;
    }
}

// 2. Real-Time Keystroke Search Bar
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("destinationSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll(".destination-card");
            let count = 0;

            cards.forEach(function (card) {
                const cardText = card.innerText.toLowerCase();
                if (cardText.includes(query)) {
                    card.style.display = "flex";
                    count++;
                } else {
                    card.style.display = "none";
                }
            });

            const countEl = document.getElementById("destinationCount");
            if (countEl) {
                countEl.innerText = `Showing ${count} destination(s)`;
            }
        });
    }

    // Load Live Weather for Destination Cards (Parameter 1: External API)
    loadLiveDestinationWeather();
});

// 3. Ribbon Bookmark Toggle
function toggleBookmark(btn, placeName) {
    btn.classList.toggle("saved");
    const isSaved = btn.classList.contains("saved");

    const toast = document.getElementById("actionToast");
    if (toast) {
        toast.innerText = isSaved 
            ? `🔖 "${placeName}" saved to your bookmarks!` 
            : `Removed "${placeName}" from bookmarks.`;
        toast.style.display = "block";
        setTimeout(function () {
            toast.style.display = "none";
        }, 2200);
    }
}

// 4. Live Weather Fetcher (Parameter 1: External API call)
async function loadLiveDestinationWeather() {
    const cards = document.querySelectorAll(".destination-card");
    cards.forEach(async function (card) {
        const titleEl = card.querySelector(".destination-title") || card.querySelector("h3");
        if (!titleEl) return;
        const placeName = titleEl.innerText.split("\n")[0].trim();

        try {
            const res = await fetch(`${API_BASE}/api/v1/weather?destination=${encodeURIComponent(placeName)}`);
            if (res.ok) {
                const data = await res.json();
                const weatherInfo = data.currentWeather;
                console.log(`[TravelArc] Live weather for ${placeName}: ${weatherInfo.temperature}, ${weatherInfo.condition}`);

                // Add or update weather badge on the card
                let weatherBadge = card.querySelector(".live-weather-badge");
                if (!weatherBadge) {
                    weatherBadge = document.createElement("div");
                    weatherBadge.className = "live-weather-badge";
                    weatherBadge.style.cssText = "font-size: 11px; color: #0284c7; background: #e0f2fe; padding: 4px 8px; border-radius: 999px; margin-top: 6px; display: inline-flex; align-items: center; gap: 4px; font-weight: 600;";
                    const metaContainer = card.querySelector(".destination-meta") || card.querySelector(".destination-content") || card;
                    metaContainer.appendChild(weatherBadge);
                }
                weatherBadge.innerHTML = `🌤️ ${weatherInfo.temperature} · ${weatherInfo.condition}`;
            }
        } catch {
            // Quietly ignore if API is offline
        }
    });
}
