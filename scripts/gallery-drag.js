// Enable mouse dragging while preserving native touch and keyboard scrolling.
document.querySelectorAll(".chapter-scroll").forEach(function (scroller) {
    // Move the gallery farther with a shorter mouse gesture.
    const dragSensitivity = 1.6;
    let drag = null;
    let suppressClick = false;
    let animationFrame = 0;

    // Stop an unfinished glide as soon as a new interaction begins.
    function stopGlide() {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        scroller.classList.remove("is-settling");
    }

    // Ease into the selected centre while keeping native snap disabled.
    function glideTo(destination) {
        const start = scroller.scrollLeft;
        const distance = destination - start;
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion || Math.abs(distance) < 1) {
            scroller.scrollLeft = destination;
            scroller.classList.remove("is-settling");
            return;
        }

        const duration = Math.min(650, Math.max(350, Math.abs(distance) * 0.5));
        const started = performance.now();

        function step(now) {
            const progress = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            scroller.scrollLeft = start + distance * eased;

            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            } else {
                animationFrame = 0;
                scroller.scrollLeft = destination;
                scroller.classList.remove("is-settling");
            }
        }

        animationFrame = requestAnimationFrame(step);
    }

    // Start only with the primary mouse button and leave controls clickable.
    scroller.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        if (event.target.closest("button, a, input, select, textarea")) {
            stopGlide();
            return;
        }

        // Keep the current position when interrupting an existing glide.
        scroller.classList.add("is-dragging");
        stopGlide();
        suppressClick = false;
        drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScroll: scroller.scrollLeft,
            lastX: event.clientX,
            lastTime: performance.now(),
            velocity: 0,
            moved: false
        };
        event.preventDefault();
    });

    // Follow the pointer and retain its recent speed for a gentle release.
    scroller.addEventListener("pointermove", function (event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        const distance = event.clientX - drag.startX;

        if (!drag.moved) {
            if (Math.abs(distance) < 6) return;
            drag.moved = true;
            scroller.setPointerCapture(event.pointerId);
        }

        const now = performance.now();
        const elapsed = Math.max(8, now - drag.lastTime);
        const speed = (drag.lastX - event.clientX) * dragSensitivity / elapsed;
        drag.velocity = drag.velocity * 0.6 + speed * 0.4;
        drag.lastX = event.clientX;
        drag.lastTime = now;

        event.preventDefault();
        scroller.scrollLeft = drag.startScroll - distance * dragSensitivity;
    });

    // Let the release speed help select the next centre instead of snapping back.
    function finishDrag(event) {
        if (!drag) return;
        const completedDrag = drag;
        drag = null;

        if (scroller.hasPointerCapture(completedDrag.pointerId)) {
            scroller.releasePointerCapture(completedDrag.pointerId);
        }
        if (!completedDrag.moved) {
            scroller.classList.remove("is-dragging");
            return;
        }

        const cancelled = event && (
            event.type === "pointercancel" || event.type === "blur"
        );
        const recentRelease = performance.now() - completedDrag.lastTime < 100;
        const momentum = !cancelled && recentRelease
            ? completedDrag.velocity * 180 : 0;
        const limit = scroller.clientWidth * 0.65;
        const projectedOffset = Math.max(-limit, Math.min(limit, momentum));
        const bounds = scroller.getBoundingClientRect();
        const centre = bounds.left + scroller.clientWidth / 2;
        let nearestOffset = 0;
        let nearestDistance = Infinity;

        scroller.querySelectorAll(
            ".gallery-artwork, .chapter-title-panel"
        ).forEach(function (item) {
            const itemBounds = item.getBoundingClientRect();
            const offset = itemBounds.left + itemBounds.width / 2 - centre;
            const distance = Math.abs(offset - projectedOffset);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestOffset = offset;
            }
        });

        const destination = Math.max(0, Math.min(
            scroller.scrollWidth - scroller.clientWidth,
            scroller.scrollLeft + nearestOffset
        ));
        scroller.classList.add("is-settling");
        scroller.classList.remove("is-dragging");
        glideTo(destination);

        // Prevent the drag release from becoming an unintended click.
        suppressClick = true;
        setTimeout(function () {
            suppressClick = false;
        }, 0);
    }

    window.addEventListener("pointerup", finishDrag);
    scroller.addEventListener("pointercancel", finishDrag);
    scroller.addEventListener("lostpointercapture", finishDrag);
    window.addEventListener("blur", finishDrag);
    scroller.addEventListener("wheel", stopGlide, { passive: true });
    scroller.addEventListener("keydown", stopGlide);
    scroller.closest(".chapter").querySelector(".gallery-pagination").addEventListener(
        "pointerdown", stopGlide
    );

    scroller.addEventListener("click", function (event) {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
    }, true);

    // Prevent the browser from dragging the artwork image itself.
    scroller.addEventListener("dragstart", function (event) {
        event.preventDefault();
    });

    scroller.classList.add("is-draggable");
});
