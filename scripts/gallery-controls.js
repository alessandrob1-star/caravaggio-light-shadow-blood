// Build a manual navigation bar for each horizontally scrolling gallery.
document.querySelectorAll(".chapter").forEach(function (chapter) {
    const scroller = chapter.querySelector(".chapter-scroll");
    const track = scroller.querySelector(".chapter-track");
    const captions = track.querySelectorAll(".gallery-caption");
    const title = chapter.querySelector(".chapter-title");
    const items = Array.from(
        scroller.querySelectorAll(".gallery-artwork, .chapter-title-panel")
    );
    const controls = document.createElement("div");
    controls.className = "gallery-pagination";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-labelledby", title.id);

    const scrollbar = document.createElement("div");
    scrollbar.className = "gallery-scrollbar";
    scrollbar.tabIndex = 0;
    scrollbar.setAttribute("role", "group");
    scrollbar.setAttribute("aria-labelledby", title.id);
    const scrollbarTrack = document.createElement("div");
    scrollbarTrack.className = "gallery-scrollbar-track";
    scrollbar.append(scrollbarTrack);

    // Keep the visible scrollbar aligned with the current gallery position.
    function syncScrollbar() {
        if (scrollbar.clientWidth) scrollbar.scrollLeft = scroller.scrollLeft;
    }

    scrollbar.addEventListener("scroll", function () {
        if (Math.abs(scrollbar.scrollLeft - scroller.scrollLeft) < 1) return;
        scroller.classList.add("is-using-scrollbar");
        scroller.scrollLeft = scrollbar.scrollLeft;
    });

    scrollbar.addEventListener("scrollend", function () {
        scroller.classList.remove("is-using-scrollbar");
    });

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
            syncScrollbar();
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

    chapter.append(controls, scrollbar);
    chapter.classList.add("has-gallery-controls");

    // Keep the dot bar below the captions, except on the narrowest screens.
    function updateNavigationLayout() {
        // Measure from the track so the native scrollbar does not affect the test.
        const style = getComputedStyle(controls);
        const trackBounds = track.getBoundingClientRect();
        const barInset = parseFloat(style.getPropertyValue("--dot-bar-inset")) || 0;
        const liftCompleteArtworks = style.getPropertyValue("--lift-complete-artworks").trim() === "1";
        const formerSpace = parseFloat(track.style.getPropertyValue("--gallery-navigation-space")) || 0;
        const barTop = trackBounds.bottom - formerSpace - parseFloat(style.bottom) -
            controls.offsetHeight + barInset;
        let captionOverlap = 0;
        const lifts = [];

        captions.forEach(function (caption) {
            const artwork = caption.parentElement;
            const formerLift = parseFloat(artwork.style.getPropertyValue("--artwork-caption-lift")) || 0;
            const captionBottom = caption.getBoundingClientRect().bottom + formerLift;
            let lift = 0;

            // Keep the dot bar on laptops by lifting only complete artworks that need it.
            if (liftCompleteArtworks && caption.classList.contains("artwork-caption")) {
                const imageTop = artwork.querySelector(".artwork-image")
                    .getBoundingClientRect().top + formerLift;
                const availableSpace = Math.max(0, imageTop - trackBounds.top - 4);
                lift = Math.min(availableSpace, Math.max(0, captionBottom + 4 - barTop));
            }

            if (lift !== formerLift) lifts.push({ artwork, lift });
            captionOverlap = Math.max(captionOverlap, captionBottom - lift - barTop);
        });

        lifts.forEach(function ({ artwork, lift }) {
            artwork.style.setProperty("--artwork-caption-lift", lift + "px");
        });

        const useNativeScrollbar = captionOverlap > 0 &&
            window.matchMedia("(max-width: 360px)").matches;
        // Reserve caption space even when the dot bar gives way to the scrollbar.
        const extraSpace = captionOverlap > 0
            ? Math.ceil(captionOverlap + 4)
            : 0;
        if (extraSpace !== formerSpace) {
            track.style.setProperty("--gallery-navigation-space", extraSpace + "px");
        }

        if (
            (useNativeScrollbar && controls.contains(document.activeElement)) ||
            (!useNativeScrollbar && document.activeElement === scrollbar)
        ) {
            scroller.focus({ preventScroll: true });
        }

        chapter.classList.toggle("use-native-scrollbar", useNativeScrollbar);
        if (scrollbar.clientWidth) {
            // Match the gallery's full scroll range when the bar is visible.
            scrollbarTrack.style.width =
                scrollbar.clientWidth + scroller.scrollWidth - scroller.clientWidth + "px";
            syncScrollbar();
        } else {
            scroller.classList.remove("is-using-scrollbar");
        }
        updateActiveItem();
    }

    const navigationObserver = new ResizeObserver(updateNavigationLayout);
    navigationObserver.observe(scroller);
    navigationObserver.observe(track);
    navigationObserver.observe(controls);
    captions.forEach(function (caption) {
        navigationObserver.observe(caption);
    });
    new MutationObserver(updateNavigationLayout).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-active-section"]
    });
    document.fonts.ready.then(updateNavigationLayout);
});
