# WHATWG HTML Living Standard

**Caravaggio — Light, Shadow, Blood · COMP-2002 · Assessment 2**  
**Review date · 27 November 2026**

## Implementation and checks

- **Artwork descriptions.** Each of the 33 artwork and detail images has descriptive alternative text in all eight languages. The page loads with the English `alt` from `index.html` and updates it when a visitor selects a language. Each `figure` has a `figcaption` with artwork information or an anecdote. [WHATWG · Images that are key content](https://html.spec.whatwg.org/multipage/images.html#a-key-part-of-the-content) · [WHATWG · Figure and caption](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element)
- **Language changes and gallery controls.** `data/whatwg-screen-reader-artwork-descriptions.json` stores descriptions and short gallery labels in eight languages. `scripts/languages.js` updates the text and `lang` of the images and native gallery buttons when a visitor selects a language. `scripts/gallery-controls.js` also copies the language of each translated chapter heading to its corresponding gallery button. [WHATWG · The lang attribute](https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes) · [WHATWG · The button element](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
- **Chapter navigation.** In `scripts/galleries.js`, activating a main menu link centres the chapter and moves focus to its heading. In a separate preview, manual checks confirmed that NVDA announced each chapter heading and that Tab and Shift+Tab reached the adjacent controls. [WHATWG · Focus](https://html.spec.whatwg.org/multipage/interaction.html#focus)
- **Artwork explanations.** The detail buttons open a native `dialog` through `scripts/helpers.js`. Escape closes the dialog and returns focus to the button that opened it. [WHATWG · The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)

- **Multiline anecdotes.** `index.html` and `scripts/languages.js` use `br` to preserve sentence breaks in captions, including after a language change. The sentence separation was checked with NVDA in a local preview. [WHATWG · The br element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-br-element)

## Screen-reader verification

On the live AWS site, each image description, gallery button label, anecdote and explanation in Light, Shadow and Blood was verified individually through manual keyboard and screen-reader checks with NVDA 2026.3.1 and Chrome on Windows. The eight languages accounted for 264 image description checks, 264 gallery label checks, 160 anecdote checks and 160 explanation checks. In each of the 160 dialog checks, Escape returned focus to the button that opened it. Image and gallery button language tags were also checked in Chrome.

The deployed HTML and JavaScript were also checked in Chrome. Enter moved focus to each of the three chapter headings. In all eight languages, the gallery title buttons matched their headings in text and language, and each anecdote retained its line structure. The 50 site files on AWS matched the files in the GitHub main branch at the time of this review.

**WCAG 2.2 checks on AWS.** Verified in Chrome. The OPIT footer link reached 16.27:1 contrast, and the Blood explanation and close icons reached 3.09:1. At a 320 × 256 CSS-pixel viewport, all 36 gallery buttons became fully visible when focused with Tab. Moving between buttons did not change the selected artwork. With reduced motion enabled, section and gallery navigation moved without animation.
