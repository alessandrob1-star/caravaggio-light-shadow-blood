# Prototype architecture and technical decisions

**Assessment 1 — Figma interactive prototype**

Alessandro Benevelli · COMP-2002 Web Development · Open Institute of Technology (OPIT)

Professor: Filip Biały · Snapshot: 25 October 2026

## 1. One vertical journey, three horizontal galleries

The main desktop frame is **1920 × 1018**, configured for **vertical scrolling**. It connects the introductory screen and the LIGHT, SHADOW and BLOOD chapters in one continuous experience.

Each chapter has its own **1920 × 1018 horizontal scrolling frame**. Inside it, a single extended content frame holds the chapter title, complete paintings, selected crops, captions and helper buttons.

| Level | Figma structure | Responsibility |
| --- | --- | --- |
| Main prototype | Vertical scrolling frame | Move from the opening screen through the chapters |
| Chapter viewport | Horizontal scrolling frame | Explore a chapter without leaving its vertical position |
| Extended content | One long frame per chapter | Arrange artworks, details, captions and title continuously |
| Helper overlay | Separate focused frame | Present a selected detail and its explanation above the gallery |

The current tracks are **13,589 px for LIGHT**, **18,489 px for SHADOW**, and **14,457 px for BLOOD**. They are continuous compositions rather than sequences of disconnected full-screen slides. The tracks extend on both sides of their chapter titles.

The canvas overview shows the complete arrangement; the interactive preview presents the portion reached through scrolling.

![Opening frame and three extended horizontal galleries in Figma](../assets/screenshots/prototype-canvas-structure.png)

## 2. Composition and reusable elements

Complete paintings establish context through title, year and collection/location. Selected details have a short anecdote and a gold helper button. Helper controls belong to the details rather than the complete paintings.

Spacing allows neighbouring content to appear at the edges, suggesting horizontal exploration. LIGHT uses cream, SHADOW charcoal, and BLOOD warm beige with red typography and a horizontal red motif.

The file contains reusable components and instances for artwork/detail text blocks, help controls, the language selector and flags, alongside shared text styles and variable collections. Most established detail blocks use component instances; the two later SHADOW additions use separately configured frames. The prototype combines reused components and explicitly configured additions.

## 3. Two levels of storytelling

Short anecdotes remain visible in the gallery and invite interpretation. Longer explanations appear only when requested through the gold button. This separates visual exploration from optional reading without displaying every explanation permanently.

## 4. Focused helper overlays

There are **20 detail helpers**. Each opens a dedicated overlay containing the selected crop, the chapter background and one gold-bordered explanation panel.

The overlay covers surrounding artworks, captions and the original anecdote. A shorter translation therefore cannot leave fragments of the underlying anecdote exposed.

Explicit close targets are provided:

- **×:** a larger clickable area around the visible glyph.
- **Outside the gold-bordered panel:** the overlay background closes the helper.
- **On the crop:** the image area also acts as a close target.
- **Inside the explanation panel:** clicking the text keeps the helper open.

These targets belong to the prototype viewport. Unrelated browser chrome and the black area outside the preview are not equivalent targets.

Opening controls retain **one click reaction with one overlay-opening action**. Language preparation and opening occur within that reaction. This avoids stacked overlays that require repeated closing clicks.

Only one explanation is presented at a time. The overlay background covers gallery controls, preventing another underlying helper from being selected through it.

## 5. Hover feedback without duplicate openings

The existing button artwork contains a base brass image and a warmer reflection layer.

**Mouse-enter and mouse-leave events** toggle a Boolean variable controlling the reflection. Clicking resets the feedback state and opens the helper. No component variant switch is required.

This separates appearance from navigation: hovering changes the visual state; clicking opens the explanation. The mechanism is configured on all 20 live helper buttons, including the two later SHADOW additions.

## 6. Eight stored language versions

Italian, English, German, French, Simplified Chinese, Japanese, Polish and Dutch are stored in the Figma file.

The interactive selector sets the shared language code and updates text and presentation variables using saved translations.

| Content | Application of the selected language |
| --- | --- |
| Short anecdotes and other bound text | Selector actions assign stored language-specific strings to variables bound to text layers |
| Helper explanations | Opening actions compare the shared language code with each supported language and set Boolean flags to display the matching panel |

Each helper contains saved language-specific explanation panels. The active language determines which appears. No translation API is called when visitors select a language.

The choice applies to **both short anecdotes and longer helper explanations**.

The TXT archive contains **20 anecdotes and 20 explanations across eight languages: 320 text entries**. It is a verbatim export. The Italian master and approved translations must not be rewritten during layout or technical work.

## 7. Typography and panel fitting

Translations vary in length, line breaks and writing system. A panel that fits English may not fit Polish or German; Chinese and Japanese require appropriate font coverage.

Language-specific text panels and typography adjustments, including CJK-capable fonts, accommodate these differences. Font size, wrapping and panel position are adjusted to keep the explanation inside its border and the full panel visible.

The overlay background covers the surrounding gallery independently of the explanation panel’s height. Fitting changes affect layout, not the wording of the content.

This remains a desktop composition. These adjustments do not constitute a responsive layout system for every screen size.

## 8. Introductory video

The video is configured for autoplay in Figma. README screenshots show still frames; the interactive link is needed to inspect playback.

An earlier loading delay disappeared after clearing the affected browser cache and was absent in another browser. This was a specific observation, not proof of identical loading times for every visitor.

The website will need its own media delivery and playback handling, tested under actual browser autoplay rules and network conditions.

## 9. Figma behaviour versus planned website behaviour

The prototype establishes the visual direction and demonstrates the main interactions. It does not execute the future website’s HTML, CSS, JavaScript or backend.

| Area | Current prototype | Planned website |
| --- | --- | --- |
| Vertical navigation | Scroll between the opening screen and chapter frames | Browser scrolling with chapter snap points |
| Chapter entry | Horizontal position follows the current prototype interaction | Settle on the chapter title when entering LIGHT, SHADOW or BLOOD |
| Horizontal exploration | Scroll through extended chapter frames | Horizontal containers with item-centering snap points |
| Helpers | Focused overlays and explicit close targets | Reusable modal, one active explanation, background scroll locking, outside-click dismissal and Escape support |
| Keyboard and focus | Demonstrates the intended visual flow | Keyboard-operable controls, focus moved into the modal and restored to its trigger |
| Languages | Saved strings, text bindings and visibility flags | Local translation resources driven by one shared language state |
| Layout | Fixed desktop composition with language-specific fitting | Responsive artwork, spacing and panels for desktop, tablet and mobile |
| Media | Figma autoplay configuration | Optimised delivery, controls and handling when autoplay is blocked |
| Motion | Prototype transitions and visual states | Respect reduced-motion preferences and avoid forced animated scrolling |
| Hosting | Interactive Figma link | Planned Amazon S3 and CloudFront deployment with HTTPS |
| Guestbook | Not implemented | Later gallery-style guestbook in the work plan |

### Scroll snapping and title positioning

On the website, scrolling down from the opening screen should settle on **LIGHT**, then **SHADOW**, then **BLOOD**. Entering a chapter should present its title, including when a horizontal track was previously scrolled to an artwork.

Within a chapter, horizontal scrolling should allow a painting or detail to settle near the centre instead of stopping at an arbitrary position.

These are coordinated behaviours:

1. **Vertical snapping** aligns the chapter viewport.
2. **Chapter-entry positioning** aligns the chapter’s horizontal track with its title.
3. **Horizontal snapping** centres items during exploration.

Vertical snapping alone does not reset a horizontal track. The website will need an explicit chapter-entry rule, tested when arriving from above and below.

The planned implementation uses CSS scroll snapping for alignment and JavaScript where necessary to coordinate chapter entry and title positioning. Mouse wheels, trackpads, touch and keyboard input will need testing, alongside long helper content and motion preferences.

**This coordinated behaviour is not implemented in the current Figma prototype.** It is a development requirement. This describes this prototype’s limitation, rather than claiming that every form of snapping is universally impossible in Figma.

## 10. Later infrastructure and guestbook

The work plan proposes S3 and CloudFront hosting, followed by a guestbook using API Gateway, Lambda and DynamoDB. Amazon Nova through Amazon Bedrock is planned to assess submissions against a content policy before publication.

Input validation, submission limits, safe plain-text display and keeping unreviewed messages unpublished when moderation is unavailable belong to that later implementation.

These are planned project choices, not working Figma features or technologies mandated by the syllabus.

## 11. Verification and assessment handoff

The scrolling configurations and track dimensions were read from Figma for these notes. The latest live-button audit found 20 controls, each with one overlay-opening action and separate mouse-enter and mouse-leave events.

Recent browser checks verified the Basket of Fruit helper opening and closing with one × click. Earlier checks verified its first-click background dismissal. The archive was checked for 160 anecdote entries and 160 helper entries; the frozen Italian master was compared against the approved source.

These are specific observations, not exhaustive tests of every browser, device and language combination. Responsive behaviour, browser compatibility, accessibility, media delivery and performance remain website-phase validation work.

Assessment 1 concerns the prototype. The planned submission includes the interactive URL and a PDF with selected images and brief technical notes. Repository publication does not mean the university submission or PDF package has been completed.

