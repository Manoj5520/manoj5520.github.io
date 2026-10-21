/* V. Sai Manoj portfolio welcome — isolated asset to prevent stale bundle reuse. */
(function () {
  "use strict";

  var playButton = document.getElementById("portfolio-guide-toggle");
  var stopButton = document.getElementById("portfolio-guide-stop");
  var label = document.getElementById("portfolio-guide-toggle-label");
  var buttonIcon = playButton ? playButton.querySelector(".portfolio-guide-play-icon") : null;
  var status = document.getElementById("portfolio-guide-status");
  var progressTrack = document.getElementById("portfolio-guide-progress-track");
  var progressFill = document.querySelector("[data-guide-progress]");
  if (!playButton || !stopButton || !label || !status || !progressTrack || !progressFill) return;

  var synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
    playButton.disabled = true;
    stopButton.disabled = true;
    status.textContent = "Spoken guidance is not supported by this browser. Please explore the portfolio normally.";
    return;
  }

  /*
   * Fifteen connected speech turns keep natural phrasing within each thought.
   * Gaps are deliberately brief: short transitions between sentences and slightly
   * longer rests only at section changes and before the final invitation.
   */
  var beats = [
    { stage: "Welcome", text: "Hello, and welcome. This is the portfolio of V. Sai Manoj. In the next two minutes, here is what to look for.", pitch: 0.92, rate: 0.95, gap: 420 },
    { stage: "Capability Snapshot", text: "Start with Capability Snapshot. My focus is competitive intelligence, market-gap analysis, commercial judgement, service-line strategy, and business operations.", pitch: 0.99, rate: 0.96, gap: 320 },
    { stage: "Capability Snapshot", text: "I connect customer needs, competitor positioning, and delivery constraints to identify opportunities a business can credibly deliver.", pitch: 0.96, rate: 0.95, gap: 360 },
    { stage: "My Decision Logic", text: "Then open My Decision Logic. You will see how I frame a decision, test evidence, compare options, and identify practical next steps.", pitch: 0.94, rate: 0.95, gap: 320 },
    { stage: "My Decision Logic", text: "The aim is simple: connect market signals to commercial priorities and operational reality.", pitch: 0.93, rate: 0.94, gap: 480 },
    { stage: "Experience and Projects", text: "In Experience and Projects, start with my Mercedes-Benz Retail of the Future review.", pitch: 0.95, rate: 0.94, gap: 260 },
    { stage: "Experience and Projects", text: "I examined inventory access, price transparency, dealer flexibility, and customer experience—looking at the model’s implications for retail operations.", pitch: 0.91, rate: 0.93, gap: 360 },
    { stage: "Experience and Projects", text: "At NexaHomes, I benchmarked competitors and assessed differentiated service-line opportunities aligned with the business positioning.", pitch: 0.94, rate: 0.94, gap: 320 },
    { stage: "Experience and Projects", text: "My independent venture research and MBA research reflect the same method: question assumptions, compare choices, and connect evidence to action.", pitch: 0.93, rate: 0.94, gap: 480 },
    { stage: "The difference I aim to make", text: "So, what difference can I make?", pitch: 0.89, rate: 0.92, gap: 420 },
    { stage: "The difference I aim to make", text: "I can help teams see underserved customer needs, identify where competitors leave room, test commercial fit, and turn findings into clear priorities.", pitch: 0.91, rate: 0.94, gap: 320 },
    { stage: "The difference I aim to make", text: "Not analysis for its own sake. Clearer decisions, grounded recommendations, and practical next steps.", pitch: 0.90, rate: 0.92, gap: 520 },
    { stage: "An invitation", text: "Here is my invitation. Give me a real business challenge, the constraints, and the outcome that matters.", pitch: 0.95, rate: 0.94, gap: 340 },
    { stage: "An invitation", text: "Let me investigate, map the options, and show where progress can begin. Judge the work by the questions, the evidence, and the value—not promises.", pitch: 0.96, rate: 0.94, gap: 480 },
    { stage: "An invitation", text: "Let’s turn an overlooked gap into your next advantage.", pitch: 0.99, rate: 0.95, gap: 0 }
  ];

  var state = "idle";
  var currentIndex = 0;
  var totalWords = 0;
  var firstBeatStarted = false;
  var autoStartTimer = null;
  var nextBeatTimer = null;
  var activeUtterance = false;
  var pendingIndex = null;
  var chosenVoice = null;
  var chosenVoiceIsRecognisablyMale = false;
  var voiceReadyTimer = null;

  beats.forEach(function (beat) {
    beat.words = beat.text.trim().split(/\s+/).length;
    beat.startWords = totalWords;
    totalWords += beat.words;
    beat.endWords = totalWords;
  });

  function clearTimers() {
    if (autoStartTimer) window.clearTimeout(autoStartTimer);
    if (nextBeatTimer) window.clearTimeout(nextBeatTimer);
    if (voiceReadyTimer) window.clearTimeout(voiceReadyTimer);
    autoStartTimer = nextBeatTimer = voiceReadyTimer = null;
  }

  function setProgress(percent, duration) {
    var value = Math.max(0, Math.min(100, percent));
    progressFill.style.transitionDuration = (duration || 350) + "ms";
    progressFill.style.width = value + "%";
    progressTrack.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  function getEnglishVoices() {
    return (synth.getVoices ? synth.getVoices() : []).filter(function (voice) {
      return /^en(?:[-_]|$)/i.test(voice.lang || "");
    });
  }

  function findMaleVoice(voices) {
    var malePatterns = [
      /microsoft.*(?:guy|ryan|david|mark|christopher|jason|tony|andrew|brian|eric|roger|thomas|george|daniel|james|oliver|arthur|aaron).*natural/i,
      /microsoft.*(?:guy|ryan|david|mark|christopher|jason|tony|andrew|brian|eric|roger|thomas|george|daniel|james|oliver|arthur|aaron)/i,
      /google.*(?:uk|us|english).*male/i,
      /english.*male/i,
      /\b(?:daniel|alex|fred|ralph|david|george|james|oliver|aaron|guy|ryan|mark|brian|thomas|christopher|jason|andrew|matthew|henry|stephen|paul|richard|john|robert|michael)\b/i
    ];
    for (var p = 0; p < malePatterns.length; p++) {
      for (var i = 0; i < voices.length; i++) {
        if (malePatterns[p].test(voices[i].name)) return voices[i];
      }
    }
    return null;
  }

  function chooseVoice(callback) {
    var finished = false;
    var forceFallback = false;
    var handler = null;
    function finish() {
      if (finished) return;
      var voices = getEnglishVoices();
      var maleVoice = findMaleVoice(voices);
      if (!maleVoice && !forceFallback) return;
      finished = true;
      if (handler && synth.removeEventListener) synth.removeEventListener("voiceschanged", handler);
      if (voiceReadyTimer) window.clearTimeout(voiceReadyTimer);
      voiceReadyTimer = null;
      chosenVoice = maleVoice || voices.find(function (v) {
        return !/zira|aria|jenny|samantha|susan|hazel|eva|heera|female|sonia|natasha|michelle|amy|emma|libby/i.test(v.name);
      }) || voices[0] || null;
      chosenVoiceIsRecognisablyMale = Boolean(maleVoice);
      callback();
    }
    handler = function () {
      var voices = getEnglishVoices();
      if (findMaleVoice(voices)) finish();
    };
    if (synth.addEventListener) synth.addEventListener("voiceschanged", handler);
    voiceReadyTimer = window.setTimeout(function () { forceFallback = true; finish(); }, 1300);
    finish();
  }

  function finishGuide() {
    state = "finished";
    activeUtterance = false;
    pendingIndex = null;
    clearTimers();
    setProgress(100, 250);
    label.textContent = "Listen again";
    if (buttonIcon) buttonIcon.textContent = "▶";
    stopButton.disabled = true;
    status.textContent = "Introduction complete. Explore the portfolio at your own pace.";
  }

  function scheduleBeat(index, delay) {
    pendingIndex = index;
    if (nextBeatTimer) window.clearTimeout(nextBeatTimer);
    nextBeatTimer = window.setTimeout(function () {
      nextBeatTimer = null;
      if (state === "paused" || state !== "speaking") return;
      pendingIndex = null;
      speakBeat(index);
    }, delay);
  }

  function speakBeat(index) {
    if (state !== "speaking") return;
    if (index >= beats.length) { finishGuide(); return; }

    currentIndex = index;
    var beat = beats[index];
    var utterance = new window.SpeechSynthesisUtterance(beat.text);
    activeUtterance = true;
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }
    utterance.pitch = beat.pitch;
    utterance.rate = beat.rate;
    utterance.volume = 1;

    utterance.onstart = function () {
      if (state === "stopped" || state === "failed") return;
      firstBeatStarted = true;
      if (autoStartTimer) window.clearTimeout(autoStartTimer);
      var expectedMs = Math.max(1200, beat.words / (145 * beat.rate) * 60000);
      var voiceNote = chosenVoiceIsRecognisablyMale
        ? " · male English voice selected"
        : " · your browser does not expose a clearly labelled male English voice, so its closest available voice is being used";
      status.textContent = "Now guiding you through " + beat.stage + voiceNote + ".";
      setProgress(beat.endWords / totalWords * 100, expectedMs + beat.gap);
    };

    utterance.onend = function () {
      if (state === "stopped" || state === "failed") return;
      activeUtterance = false;
      if (index === beats.length - 1) finishGuide();
      else scheduleBeat(index + 1, beat.gap);
    };

    utterance.onerror = function (event) {
      activeUtterance = false;
      if (state === "stopped" || state === "failed" || (event && event.error === "canceled")) return;
      state = "failed";
      clearTimers();
      synth.cancel();
      label.textContent = "Start the guided introduction";
      if (buttonIcon) buttonIcon.textContent = "▶";
      stopButton.disabled = true;
      status.textContent = "Your browser may block automatic audio. Press Start to hear the guided introduction.";
    };

    synth.speak(utterance);
  }

  function startGuide(isAutoStart) {
    clearTimers();
    synth.cancel();
    firstBeatStarted = false;
    currentIndex = 0;
    pendingIndex = null;
    activeUtterance = false;
    state = "speaking";
    setProgress(0, 0);
    stopButton.disabled = false;
    label.textContent = "Pause introduction";
    if (buttonIcon) buttonIcon.textContent = "Ⅱ";
    status.textContent = isAutoStart ? "Starting the guided introduction…" : "Preparing the guided introduction…";

    autoStartTimer = isAutoStart ? window.setTimeout(function () {
      if (state === "speaking" && !firstBeatStarted) {
        state = "idle";
        clearTimers();
        synth.cancel();
        label.textContent = "Start the guided introduction";
        if (buttonIcon) buttonIcon.textContent = "▶";
        stopButton.disabled = true;
        status.textContent = "Your browser may block automatic audio. Press Start to hear the guided introduction.";
        setProgress(0, 0);
      }
    }, 3800) : null;

    chooseVoice(function () {
      if (state !== "speaking") return;
      speakBeat(0);
    });
  }

  playButton.addEventListener("click", function () {
    if (state === "speaking" && !firstBeatStarted) {
      startGuide(false);
      return;
    }
    if (state === "speaking") {
      if (nextBeatTimer) { window.clearTimeout(nextBeatTimer); nextBeatTimer = null; }
      state = "paused";
      if (activeUtterance) synth.pause();
      label.textContent = "Resume introduction";
      if (buttonIcon) buttonIcon.textContent = "▶";
      status.textContent = "Introduction paused. Select Resume to continue.";
      return;
    }
    if (state === "paused") {
      state = "speaking";
      label.textContent = "Pause introduction";
      if (buttonIcon) buttonIcon.textContent = "Ⅱ";
      status.textContent = "Resuming the guided introduction…";
      if (activeUtterance) synth.resume();
      else scheduleBeat(pendingIndex === null ? currentIndex + 1 : pendingIndex, 220);
      return;
    }
    startGuide(false);
  });

  stopButton.addEventListener("click", function () {
    state = "stopped";
    clearTimers();
    synth.cancel();
    activeUtterance = false;
    pendingIndex = null;
    setProgress(0, 180);
    label.textContent = "Listen to the guided introduction";
    if (buttonIcon) buttonIcon.textContent = "▶";
    stopButton.disabled = true;
    status.textContent = "Introduction stopped. Press play whenever you are ready.";
  });

  // A best-effort automatic start is attempted. Browsers that enforce a user
  // gesture for sound will show the manual-start fallback instead.
  window.setTimeout(function () { if (state === "idle") startGuide(true); }, 850);
})();
