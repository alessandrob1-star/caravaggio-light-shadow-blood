// Keep one shared request so the JSON is downloaded only once.
let textsRequest;

// Read the content archive and check the HTTP response.
function loadTexts() {
    if (!textsRequest) {
        textsRequest = fetch("data/texts.json").then(function (response) {
            if (!response.ok) {
                throw new Error("The content archive could not be loaded.");
            }

            return response.json();
        });
    }

    return textsRequest;
}

// Return the requested text without changing its wording.
// English is used when no language is explicitly specified.
export async function getText(category, cropId, language = "en") {
    const texts = await loadTexts();
    const paragraphs = texts[category]?.[cropId]?.[language];

    // Reject missing or invalid content instead of displaying an empty helper.
    if (
        !Array.isArray(paragraphs) ||
        paragraphs.length === 0 ||
        !paragraphs.every(function (paragraph) {
            return typeof paragraph === "string" && paragraph.length > 0;
        })
    ) {
        throw new Error("The requested text is missing or invalid.");
    }

    return paragraphs;
}
