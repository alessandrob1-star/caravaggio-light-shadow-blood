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
    const titleInset = Math.min(192, Math.max(24, gallery.scroller.clientWidth * 0.1));

    gallery.scroller.scrollLeft += titleBounds.left - galleryBounds.left - titleInset;
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
