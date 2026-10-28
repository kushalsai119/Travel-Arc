/* ==========================================================================
   TRAVELARC — LOCAL GUIDES JAVASCRIPT (guides.js)
   Developer: Jagannath B (Roll No: 250407)
   Features:
   - Experience Filter Pills (All, 6+ Years, 8+ Years Veteran Guides)
   - Dynamic Verified Guide Count Indicator
   ========================================================================== */

function filterGuides(minExp, pillBtn) {
    const pills = document.querySelectorAll(".filter-pill");
    pills.forEach(function (pill) {
        pill.classList.remove("active");
    });
    if (pillBtn) {
        pillBtn.classList.add("active");
    }

    const cards = document.querySelectorAll(".guide-card");
    let count = 0;
    cards.forEach(function (card) {
        const exp = parseInt(card.getAttribute("data-exp")) || 0;
        if (minExp === 0 || exp >= minExp) {
            card.style.display = "flex";
            count++;
        } else {
            card.style.display = "none";
        }
    });

    const countEl = document.getElementById("guidesCount");
    if (countEl) {
        countEl.innerText = `Showing ${count} verified guide(s)`;
    }
}


// 3. Spoken Language Tag Interaction (Jagannath - Govind Jha L16)
document.addEventListener("DOMContentLoaded", function () {
    const langTags = document.querySelectorAll(".guide-lang-tag");
    langTags.forEach(function (tag) {
        tag.addEventListener("click", function () {
            this.style.backgroundColor = "#ea580c";
            this.style.color = "#ffffff";
            setTimeout(() => {
                this.style.backgroundColor = "";
                this.style.color = "";
            }, 800);
        });
    });
});
