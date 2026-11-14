# Development Log

**9 November 2026 — AWS setup and initial deployment**

- Created a private Amazon S3 bucket in Frankfurt, with encryption and versioning enabled.
- Configured CloudFront to serve the website over HTTPS, with caching and security headers.
- Configured access logs in CloudWatch with seven-day retention.
- Set a total budget of $100, with email alerts at $50, $80 and $100.
- Uploaded `index.html` and `styles.css` to Amazon S3 and verified their delivery through CloudFront.

**12 November 2026 — Opening header**

- Added the Caravaggio title, painter’s name and chapter navigation.
- Applied Cormorant Garamond Medium and adjusted the header layout for desktop and smaller screens.

**12 November 2026 — Introductory video**

- Added the introductory video with muted autoplay, looping playback and responsive sizing.
- Set English as the default page language and updated the navigation labels and video fallback text.

**12 November 2026 — Light chapter structure**

- Added the Light chapter background, title and horizontal gallery container.

**13 November 2026 — Artwork galleries**

- Added artworks, detail crops, anecdotes and artwork captions to Light, Shadow and Blood.
- Shared the gallery styles and navigation logic across all three sections.
- Checked horizontal scrolling, image loading and caption visibility on desktop and smaller screens.

**13 November 2026 — Medusa helper**

- Added the Medusa eyes helper with a centred crop and explanation panel.
- Added closing through the X button, an outside click or Escape, with keyboard focus restored afterwards.
- Separated its anecdote and helper text into an eight-language JSON archive.
- Checked content loading and layout on desktop and smaller screens.

**13 November 2026 — Footer and release v2.51**

- Updated the footer with the full university name, degree and course information, linking to the OPIT degree programme page.
- Deployed and verified the Medusa helper on AWS.
- Published release v2.51 — First crop explanation.

**14 November 2026 — Light section helpers**

- Completed the helpers for all six Light detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.
- Kept the crop and close button visible while longer explanations scroll on small screens.
- Deployed the update to AWS and checked mouse and keyboard interactions.

**14 November 2026 — Shadow section helpers**

- Completed the helpers for all eight Shadow detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.

**14 November 2026 — Blood section helpers**

- Completed the helpers for all six Blood detail crops.
- Added their anecdotes and explanations in eight languages to the JSON archive.
