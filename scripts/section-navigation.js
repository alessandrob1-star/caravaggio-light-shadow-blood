// Connect each boundary arrow to its preceding and following sections.
const sectionArrows = Array.from(document.querySelectorAll(".section-arrow"));
const sectionOrder = ["home", "light", "shadow", "blood"];

// Reverse boundary links after entering their following section.
function updateSectionArrows() {
    const currentIndex = activeChapter ? sectionOrder.indexOf(activeChapter.id) : 0;
    const root = document.documentElement;
    root.dataset.activeSection = sectionOrder[currentIndex];

    // Keep the previous gallery's controls fully visible above centred Shadow.
    if (activeChapter && activeChapter.id === "shadow") {
        const edgeSpace = (window.innerHeight - activeChapter.offsetHeight) / 2;
        root.style.setProperty(
            "--shadow-top-control-shift", Math.max(16, 64 - edgeSpace) + "px"
        );
    }

    sectionArrows.forEach(function (arrow) {
        const nextIndex = sectionOrder.indexOf(arrow.dataset.nextSection);
        const pointingUp = currentIndex >= nextIndex;
        const targetId = pointingUp
            ? arrow.dataset.previousSection : arrow.dataset.nextSection;

        arrow.classList.toggle("is-pointing-up", pointingUp);
        arrow.setAttribute("href", "#" + targetId);
        arrow.setAttribute("aria-labelledby", targetId + "-title");
    });
}

sectionArrows.forEach(function (arrow) {
    arrow.addEventListener("click", function (event) {
        // Preserve standard link behaviour for modified clicks.
        if (event.button !== 0 || event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey) return;

        event.preventDefault();
        const target = document.querySelector(arrow.getAttribute("href"));
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant" : "smooth";
        let destinationTitle;

        if (target.id === "home") {
            // Return to the opening title and video at the top of the page.
            window.scrollTo({ top: 0, behavior: behavior });
            destinationTitle = document.getElementById("home-title");
        } else {
            const gallery = galleries.find(function (item) {
                return item.chapter === target;
            });

            // Return to the chapter title before changing the vertical position.
            showGalleryTitle(gallery);
            target.scrollIntoView({ block: "center", behavior: behavior });
            destinationTitle = gallery.title;
        }

        // Move keyboard focus to the destination without a second scroll.
        destinationTitle.setAttribute("tabindex", "-1");
        destinationTitle.focus({ preventScroll: true });
    });
});

// Update after the section detector has processed each vertical scroll frame.
let sectionArrowFramePending = false;
window.addEventListener("scroll", function () {
    if (sectionArrowFramePending) return;
    sectionArrowFramePending = true;

    requestAnimationFrame(function () {
        sectionArrowFramePending = false;
        updateSectionArrows();
    });
}, { passive: true });

document.fonts.ready.then(updateSectionArrows);

// Recalculate control clearance when the viewport dimensions change.
window.addEventListener("resize", updateSectionArrows);
