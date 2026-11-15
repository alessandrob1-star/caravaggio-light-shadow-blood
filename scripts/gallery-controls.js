// Build a manual navigation bar for each horizontally scrolling gallery.
document.querySelectorAll(".chapter").forEach(function (chapter) {
    const scroller = chapter.querySelector(".chapter-scroll");
    const title = chapter.querySelector(".chapter-title");
    const items = Array.from(
        scroller.querySelectorAll(".gallery-artwork, .chapter-title-panel")
    );
    const controls = document.createElement("div");
    controls.className = "gallery-pagination";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-labelledby", title.id);

    // Centre the selected item without moving the page vertically.
    function centreItem(item) {
        const bounds = item.getBoundingClientRect();
        const galleryBounds = scroller.getBoundingClientRect();
        const distance = bounds.left + bounds.width / 2 -
            galleryBounds.left - scroller.clientWidth / 2;
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        scroller.scrollTo({
            left: scroller.scrollLeft + distance,
            behavior: reduceMotion ? "instant" : "smooth"
        });
    }

    // Reuse existing artwork descriptions and the chapter title as labels.
    const buttons = items.map(function (item) {
        const button = document.createElement("button");
        const image = item.querySelector("img");
        button.type = "button";
        button.className = "gallery-dot";
        button.setAttribute("aria-label", image ? image.alt : title.textContent);
        button.setAttribute("aria-current", "false");
        button.addEventListener("click", function () {
            centreItem(item);
        });
        controls.append(button);
        return button;
    });

    // Match the highlighted segment to the item nearest the gallery centre.
    let activeIndex = -1;
    function updateActiveItem() {
        const bounds = scroller.getBoundingClientRect();
        const centre = bounds.left + scroller.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        items.forEach(function (item, index) {
            const itemBounds = item.getBoundingClientRect();
            const distance = Math.abs(
                itemBounds.left + itemBounds.width / 2 - centre
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = index;
            }
        });

        if (nearestIndex === activeIndex) return;
        activeIndex = nearestIndex;
        buttons.forEach(function (button, index) {
            button.setAttribute("aria-current", String(index === activeIndex));
        });

        // Keep the active dot visible when the bar is wider than a small screen.
        const activeButton = buttons[activeIndex];
        controls.scrollLeft = activeButton.offsetLeft -
            (controls.clientWidth - activeButton.offsetWidth) / 2;
    }

    // Use one update per animation frame during manual scrolling.
    let pendingFrame = false;
    scroller.addEventListener("scroll", function () {
        if (pendingFrame) return;
        pendingFrame = true;
        requestAnimationFrame(function () {
            pendingFrame = false;
            updateActiveItem();
        });
    });

    // Keep the title button aligned with language changes.
    new MutationObserver(function () {
        buttons[items.indexOf(title.closest(".chapter-title-panel"))].setAttribute(
            "aria-label", title.textContent
        );
    }).observe(title, { childList: true, characterData: true, subtree: true });

    chapter.append(controls);
    chapter.classList.add("has-gallery-controls");
    new ResizeObserver(updateActiveItem).observe(scroller);
    document.fonts.ready.then(updateActiveItem);
});
