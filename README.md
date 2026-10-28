# TravelArc — Indian Travel & Local Guides Website

A multi-page responsive web project created for the Web Programming course (CSE 2022). It allows users to explore authentic travel destinations across India, read traveler reviews, view profiles of verified resident guides, and reserve tours with live cost calculation and local JSON data storage.

---

## Project Information

| Field | Details |
|-------|---------|
| **Course Code** | CSE 2022 |
| **Course Name** | Web Programming |
| **Project Title** | TravelArc |
| **Group Number** | 10 |
| **Evaluation** | 2nd Evaluation Phase — JavaScript Interactions, Validation, Form Submission & JSON Storage |
| **Date** | October 2026 |

---

## Team Members & Work Distribution

| Member | Roll No | Branch | Role | Files |
|--------|---------|--------|------|-------|
| **Kushal** | 250418 | [`kushal/home`](../../tree/kushal/home) | Team Lead & Home Page Developer | `index.html`, `base.css`, `home.js` |
| **Gnaneshwar Reddy** | 250306 | [`gnaneshwar/places`](../../tree/gnaneshwar/places) | Destinations Developer | `places.html`, `places.css`, `places.js` |
| **Jagannath B** | 250407 | [`jagannath/guides`](../../tree/jagannath/guides) | Guides Page Developer | `guides.html`, `guides.css`, `guides.js` |
| **Sagar** | 250346 | [`sagar/journal`](../../tree/sagar/journal) | Journal & Content Developer | `journal.html`, `journal.css`, `journal.js` |
| **Kapil Saraswat** | 250876 | [`kapil/booking`](../../tree/kapil/booking) | Booking Engine & UI Developer | `contact.html`, `contact.css`, `contact.js`, `booking.html`, `booking.css`, `booking.js` |

> Each member has a dedicated branch containing only their files. Switch branches to view individual contributions.

---

## JavaScript Features Built

### Kushal — `home.js`
- Dynamic time-of-day greeting (Morning / Afternoon / Evening) based on system clock
- Interactive Season Matcher widget — 3 season tabs updating destination spotlight live

### Gnaneshwar Reddy — `places.js`
- Real-time keystroke search filtering 8 destination cards instantly
- Category filter pills — All / Mountain / Beach / Heritage / Wildlife
- Ribbon bookmark toggle (🔖) with localStorage and toast notifications

### Jagannath B — `guides.js`
- Experience filter pills — All / 6+ Years / 8+ Years
- Live verified guide counter updating dynamically as filters change

### Sagar — `journal.js`
- Reading scroll progress bar — top bar grows as you scroll through each article
- Helpful counter — 👍 upvote journal entries, count persists in localStorage

### Kapil Saraswat — `contact.js` & `booking.js`
- Contact form validation with live inline error messages
- FAQ slide-toggle accordion with smooth animation
- Live price calculator updating total cost as destination / persons / days change
- 4-point booking validation before submission
- localStorage persistence — bookings saved across page refresh
- Recent Bookings Table showing last 5 bookings
- `bookings.json` download — exports all saved bookings as a real JSON file

---

## Website Pages

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Hero banner, 4-column feature strip, curated journey styles, interactive season matcher |
| **Places** | `places.html` | 8-destination card grid with real photos, search, filters, and ribbon bookmarks |
| **Guides** | `guides.html` | 6 verified local guides with experience filters and direct booking links |
| **Journal** | `journal.html` | Travel stories with star ratings, scroll progress bar, and helpful counters |
| **Contact** | `contact.html` | Inquiry form with client-side validation and FAQ accordion |
| **Book Trip** | `booking.html` | Live price booking engine with localStorage and bookings.json export |

---

## 2nd Evaluation Parameters & Technologies

- **HTML5**: Semantic tags — `header`, `nav`, `main`, `section`, `article`, `footer`, `form`, `aside`
- **CSS3**: Flexbox, CSS Grid, custom properties (variables), transitions, glassmorphism
- **Vanilla JavaScript** (Govind Jha Syllabus L11–L17):
  - **L11 & L12**: Objects & Arrays (`placePrices`, `seasonData`, `newBooking`)
  - **L13**: String methods (`indexOf`, `includes`, `toLowerCase`, `trim`)
  - **L14**: Modular parameterized functions
  - **L16**: DOM manipulation & events (`addEventListener`, `e.preventDefault`, `classList.toggle`)
  - **L17**: JSON & localStorage (`localStorage.setItem`, `JSON.stringify`, `JSON.parse`, `Blob` download)

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/kushalsai119/Travel-Arc.git
   ```
2. Open the project folder and double-click `index.html` in any browser (Chrome, Edge, Firefox).
3. Or visit the live site on **GitHub Pages**:
   **[https://kushalsai119.github.io/Travel-Arc/](https://kushalsai119.github.io/Travel-Arc/)**
