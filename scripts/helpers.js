// Import the function that reads the multilingual content archive.
import { getText } from "./texts.js";

// Share one dialog between the detail buttons in all three galleries.
const helperButtons = document.querySelectorAll(".chapter .helper-button");
const helperDialog = document.getElementById("artwork-helper");
const helperPanel = helperDialog.querySelector(".helper-panel");
const helperClose = helperDialog.querySelector(".helper-close");
const helperCrop = document.getElementById("helper-crop");
const helperText = document.getElementById("helper-text");
let activeButton = null;

// Create paragraphs as plain text, preserving wording and deliberate line breaks.
function showExplanation(paragraphs) {
    helperText.replaceChildren();

    paragraphs.forEach(function (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        helperText.append(paragraph);
    });
}

// Copy the selected image and reuse the crop settings from its gallery class.
function showCrop(button) {
    const figure = button.closest("figure");
    const chapter = figure.closest(".chapter");
    const sourceImage = figure.querySelector(".artwork-image img");
    const cropId = button.dataset.helper;

    helperCrop.className = "artwork-image helper-crop " + chapter.id + "-artwork--" + cropId;
    helperCrop.replaceChildren(sourceImage.cloneNode(true));
    helperDialog.dataset.section = chapter.id;
    helperDialog.setAttribute("aria-label", sourceImage.alt + ": additional information");
}

// Open each detail with its matching English explanation from the JSON archive.
helperButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
        activeButton = button;
        showCrop(button);
        showExplanation(["Loading explanation…"]);
        helperText.setAttribute("aria-busy", "true");

        helperDialog.showModal();
        document.body.classList.add("helper-open");
        button.setAttribute("aria-expanded", "true");

        try {
            const paragraphs = await getText("helpers", button.dataset.helper, "en");

            // Ignore an earlier request if another detail has since been opened.
            if (helperDialog.open && activeButton === button) {
                showExplanation(paragraphs);
            }
        } catch (error) {
            // Report a loading failure instead of displaying an empty explanation.
            if (helperDialog.open && activeButton === button) {
                showExplanation([
                    "The explanation could not be loaded. Please reload the page and try again."
                ]);
            }
        } finally {
            if (activeButton === button) {
                helperText.setAttribute("aria-busy", "false");
            }
        }
    });
});

// Close the explanation when its X button is selected.
helperClose.addEventListener("click", function () {
    helperDialog.close();
});

// Close with one click outside the gold explanation panel.
helperDialog.addEventListener("click", function (event) {
    if (!helperPanel.contains(event.target)) {
        helperDialog.close();
    }
});

// Restore scrolling and return focus to the button that opened the explanation.
// The native dialog also supports closing with the Escape key.
helperDialog.addEventListener("close", function () {
    document.body.classList.remove("helper-open");

    if (activeButton) {
        activeButton.setAttribute("aria-expanded", "false");
        activeButton.focus({ preventScroll: true });
        activeButton = null;
    }
});
