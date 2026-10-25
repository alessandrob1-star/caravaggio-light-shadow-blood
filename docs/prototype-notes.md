# Prototype implementation notes

Snapshot: 25 October 2026. Scope: the interactive Figma prototype for Assessment 1.

## Navigation and composition

A vertically arranged parent frame connects the opening screen and the LIGHT, SHADOW and BLOOD chapters. Each chapter contains a long horizontal content track within its own viewport. This allows vertical movement between chapters and horizontal exploration within a chapter.

Full artworks provide context through title, year and collection/location. Selected crops have a short anecdote and a gold helper button. Neighbouring content is deliberately allowed to appear at the sides to suggest horizontal exploration.

LIGHT uses a cream background, SHADOW a charcoal background, and BLOOD a warm background with red typography and a horizontal red motif.

## Helper interaction

Each helper opens a dedicated overlay containing the selected crop, its chapter background and one explanatory panel. Surrounding gallery content is covered.

The close interaction has explicit targets: the × control and the area outside the gold-bordered panel within the prototype viewport. Clicking the panel itself keeps it open. Opening controls use a single click action without hover-driven variant changes; this avoids duplicate overlay openings that would otherwise require repeated closing clicks. Mouse-enter and mouse-leave events independently toggle the existing warm reflection on each gold button through a stored Boolean variable. This restores visual hover feedback without switching variants or adding overlay openings.

The design aims to keep the crop and explanation centred and the entire text panel visible. Text size and panel placement must accommodate longer translations. This remains a desktop prototype; the screenshots do not establish responsive behaviour at every screen size.

## Language selection

Eight languages are stored in the Figma file: Italian, English, German, French, Simplified Chinese, Japanese, Polish and Dutch.

The selector sets a shared language variable. Text bindings use the selected language, and helper opening actions set language-specific visibility flags so that one translated panel is shown. The translation content is pre-written and stored locally in the design. No runtime translation API is used.

The Italian master is author-controlled. Translation maintenance must preserve its meaning and wording; translating the content does not authorise rewriting the Italian source.

The archived TXT contains the current 20 crop anecdotes and 20 helper explanations in all eight languages. It is a verbatim content export, not a new editorial revision.

## Introductory video

The opening video is configured for autoplay in Figma. A previously observed playback delay disappeared after clearing the affected browser cache and was absent in another browser. That observation does not establish identical media loading performance for all visitors.

The screenshot in the README captures a still frame; use the interactive prototype to inspect playback.

## Verification and limits

Recent checks covered helper structure, translated panel visibility and close interactions. After removing duplicate opening actions and hover-driven variant transitions, the Basket of Fruit helper was directly verified to close on the first outside click and on the first × click in the browser preview.

The translation archive was checked for 20 crops across eight languages, with 160 anecdote entries and 160 helper entries. Its approved Italian source blocks were compared against the stored master.

These checks describe specific observations. They are not a claim of exhaustive testing across all devices, browsers and language combinations.

## Planned website behaviour

The website phase will implement browser-native scrolling and scroll snapping so that vertical chapter transitions can settle on the chapter title and horizontal exploration can centre selected items. Automatic title centring is not implemented in this Figma prototype.

Responsive layouts, semantic HTML, keyboard and focus handling, reduced-motion preferences, media controls, performance and accessibility testing will be addressed during website development. AWS hosting and the guestbook are later work-plan items.

## Assessment handoff

Assessment 1 is the prototype deliverable. The planned submission package includes the interactive URL and a PDF with selected images and brief technical notes. Repository publication does not mean the university submission has been made or the PDF package has been completed.

