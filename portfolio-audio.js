(function () {
  "use strict";

  var audio = document.getElementById("portfolio-guide-audio");
  var speedButton = document.getElementById("portfolio-guide-speed");
  var status = document.getElementById("portfolio-guide-status");
  var progressTrack = document.getElementById("portfolio-guide-progress-track");
  var progressFill = document.querySelector("[data-guide-progress]");

  if (!audio || !speedButton || !status || !progressTrack || !progressFill) return;

  // The recording itself uses a clear, natural male Indian-English voice.
  // Default playback is 1.5x to avoid the slow, separated pacing of the old TTS.
  var rates = [1.5, 1.25, 1.0];
  var rateIndex = 0;
  audio.playbackRate = rates[rateIndex];

  function setSpeedLabel() {
    speedButton.textContent = "Speed " + rates[rateIndex].toFixed(2).replace(/0$/, "").replace(/\.0$/, "") + "×";
    speedButton.setAttribute("aria-label", "Playback speed " + rates[rateIndex] + " times. Select to change speed.");
  }

  function setProgress() {
    var duration = audio.duration;
    var percent = Number.isFinite(duration) && duration > 0 ? (audio.currentTime / duration) * 100 : 0;
    progressFill.style.width = Math.max(0, Math.min(100, percent)) + "%";
    progressTrack.setAttribute("aria-valuenow", String(Math.round(percent)));
  }

  speedButton.addEventListener("click", function () {
    rateIndex = (rateIndex + 1) % rates.length;
    audio.playbackRate = rates[rateIndex];
    setSpeedLabel();
    status.textContent = "Playback speed set to " + rates[rateIndex] + " times.";
  });

  audio.addEventListener("timeupdate", setProgress);
  audio.addEventListener("durationchange", setProgress);
  audio.addEventListener("ended", function () {
    setProgress();
    status.textContent = "Introduction complete. Explore the portfolio at your own pace.";
  });
  audio.addEventListener("play", function () {
    status.textContent = "Now playing the portfolio introduction at " + rates[rateIndex] + " times speed.";
  });
  audio.addEventListener("pause", function () {
    if (!audio.ended && audio.currentTime > 0) status.textContent = "Introduction paused. Press play to continue.";
  });
  audio.addEventListener("error", function () {
    status.textContent = "The recorded introduction could not be loaded. Refresh the page and try again.";
  });

  setSpeedLabel();
  setProgress();

  // Try to honour the requested welcome-on-entry behavior. Browsers may block
  // audio autoplay; the visible native player remains available in that case.
  window.setTimeout(function () {
    var attempt = audio.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        status.textContent = "Welcome audio is ready. Press play to listen; this browser requires a tap before sound can start.";
      });
    }
  }, 900);
})();