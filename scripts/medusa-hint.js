(() => {
    const buttons = document.querySelectorAll(".chapter .helper-button");
    let shown = false;
    const observer = new IntersectionObserver((entries) => {
        if (shown || document.visibilityState !== "visible") return;
        const entry = entries.find((item) => item.isIntersecting && item.intersectionRatio >= 0.9);
        if (!entry) return;
        shown = true;
        observer.disconnect();
        const button = entry.target;
        const hand = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        hand.classList.add("medusa-tap-hint");
        hand.setAttribute("viewBox", "0 0 44 52");
        hand.setAttribute("aria-hidden", "true");
        hand.setAttribute("focusable", "false");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 28V6a4 4 0 0 1 8 0v17-6a4 4 0 0 1 8 0v7-4a4 4 0 0 1 8 0v6-2a3.5 3.5 0 0 1 7 0v10c0 6-3 10-6 13v4H17v-5L3 32c-4-5 2-10 6-6l3 2Z");
        hand.append(path);
        button.append(hand);
        const dismiss = () => hand.remove();
        buttons.forEach((control) => {
            control.addEventListener("click", dismiss, { once: true });
        });
    }, { threshold: 0.9 });

    buttons.forEach((button) => observer.observe(button));
})();
