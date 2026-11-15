/* ==========================================================================
   TRAVELARC — TRAVEL JOURNAL JAVASCRIPT (journal.js)
   Developer: Sagar (Roll No: 250346)
   Enhanced for 3rd Evaluation:
   - Top Reading Scroll Progress Bar
   - Live Helpful Reaction Counter connected to backend Express API (/api/v1/journal)
   - Synchronized with local JSON file (journal_reactions.json) & MongoDB Atlas
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

// 2. Helpful Reaction Counter with Backend Sync (Local JSON + MongoDB)
const STORAGE_KEY = "travelarc_journal_reactions";

function getStoredReactions() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
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

async function markHelpful(btn) {
    const card = btn.closest(".journal-review-card");
    const titleEl = card ? card.querySelector(".journal-story-title") : null;
    const storyId = titleEl ? titleEl.innerText.trim() : "story";

    const countSpan = btn.querySelector(".like-num");
    let currentCount = countSpan ? (parseInt(countSpan.innerText) || 0) : 0;

    const reactions = getStoredReactions();
    const isCurrentlyActive = btn.classList.contains("active");
    const action = isCurrentlyActive ? "unlike" : "like";

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

    // Sync with backend Express API -> local JSON file + MongoDB Atlas
    try {
        await fetch("/api/v1/journal/like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storyId, action })
        });
    } catch (err) {
        console.warn("Backend reaction sync offline:", err.message);
    }
}

// Restore reactions on page load (from Backend API first)
document.addEventListener("DOMContentLoaded", async function () {
    let serverReactions = {};
    try {
        const res = await fetch("/api/v1/journal");
        if (res.ok) {
            const data = await res.json();
            serverReactions = data.reactions || {};
        }
    } catch {}

    const localReactions = getStoredReactions();

    document.querySelectorAll(".journal-review-card").forEach(function (card) {
        const titleEl = card.querySelector(".journal-story-title");
        if (!titleEl) return;
        const storyId = titleEl.innerText.trim();
        const countSpan = card.querySelector(".like-num");
        const btn = card.querySelector(".btn-helpful");

        // Update counts from server/local JSON
        if (serverReactions[storyId] && serverReactions[storyId].count !== undefined) {
            if (countSpan) countSpan.innerText = serverReactions[storyId].count;
        }

        // Keep active state if user previously liked it
        if (localReactions[storyId] && localReactions[storyId].liked) {
            if (btn) btn.classList.add("active");
        }
    });
});
