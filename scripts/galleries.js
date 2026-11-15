// Select each chapter gallery, its opening title and its navigation link.
const galleries = Array.from(document.querySelectorAll(".chapter")).map(function (chapter) {
    return {
        scroller: chapter.querySelector(".chapter-scroll"),
        title: chapter.querySelector(".chapter-title"),
        link: document.querySelector('a[href="#' + chapter.id + '"]')
    };
});

// Open a gallery at its title, leaving artworks available on both sides.
function showGalleryTitle(gallery) {
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

// Return to a chapter's title when its navigation link is selected.
galleries.forEach(function (gallery) {
    gallery.link.addEventListener("click", function () {
        showGalleryTitle(gallery);
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
