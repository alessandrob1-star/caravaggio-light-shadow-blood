# WHATWG HTML Living Standard

**Caravaggio — Light, Shadow, Blood · COMP-2002 · Assessment 2**  
**Review date · 28 November 2026**

## Implementation and checks

- **Artwork descriptions.** Each of the 33 artwork and detail images has descriptive alternative text in all eight languages. The page loads with the English `alt` from `index.html` and updates it when a visitor selects a language. Each `figure` has a `figcaption` with artwork information or an anecdote. [WHATWG · Images that are key content](https://html.spec.whatwg.org/multipage/images.html#a-key-part-of-the-content) · [WHATWG · Figure and caption](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element)
- **Language changes and gallery controls.** `data/whatwg-screen-reader-artwork-descriptions.json` stores descriptions and short gallery labels in eight languages. `scripts/languages.js` updates the text and `lang` of the images and native gallery buttons when a visitor selects a language. `scripts/gallery-controls.js` also copies the language of each translated chapter heading to its corresponding gallery button. [WHATWG · The lang attribute](https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes) · [WHATWG · The button element](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
- **Chapter navigation.** In `scripts/galleries.js`, activating a main menu link centres the chapter and moves focus to its heading. In a separate preview, manual checks confirmed that NVDA announced each chapter heading and that Tab and Shift+Tab reached the adjacent controls. [WHATWG · Focus](https://html.spec.whatwg.org/multipage/interaction.html#focus)
- **Artwork explanations.** The detail buttons open a native `dialog` through `scripts/helpers.js`. Escape closes the dialog and returns focus to the button that opened it. [WHATWG · The dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)

- **Multiline anecdotes.** `index.html` and `scripts/languages.js` use `br` to preserve sentence breaks in captions, including after a language change. The sentence separation was checked with NVDA in a local preview. [WHATWG · The br element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-br-element)

## Screen-reader verification

On the live AWS site, each image description, gallery button label, anecdote and explanation in Light, Shadow and Blood was verified individually through manual keyboard and screen-reader checks with NVDA 2026.3.1 and Chrome on Windows. The eight languages accounted for 264 image description checks, 264 gallery label checks, 160 anecdote checks and 160 explanation checks. In each of the 160 dialog checks, Escape returned focus to the button that opened it. Image and gallery button language tags were also checked in Chrome.

The deployed HTML and JavaScript were also checked in Chrome. Enter moved focus to each of the three chapter headings. In all eight languages, the gallery title buttons matched their headings in text and language, and each anecdote retained its line structure.

**WCAG 2.2 checks on AWS.** Verified in Chrome. The OPIT footer link reached 16.27:1 contrast, and the Blood explanation and close icons reached 3.09:1. At a 320 × 256 CSS-pixel viewport, all 36 gallery buttons became fully visible when focused with Tab. Moving between buttons did not change the selected artwork. With reduced motion enabled, section and gallery navigation moved without animation.

## Additional verified checks — 28 November 2026

| WCAG 2.2 criterion | Verified implementation and result |
| --- | --- |
| [1.4.6 Contrast (Enhanced), AAA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) | Blood text and explanations use `#781012` on `#d8cdbb`, giving 7.106:1 contrast. The selected language uses `#e8c787` on its dark background, giving approximately 7.46:1 in all eight languages. Both exceed 7:1 for normal text. |
| [2.5.5 Target Size (Enhanced), AAA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | Gallery dot buttons have targets of at least 44 × 44 CSS pixels at the tested widths of 320, 800, 900, 1024, 1280 and 1920 CSS pixels. The compact language selector has a 60 × 44 target and the larger selector an 88 × 48 target. The visible flag remains compact. Main chapter links have targets of at least 44 × 44 CSS pixels, checked in all eight languages at widths of 320, 390, 900 and 1280 CSS pixels. Section arrows have targets of at least 44 × 44 CSS pixels, checked at widths of 320, 390, 800 and 1280 CSS pixels. |

**Explanation text.** The text column is centred with a maximum width of 60ch, or 32em for Chinese and Japanese, and line height 1.5. All 160 explanations were checked on AWS at 1920 × 1080 CSS pixels. The maximum measured line length was 72 characters for the European languages and 39 for Chinese and Japanese.

**Further browser checks on AWS.** Automated Chrome checks covered all 160 explanation dialogs in eight languages: opening with Enter, moving between the close button and text with Tab and Shift+Tab, closing with Escape and restoring focus. All 36 gallery buttons were activated with Enter or Space; focus alone did not change the selected artwork. Video playback with sound, muting and pausing were verified from the keyboard. At 320 × 256 CSS pixels, all 160 dialogs retained horizontally contained, scrollable text and a reachable close button with custom text spacing. With caption and explanation font sizes doubled through CSS at 640 × 450 CSS pixels, no caption clipping or horizontal text overflow was detected in the tested content. These font-size checks were performed through CSS rather than manual browser zoom. Line height 1.5 was tested across all 160 explanations at five viewport sizes. In simulated light and dark system contrast themes, the gallery bar, dots and selected item remained distinguishable using system colours. These automated browser checks complement the manual NVDA checks described above.
