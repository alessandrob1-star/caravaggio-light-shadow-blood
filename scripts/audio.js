// Select the introductory video, its controls and the feedback areas.
const introVideo = document.getElementById("intro-video");
const audioButton = document.getElementById("video-audio-button");
const playbackButton = document.getElementById("video-playback-button");
const audioStatus = document.getElementById("video-audio-status");
const musicStatus = document.getElementById("video-music-status");

// Expose the next playback action and show the matching icon.
function updatePlaybackControl() {
    const playing = !introVideo.paused && !introVideo.ended && !introVideo.error;
    const label = playing ? "Pause video" : "Play video";

    playbackButton.toggleAttribute("data-playing", playing);
    playbackButton.setAttribute("aria-label", label);
    playbackButton.title = label;
}

// Announce the credit when sound is enabled and playback is active.
function announceMusicCredit() {
    if (!introVideo.muted && !introVideo.paused) {
        musicStatus.textContent = "Music: Experience by Ludovico Einaudi.";
    }
}

// Keep the icon and accessibility state aligned with the video's sound state.
function updateAudioControl() {
    const soundOn = !introVideo.muted;

    audioButton.setAttribute("aria-pressed", String(soundOn));
    audioButton.title = soundOn ? "Turn sound off" : "Turn sound on";
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
        "The video could not be played. Please reload the page and try again.";
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

// Show the controls after their initial state and event handlers are ready.
updateAudioControl();
updatePlaybackControl();
audioButton.hidden = false;
playbackButton.hidden = false;

// Request playback after the sound controls are ready.
startIntroVideo();
