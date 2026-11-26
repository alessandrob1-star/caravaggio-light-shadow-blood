// Read the stored translations from the shared content archive.
import { getText, getSectionTitles } from "./texts.js";

// Select the language controls and the artwork detail buttons.
const selector = document.querySelector(".language-selector");
const toggle = document.getElementById("language-toggle");
const options = document.getElementById("language-options");
const flag = document.getElementById("selected-language-flag");
const status = document.getElementById("language-status");
const languageButtons = options.querySelectorAll("[data-language]");
const detailButtons = document.querySelectorAll(".chapter .helper-button");

// Start each page visit in English and prevent overlapping updates.
let selectedLanguage = "en";
let isUpdating = false;

// Allow the helper controls to read the current language.
export function getSelectedLanguage() {
    return selectedLanguage;
}

// Close the list and optionally return keyboard focus to its opening button.
function closeLanguageMenu(returnFocus) {
    options.hidden = true;
    toggle.setAttribute("aria-expanded", "false");

    if (returnFocus) {
        toggle.focus({ preventScroll: true });
    }
}

// Open the list with focus on the currently selected language.
toggle.addEventListener("click", function () {
    if (!options.hidden) {
        closeLanguageMenu(true);
        return;
    }

    options.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    options.querySelector('[aria-pressed="true"]').focus();
});

// Read and validate all artwork descriptions before changing the page language.
async function getArtworkUpdates(language) {
    const response = await fetch("data/whatwg-screen-reader-artwork-descriptions.json");
    if (!response.ok) {
        throw new Error("The artwork descriptions could not be loaded.");
    }
    const archive = await response.json();

    return Array.from(document.querySelectorAll(".gallery-artwork[id]"), function (figure) {
        const chapter = figure.closest(".chapter");
        const entry = archive[chapter.id]?.[figure.id]?.[language];
        if (!entry?.alt?.trim() || !entry?.label?.trim()) {
            throw new Error("The artwork translation is incomplete.");
        }
        return {
            image: figure.querySelector(".artwork-image img"),
            button: chapter.querySelector('.gallery-dot[aria-controls="' + figure.id + '"]'),
            entry
        };
    });
}

// Load every anecdote before changing the displayed language.
languageButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
        if (isUpdating) {
            return;
        }

        isUpdating = true;
        selector.setAttribute("aria-busy", "true");
        status.textContent = "";

        const language = button.dataset.language;
        const languageTag = button.lang;

        try {
            // Load all section titles before updating the page.
            const [sectionTitles, artworks] = await Promise.all([
                getSectionTitles(language),
                getArtworkUpdates(language)
            ]);
            const updates = await Promise.all(
                Array.from(detailButtons).map(async function (detailButton) {
                    return {
                        caption: detailButton.closest("figcaption"),
                        lines: await getText(
                            "anecdotes",
                            detailButton.dataset.helper,
                            language
                        )
                    };
                })
            );

            // Set the reading language on each translated image and gallery button.
            artworks.forEach(function ({ image, button, entry }) {
                image.lang = languageTag;
                image.alt = entry.alt;
                if (button) {
                    button.lang = languageTag;
                    button.setAttribute("aria-label", entry.label);
                }
            });

            // Replace only the anecdote lines, preserving each helper button.
            updates.forEach(function (update) {
                update.caption.querySelectorAll(":scope > span").forEach(
                    function (span) {
                        span.remove();
                    }
                );

                update.lines.forEach(function (text) {
                    const span = document.createElement("span");
                    span.textContent = text;
                    span.lang = languageTag;
                    update.caption.append(span);
                });
            });

            // Update each section heading and its navigation label.
            ["light", "shadow", "blood"].forEach(function (id) {
                const heading = document.getElementById(id + "-title");
                const link = document.querySelector(
                    '.chapter-navigation a[href="#' + id + '"]'
                );

                heading.textContent = sectionTitles[id];
                heading.lang = languageTag;

                link.textContent = sectionTitles[id];
                link.lang = languageTag;
            });

            // Update the shared language state, selected flag and button states.
            selectedLanguage = language;
            flag.src = button.querySelector("img").getAttribute("src");

            languageButtons.forEach(function (choice) {
                choice.setAttribute(
                    "aria-pressed",
                    String(choice === button)
                );
            });

            toggle.setAttribute(
                "aria-label",
                "Choose language. Current language: " +
                    button.textContent.trim() + "."
            );

            closeLanguageMenu(true);
        } catch (error) {
            // Keep the current language if the requested content cannot be loaded.
            status.textContent =
                "The language could not be changed. Please reload the page and try again.";

            closeLanguageMenu(true);
        } finally {
            isUpdating = false;
            selector.setAttribute("aria-busy", "false");
        }
    });
});

// Close the language list when clicking elsewhere on the page.
document.addEventListener("click", function (event) {
    if (!selector.contains(event.target)) {
        closeLanguageMenu(false);
    }
});

// Support closing the list with Escape and restore keyboard focus.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !options.hidden) {
        event.preventDefault();
        closeLanguageMenu(true);
    }
});
