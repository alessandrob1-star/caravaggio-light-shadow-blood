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
        if (image) {
            // Use a short label for navigation when the artwork defines one.
            button.setAttribute("aria-label", item.dataset.galleryLabel || image.alt);
        }
        // Link the navigation button to its artwork for language updates.
        if (image && item.id) {
            button.setAttribute("aria-controls", item.id);
        }
        button.setAttribute("aria-current", "false");
        button.addEventListener("click", function () {
            centreItem(item);
        });
        controls.append(button);
        return button;
    });

    // Reveal the focused button by moving only the overflowing navigation bar.
    function keepKeyboardFocusVisible() {
        if (controls.scrollWidth <= controls.clientWidth) return false;

        const button = controls.querySelector(".gallery-dot:focus-visible");
        if (!button) return false;

        const buttonStart = button.offsetLeft;
        const buttonEnd = buttonStart + button.offsetWidth;
        if (buttonStart < controls.scrollLeft) {
            controls.scrollLeft = buttonStart;
        } else if (buttonEnd > controls.scrollLeft + controls.clientWidth) {
            controls.scrollLeft = buttonEnd - controls.clientWidth;
        }

        return true;
    }

    controls.addEventListener("focusin", function () {
        requestAnimationFrame(keepKeyboardFocusVisible);
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

        const keyboardFocusIsInBar = keepKeyboardFocusVisible();
        if (nearestIndex === activeIndex) return;
        activeIndex = nearestIndex;
        buttons.forEach(function (button, index) {
            button.setAttribute("aria-current", String(index === activeIndex));
        });

        // Keep keyboard focus in view when the selected artwork changes.
        if (keyboardFocusIsInBar) return;

        // Centre the active button in the bar when keyboard focus is elsewhere.
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

    // Keep the title button's name and language aligned with the heading.
    const titleButton = buttons[items.indexOf(title.closest(".chapter-title-panel"))];

    function updateTitleButton() {
        titleButton.setAttribute("aria-label", title.textContent);
        titleButton.lang = title.lang || document.documentElement.lang;
    }

    updateTitleButton();
    new MutationObserver(updateTitleButton).observe(title, {
        attributes: true,
        attributeFilter: ["lang"],
        childList: true,
        characterData: true,
        subtree: true
    });

    chapter.append(controls);
    chapter.classList.add("has-gallery-controls");
    new ResizeObserver(updateActiveItem).observe(scroller);
    document.fonts.ready.then(updateActiveItem);
});
