import { getControlLabels } from "./whatwg-screen-reader-controls.js?v=20261127-1";

// Select the introductory video, its controls and the feedback areas.
const introVideo = document.getElementById("intro-video");
const audioButton = document.getElementById("video-audio-button");
const playbackButton = document.getElementById("video-playback-button");
const audioStatus = document.getElementById("video-audio-status");
const musicStatus = document.getElementById("video-music-status");
const videoDescription = document.getElementById("intro-video-description");

// Expose the next playback action and show the matching icon.
function updatePlaybackControl() {
    const playing = !introVideo.paused && !introVideo.ended && !introVideo.error;
    const labels = getControlLabels();
    const label = playing ? labels.pause : labels.play;

    playbackButton.toggleAttribute("data-playing", playing);
    playbackButton.setAttribute("aria-label", label);
    playbackButton.title = label;
}

// Describe the video before announcing the music credit.
function announceMusicCredit() {
    if (!introVideo.muted && !introVideo.paused) {
        const labels = getControlLabels();
        musicStatus.textContent = labels.videoDescription + " " + labels.music;
    }
}

// Keep the icon and accessibility state aligned with the video's sound state.
function updateAudioControl() {
    const soundOn = !introVideo.muted;

    audioButton.setAttribute("aria-pressed", String(soundOn));
    const labels = getControlLabels();
    audioButton.setAttribute("aria-label", labels.sound);
    audioButton.title = soundOn ? labels.soundOff : labels.soundOn;
    if (!soundOn) {
        musicStatus.textContent = "";
    }
}

// Restore the muted state and report a playback failure.
function reportPlaybackFailure() {
    introVideo.muted = true;
    updateAudioControl();
    updatePlaybackControl();

    audioStatus.textContent =
        getControlLabels().videoError;
}

// Request autoplay with sound enabled.
async function startIntroVideo() {
    // Report a source failure that occurred before initialization.
    if (
        introVideo.error ||
        introVideo.networkState === introVideo.NETWORK_NO_SOURCE
    ) {
        reportPlaybackFailure();
        return;
    }

    try {
        await introVideo.play();
    } catch (error) {
        // A manual pause can interrupt a pending autoplay request.
        if (error.name === "AbortError") {
            return;
        }

        // Wait for the Play button when automatic playback with sound is blocked.
        if (error.name === "NotAllowedError") {
            introVideo.muted = true;
            updateAudioControl();
            return;
        }

        reportPlaybackFailure();
    }
}

// Toggle sound independently of playback.
audioButton.addEventListener("click", function () {
    // Stop if the browser has already reported an unavailable source.
    if (
        introVideo.error ||
        introVideo.networkState === introVideo.NETWORK_NO_SOURCE
    ) {
        reportPlaybackFailure();
        return;
    }

    introVideo.muted = !introVideo.muted;
    announceMusicCredit();
});

// Pause or resume playback through the native button's click event.
playbackButton.addEventListener("click", async function () {
    if (!introVideo.paused && !introVideo.ended) {
        introVideo.pause();
        return;
    }

    audioStatus.textContent = "";

    // Enable sound as part of the visitor's Play action.
    introVideo.muted = false;

    try {
        await introVideo.play();
        announceMusicCredit();
    } catch (error) {
        if (error.name !== "AbortError") {
            reportPlaybackFailure();
        }
    }
});

// Handle failures reported directly by the video or its source.
introVideo.addEventListener("error", reportPlaybackFailure);
introVideo.querySelector("source").addEventListener(
    "error",
    reportPlaybackFailure
);

// Update the control whenever the video's sound state changes.
introVideo.addEventListener("volumechange", updateAudioControl);
introVideo.addEventListener("play", updatePlaybackControl);
introVideo.addEventListener("pause", updatePlaybackControl);
introVideo.addEventListener("ended", updatePlaybackControl);

// Refresh accessible labels without changing playback or sound settings.
document.addEventListener("sitecontrolslanguagechange", function () {
    const labels = getControlLabels();
    const languageTag = document.getElementById("language-toggle").lang;
    document.querySelector(".video-toolbar").lang = languageTag;
    introVideo.lang = languageTag;
    introVideo.setAttribute("aria-label", labels.video);
    videoDescription.lang = languageTag;
    videoDescription.textContent = labels.videoDescription;
    musicStatus.lang = languageTag;
    updateAudioControl();
    updatePlaybackControl();
    if (audioStatus.textContent) audioStatus.textContent = labels.videoError;
    if (musicStatus.textContent) {
        musicStatus.textContent = labels.videoDescription + " " + labels.music;
    }
});

// Show the controls after their initial state and event handlers are ready.
updateAudioControl();
updatePlaybackControl();
audioButton.hidden = false;
playbackButton.hidden = false;

// Request playback after the sound controls are ready.
startIntroVideo();

