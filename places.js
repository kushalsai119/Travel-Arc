/* ==========================================================================
   TRAVELARC — DESTINATIONS JAVASCRIPT (places.js)
   Developer: Gnaneshwar Reddy (Roll No: 250306)
   Features:
   - Real-Time Live Search Bar (Govind Jha L16 DOM input event & L13 String methods)
   - Category Filter Pills (Mountains, Coastal, Heritage)
   - Ribbon Bookmark Toggle with Toast Notification Feedback (No Hearts)
   ========================================================================== */

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

// 2. Real-Time Keystroke Search Bar (L16 DOM Event)
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
});

// 3. Ribbon Bookmark Toggle (No Hearts - Clean Travel Bookmark)
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
