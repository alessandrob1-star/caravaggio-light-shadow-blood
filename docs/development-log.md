# Development Log

**9 November 2026**

- Created a private Amazon S3 bucket in Frankfurt, with encryption and versioning enabled.
- Configured CloudFront to serve the website over HTTPS, with caching and security headers.
- Configured access logs in CloudWatch with seven-day retention.
- Set a total budget of $100, with email alerts at $50, $80 and $100.
- Uploaded `index.html` and `styles.css` to Amazon S3 and verified their delivery through CloudFront.

**12 November 2026**

- Added the Caravaggio title, painter’s name and chapter navigation.
- Applied Cormorant Garamond Medium and adjusted the header layout for desktop and smaller screens.
- Added the introductory video with muted autoplay, looping playback and responsive sizing.
- Set English as the default page language and updated the navigation labels and video fallback text.
- Added the Light chapter background, title and horizontal gallery container.

**13 November 2026**

- Added artworks, detail crops, anecdotes and artwork captions to Light, Shadow and Blood.
- Shared the gallery styles and navigation logic across all three sections.
- Checked horizontal scrolling, image loading and caption visibility on desktop and smaller screens.
- Added the Medusa eyes helper with a centred crop and explanation panel.
- Added closing through the X button, an outside click or Escape, with keyboard focus restored afterwards.
- Separated its anecdote and helper text into an eight-language JSON archive.
- Checked content loading and layout on desktop and smaller screens.
- Updated the footer with the full university name, degree and course information, linking to the OPIT degree programme page.
- Deployed and verified the Medusa helper on AWS.
- Published release v2.51 — First crop explanation.

**14 November 2026**

- Completed the helpers for all six Light detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.
- Kept the crop and close button visible while longer explanations scroll on small screens.
- Deployed the update to AWS and checked mouse and keyboard interactions.
- Completed the helpers for all eight Shadow detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.
- Completed the helpers for all six Blood detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.
- Added the eight-language selector for anecdotes and helper explanations.
- Connected the selector to the stored translations.
- Connected navigation labels and section titles to the eight-language selector.
- Adjusted section title sizing for narrow screens.

**15 November 2026**

- Added introductory video sound controls and playback guidance.
- Refined video spacing, keyboard access and cache handling.
- Added centred gallery snapping, dot navigation and mouse dragging.
- Refined section heights, opening video spacing and individual artwork positions in Light.

**16 November 2026**

- Refined individual artwork and crop spacing in Shadow.
- Refined individual artwork and crop spacing in Blood.

**18 November 2026**

- Added automatic return to chapter titles when changing sections vertically.
- Added bidirectional arrows for navigation between Home and the three chapters.
- Added automatic vertical section snapping and centred chapter alignment.

**23 November 2026 — v2.79**

- Merged centred vertical section snapping into the main branch.
- Hid previous gallery bars while keeping the upward arrows visible and adjusted the position of Shadow’s navigation controls.

**24 November 2026 — WHATWG HTML Living Standard**

- Matched the language of gallery title buttons to their translated headings (v2.80).
- Moved keyboard focus to the selected chapter heading and manually checked all three chapters with NVDA and Chrome.

**26 November 2026 — WHATWG HTML Living Standard**

- Published alternative text and short gallery labels in eight languages for all nine images in Light.
- Verified all 72 image descriptions and 72 gallery labels with NVDA and Chrome on the live site. In all eight languages, checked the six anecdotes and explanations and confirmed that Escape closes each dialog and returns focus to its opening button.
- Published Shadow’s alternative text and gallery labels in eight languages. Verified 112 descriptions and 112 labels on the live site with NVDA and Chrome, and checked all eight anecdotes and explanations in each language, including focus restoration after Escape.

**27–28 November 2026 — WHATWG HTML Living Standard**

- Published alternative text and gallery labels for all ten images in Blood in eight languages. Verified the descriptions, gallery labels, anecdotes, explanations and focus restoration with NVDA and Chrome.
- Aligned the live AWS site with GitHub and documented the HTML implementation and accessibility checks.
- Published v2.86 and merged the responsive, tablet and multilingual accessibility updates in PRs #41–#43.
- Updated the README for Assessment 2 and revised the project descriptions into impersonal wording.
- Extended the 44 × 44 gallery button targets to intermediate window sizes, enlarged the compact language selector target to 60 × 44 CSS pixels, and set the main chapter links and section arrows to a minimum target size of 44 × 44 CSS pixels.
- Increased the selected-language text contrast to approximately 7.46:1 and retained Blood text contrast at 7.106:1.
- Narrowed explanation text columns and set line height to 1.5. Verified all 160 explanations in eight languages and tested the line-height change at five viewport sizes.
- Adapted gallery navigation to system contrast themes and recorded the verified results in the technical document.
