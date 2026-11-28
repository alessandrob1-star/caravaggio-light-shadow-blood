// Load the Credits translations before updating the selected page language.
let creditsRequest;
const credits = document.getElementById("credits");
const paragraphs = Array.from(credits.querySelectorAll(".credits-content > p"));
const mediaTitles = [
    "Caravaggio: The Soul and the Blood",
    "Caravaggio - L’anima e il sangue",
    "Experience",
    "In a Time Lapse"
];

export async function getCreditsTranslation(language) {
    if (!creditsRequest) {
        creditsRequest = fetch("data/credits-translations.json?v=20261128-1")
            .then(function (response) {
                if (!response.ok) throw new Error("The Credits translations could not be loaded.");
                return response.json();
            }).catch(function (error) {
                creditsRequest = undefined;
                throw error;
            });
    }
    const archive = await creditsRequest;
    const entry = archive[language];
    const labels = ["title", "mediaHeading", "repositoryLink", "socialProfiles", "linkedIn", "github"];
    if (!entry || !labels.every(function (key) {
        return typeof entry[key] === "string" && entry[key].trim();
    }) || !Array.isArray(entry.paragraphs) || entry.paragraphs.length !== paragraphs.length ||
        !entry.paragraphs.every(function (text) {
            return typeof text === "string" && text.trim();
        }) || entry.paragraphs.filter(function (text) {
            return text.includes("{repository}");
        }).length !== 1) {
        throw new Error("The Credits translation is missing or incomplete.");
    }
    return entry;
}

// Build translated content with text nodes and fixed link destinations.
function renderParagraph(text, index, entry) {
    const fragment = document.createDocumentFragment();
    const tokens = index === 6 || index === 7 ? mediaTitles : ["{repository}"];
    let remaining = text;
    while (remaining) {
        let found = null;
        let position = remaining.length;
        tokens.forEach(function (token) {
            const next = remaining.indexOf(token);
            if (next !== -1 && next < position) {
                position = next;
                found = token;
            }
        });
        fragment.append(document.createTextNode(remaining.slice(0, position)));
        if (found === null) break;
        if (found === "{repository}") {
            const link = document.createElement("a");
            link.href = "https://github.com/alessandrob1-star/caravaggio-light-shadow-blood";
            link.textContent = entry.repositoryLink;
            fragment.append(link);
        } else {
            const title = document.createElement("em");
            title.textContent = found;
            fragment.append(title);
        }
        remaining = remaining.slice(position + found.length);
    }
    return fragment;
}

export function applyCreditsTranslation(entry, languageTag) {
    paragraphs.forEach(function (paragraph, index) {
        paragraph.replaceChildren(renderParagraph(entry.paragraphs[index], index, entry));
    });
    credits.lang = languageTag;
    document.getElementById("credits-title").textContent = entry.title;
    document.getElementById("credits-title").lang = languageTag;
    credits.querySelector("h3").textContent = entry.mediaHeading;
    const social = credits.querySelector(".credits-social");
    social.setAttribute("aria-label", entry.socialProfiles);
    social.querySelector('a[href*="linkedin.com"]').setAttribute("aria-label", entry.linkedIn);
    social.querySelector('a[href*="github.com"]').setAttribute("aria-label", entry.github);
}
