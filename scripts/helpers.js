// Import the function that reads the multilingual content archive.
import { getText } from "./texts.js";

// Select the controls and content area for the Medusa explanation.
const medusaButton = document.getElementById("medusa-helper-button");
const medusaDialog = document.getElementById("medusa-helper");
const medusaPanel = medusaDialog.querySelector(".helper-panel");
const medusaClose = medusaDialog.querySelector(".helper-close");
const medusaText = document.getElementById("medusa-helper-text");

// Create paragraphs as plain text, preserving the original wording.
function showExplanation(paragraphs) {
    medusaText.replaceChildren();

    paragraphs.forEach(function (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        medusaText.append(paragraph);
    });
}

// Open the dialog and load the English explanation from the JSON archive.
medusaButton.addEventListener("click", async function () {
    medusaDialog.showModal();
    document.body.classList.add("helper-open");
    medusaButton.setAttribute("aria-expanded", "true");

    medusaText.setAttribute("aria-busy", "true");
    showExplanation(["Loading explanation…"]);

    try {
        const paragraphs = await getText("helpers", "medusa-eyes", "en");

        if (medusaDialog.open) {
            showExplanation(paragraphs);
        }
    } catch (error) {
        // Report a loading failure instead of displaying an empty explanation.
        if (medusaDialog.open) {
            showExplanation([
                "The explanation could not be loaded. Please reload the page and try again."
            ]);
        }
    } finally {
        medusaText.setAttribute("aria-busy", "false");
    }
});

// Close the dialog when its X button is selected.
medusaClose.addEventListener("click", function () {
    medusaDialog.close();
});

// Close with one click outside the gold explanation panel.
medusaDialog.addEventListener("click", function (event) {
    if (!medusaPanel.contains(event.target)) {
        medusaDialog.close();
    }
});

// Restore scrolling and return keyboard focus after the dialog closes.
// The native dialog also supports closing with the Escape key.
medusaDialog.addEventListener("close", function () {
    document.body.classList.remove("helper-open");
    medusaButton.setAttribute("aria-expanded", "false");
    medusaButton.focus({ preventScroll: true });
});
