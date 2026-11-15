// Select the introductory video, sound button and feedback area.
const introVideo = document.getElementById("intro-video");
const audioButton = document.getElementById("video-audio-button");
const audioStatus = document.getElementById("video-audio-status");

// Keep the icon and accessibility state aligned with the video's sound state.
function updateAudioControl() {
    const soundOn = !introVideo.muted;

    audioButton.setAttribute("aria-pressed", String(soundOn));
    audioButton.title = soundOn ? "Turn sound off" : "Turn sound on";
}

// Restore the muted state and report a playback failure.
function reportPlaybackFailure() {
    introVideo.muted = true;
    updateAudioControl();

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
        // Treat playback errors separately from autoplay restrictions.
        if (error.name !== "NotAllowedError") {
            reportPlaybackFailure();
            return;
        }

        // Retry playback with sound enabled.
        introVideo.muted = false;

        try {
            await introVideo.play();
        } catch (error) {
            // Explain an autoplay restriction without reporting a media failure.
            if (error.name === "NotAllowedError") {
                introVideo.muted = true;
                updateAudioControl();
                audioStatus.textContent =
                    "To hear the video, click the sound icon.";
                return;
            }

            reportPlaybackFailure();
        }
    }
}

// Toggle sound in response to a mouse click or native keyboard activation.
audioButton.addEventListener("click", async function () {
    audioStatus.textContent = "";

    // Stop if the browser has already reported an unavailable source.
    if (
        introVideo.error ||
        introVideo.networkState === introVideo.NETWORK_NO_SOURCE
    ) {
        reportPlaybackFailure();
        return;
    }

    if (!introVideo.muted) {
        introVideo.muted = true;
        return;
    }

    introVideo.muted = false;

    try {
        // Resume playback during the user action if autoplay was interrupted.
        await introVideo.play();
    } catch (error) {
        reportPlaybackFailure();
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

// Show the control after its initial state and event handlers are ready.
updateAudioControl();
audioButton.hidden = false;

// Request playback after the sound controls are ready.
startIntroVideo();
