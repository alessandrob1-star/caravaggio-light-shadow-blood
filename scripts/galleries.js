// Select each chapter gallery, its opening title and its navigation link.
const galleries = Array.from(document.querySelectorAll(".chapter")).map(function (chapter) {
    return {
        chapter: chapter,
        scroller: chapter.querySelector(".chapter-scroll"),
        title: chapter.querySelector(".chapter-title"),
        link: document.querySelector('a[href="#' + chapter.id + '"]')
    };
});

// Open a gallery at its title, leaving artworks available on both sides.
function showGalleryTitle(gallery) {
    // Stop an unfinished drag or glide before returning to the title.
    gallery.scroller.dispatchEvent(new Event("galleryreset"));

    const galleryBounds = gallery.scroller.getBoundingClientRect();
    const titleBounds = gallery.title.getBoundingClientRect();
    const titleCentre = titleBounds.left + titleBounds.width / 2;
    const galleryCentre = galleryBounds.left + gallery.scroller.clientWidth / 2;

    gallery.scroller.scrollLeft += titleCentre - galleryCentre;
}

// Wait for the font before calculating the title positions.
document.fonts.ready.then(function () {
    galleries.forEach(showGalleryTitle);
});

// Focus the chapter heading when its menu link is activated.
galleries.forEach(function (gallery) {
    gallery.link.addEventListener("click", function (event) {
        // Preserve the browser's behaviour for modified clicks.
        if (event.button !== 0 || event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey) return;

        event.preventDefault();
        showGalleryTitle(gallery);

        // Preserve chapter addresses and browser history.
        const hash = gallery.link.hash;
        if (window.location.hash !== hash) {
            window.history.pushState(null, "", hash);
        }

        gallery.chapter.scrollIntoView({ block: "center", behavior: "instant" });

        // Focus the heading without scrolling away from the centred chapter.
        gallery.title.tabIndex = -1;
        gallery.title.focus({ preventScroll: true });
    });
});

// Leave the start of the Light chapter visible below the opening area.
const openingHeader = document.querySelector(".site-header");

function updateOpeningHeight() {
    document.documentElement.style.setProperty(
        "--opening-header-height",
        openingHeader.getBoundingClientRect().height + "px"
    );
}

// Recalculate the available video height when the header wraps or resizes.
new ResizeObserver(updateOpeningHeight).observe(openingHeader);
updateOpeningHeight();

// Track which chapter occupies the vertical centre of the screen.
let activeChapter = null;
let previousScrollY = window.scrollY;
let sectionFramePending = false;

function updateActiveChapter() {
    // Treat the top of the page as Home even on shorter opening layouts.
    if (window.scrollY === 0) {
        activeChapter = null;
        return;
    }

    const screenCentre = window.innerHeight / 2;

    const activeGallery = galleries.find(function (gallery) {
        const bounds = gallery.chapter.getBoundingClientRect();

        return bounds.top <= screenCentre &&
            bounds.bottom > screenCentre;
    });

    const nextChapter = activeGallery ? activeGallery.chapter : null;

    // Reset a gallery only when entering a different section.
    if (nextChapter === activeChapter) return;

    activeChapter = nextChapter;

    if (activeGallery) {
        showGalleryTitle(activeGallery);
    }
}

// Handle page scrolling without reacting to horizontal gallery movement.
window.addEventListener("scroll", function () {
    if (window.scrollY === previousScrollY) return;
    previousScrollY = window.scrollY;

    if (sectionFramePending) return;
    sectionFramePending = true;

    requestAnimationFrame(function () {
        sectionFramePending = false;
        updateActiveChapter();
    });
}, { passive: true });

// Identify the initial section after the opening layout is ready.
document.fonts.ready.then(updateActiveChapter);

