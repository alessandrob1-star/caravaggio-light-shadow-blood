// Read the stored translations from the shared content archive.
import { getText, getSectionTitles } from "./texts.js";
import { getCreditsTranslation, applyCreditsTranslation } from "./credits.js?v=20261128-1";
import { getControlLabels, setControlLanguage } from "./whatwg-screen-reader-controls.js?v=20261127-1";

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

// Keep translated controls and their reading languages aligned.
function updateControlLabels() {
    const labels = getControlLabels();
    const languageTag = selectedLanguage === "zh" ? "zh-Hans" : selectedLanguage;
    const choice = options.querySelector('[data-language="' + selectedLanguage + '"]');
    toggle.lang = languageTag;
    toggle.setAttribute("aria-label", labels.chooseLanguage + " " +
        labels.currentLanguage + " - " + choice.textContent.trim() + ".");
    options.setAttribute("aria-label", labels.availableLanguages);
    options.lang = languageTag;
    status.lang = languageTag;
    document.querySelector(".chapter-navigation").setAttribute("aria-label", labels.mainNavigation);
    document.querySelector(".chapter-navigation").lang = languageTag;

    detailButtons.forEach(function (button) {
        const figure = button.closest("figure");
        button.lang = languageTag;
        button.setAttribute("aria-label", labels.readExplanation + " - " + figure.dataset.galleryLabel);
    });

    document.querySelectorAll(".chapter").forEach(function (chapter) {
        const scroller = chapter.querySelector(".chapter-scroll");
        scroller.lang = languageTag;
        scroller.setAttribute("aria-label", labels.gallery + " - " +
            chapter.querySelector(".chapter-title").textContent);
    });

    const dialog = document.getElementById("artwork-helper");
    dialog.lang = languageTag;
    dialog.setAttribute("aria-label", labels.additionalInformation);
    dialog.querySelector(".helper-close").setAttribute("aria-label", labels.closeExplanation);
    document.getElementById("helper-text").setAttribute("aria-label", labels.explanationText);
    document.dispatchEvent(new Event("sitecontrolslanguagechange"));
}

updateControlLabels();

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
            figure,
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
            const [sectionTitles, artworks, creditsTranslation] = await Promise.all([
                getSectionTitles(language),
                getArtworkUpdates(language),
                getCreditsTranslation(language)
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
            artworks.forEach(function ({ figure, image, button, entry }) {
                figure.dataset.galleryLabel = entry.label;
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

                // Preserve the line breaks in the translated caption.
                const span = document.createElement("span");
                span.lang = languageTag;
                update.lines.forEach(function (text, index) {
                    if (index > 0) {
                        span.append(document.createElement("br"));
                    }
                    span.append(text);
                });
                update.caption.append(span);
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

            applyCreditsTranslation(creditsTranslation, languageTag);

            // Update the shared language state, selected flag and button states.
            selectedLanguage = language;
            setControlLanguage(language);
            flag.src = button.querySelector("img").getAttribute("src");

            languageButtons.forEach(function (choice) {
                choice.setAttribute(
                    "aria-pressed",
                    String(choice === button)
                );
            });

            updateControlLabels();

            closeLanguageMenu(true);
        } catch (error) {
            // Keep the current language if the requested content cannot be loaded.
            status.textContent =
                getControlLabels().languageError;

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
