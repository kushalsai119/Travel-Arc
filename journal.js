/* ==========================================================================
   TRAVELARC — TRAVEL JOURNAL JAVASCRIPT (journal.js)
   Developer: Sagar (Roll No: 250346)
   Features:
   - Top Reading Scroll Progress Bar (Govind Jha L16 window scroll event)
   - Live Helpful Ribbon Counter with Active Toggle
   - LocalStorage Persistence for Article Reactions (Govind Jha L17)
   ========================================================================== */

// 1. Reading Scroll Depth Progress Bar
window.addEventListener("scroll", function () {
    const progressBar = document.getElementById("scrollProgress");
    if (progressBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
    }
});

// 2. Helpful Ribbon Counter with LocalStorage (L16 DOM + L17 LocalStorage)
const STORAGE_KEY = "travelarc_journal_reactions";

function getStoredReactions() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

function saveStoredReactions(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Storage error:", e);
    }
}

function markHelpful(btn) {
    const card = btn.closest(".journal-review-card");
    const titleEl = card ? card.querySelector(".journal-story-title") : null;
    const storyId = titleEl ? titleEl.innerText.trim() : "story";

    const countSpan = btn.querySelector(".like-num");
    let currentCount = countSpan ? (parseInt(countSpan.innerText) || 0) : 0;

    const reactions = getStoredReactions();
    const isCurrentlyActive = btn.classList.contains("active");

    if (isCurrentlyActive) {
        btn.classList.remove("active");
        if (countSpan) countSpan.innerText = Math.max(0, currentCount - 1);
        delete reactions[storyId];
    } else {
        btn.classList.add("active");
        if (countSpan) countSpan.innerText = currentCount + 1;
        reactions[storyId] = { liked: true, count: currentCount + 1 };
    }
    saveStoredReactions(reactions);
}

// Restore saved reactions on page load (L17)
document.addEventListener("DOMContentLoaded", function () {
    const reactions = getStoredReactions();
    document.querySelectorAll(".journal-review-card").forEach(function (card) {
        const titleEl = card.querySelector(".journal-story-title");
        if (!titleEl) return;
        const storyId = titleEl.innerText.trim();
        if (reactions[storyId] && reactions[storyId].liked) {
            const btn = card.querySelector(".btn-helpful");
            const countSpan = card.querySelector(".like-num");
            if (btn) btn.classList.add("active");
            if (countSpan && reactions[storyId].count) {
                countSpan.innerText = reactions[storyId].count;
            }
        }
    });
});
