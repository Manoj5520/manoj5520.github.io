/* Vannam Sai Manoj — executive profile
   Static first, subtle motion second. No dependencies. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");
  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  // stagger siblings inside the same parent
  reveals.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList.contains("reveal");
    });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty("--d", Math.min(i * 70, 420) + "ms");
  });

  function settle(el) {
    // once revealed, drop the reveal styles so hover transitions stay immediate
    setTimeout(function () {
      el.classList.remove("reveal", "is-in");
      el.style.removeProperty("--d");
    }, 1300);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.remove("reveal"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
          settle(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }


  /* ---------- Capability snapshot motion ---------- */
  var snapshotStage = document.querySelector(".snapshot-stage");
  if (snapshotStage && !reduceMotion && "IntersectionObserver" in window) {
    var snapshotMotionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("motion-active", entry.isIntersecting);
      });
    }, { rootMargin: "40px 0px", threshold: 0.22 });
    snapshotMotionObserver.observe(snapshotStage);
  } else if (snapshotStage && !reduceMotion) {
    snapshotStage.classList.add("motion-active");
  }


  /* ---------- Project 03 viewport glint observer ---------- */
  var project03Chain = document.querySelector(".case-feature .chain");
  if (project03Chain && !reduceMotion && "IntersectionObserver" in window) {
    var project03GlintObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("market-glint-active", entry.isIntersecting);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.2 });
    project03GlintObserver.observe(project03Chain);
  }


  /* ---------- Professional Opportunities capability sequence ---------- */
  var capabilityVisual = document.querySelector(".capability-visual");
  if (capabilityVisual) {
    if (reduceMotion) {
      capabilityVisual.classList.remove("is-playing");
    } else if ("IntersectionObserver" in window) {
      var capabilityObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-playing", entry.isIntersecting);
        });
      }, { rootMargin: "0px 0px -7% 0px", threshold: 0.18 });
      capabilityObserver.observe(capabilityVisual);
    } else {
      capabilityVisual.classList.add("is-playing");
    }
  }

  /* ---------- Active navigation + progress ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav ul a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var progress = document.querySelector(".progress span");
  var portrait = document.querySelector("[data-parallax]");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = doc.scrollHeight - vh;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0).toFixed(4) + ")";

    var current = -1;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= vh * 0.35) current = i;
    });
    // the "approach" and "problems" sections sit between nav items; keep the previous item lit
    if (max - y < 4) current = sections.length - 1;
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === current); });

    if (portrait && !reduceMotion) {
      var r = portrait.parentNode.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        // gentle vertical drift within the 18% overscan of the image
        var p = Math.min(Math.max(1 - r.bottom / (vh + r.height), 0), 1);
        portrait.style.setProperty("--py", (-14 + p * 12).toFixed(2) + "%");
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Restrained depth on hover ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var target = el.querySelector(".portrait-frame") || el;
      var max = target === el ? 2.2 : 3;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        target.style.transform = "perspective(1200px) rotateY(" + (x * max).toFixed(2) + "deg) rotateX(" + (-y * max).toFixed(2) + "deg) translateY(-2px)";
      });
      el.addEventListener("pointerleave", function () { target.style.transform = ""; });
    });
  }

  /* ---------- Proof figure count ---------- */
  var count = document.querySelector("[data-count]");
  if (count && !reduceMotion) {
    var end = parseInt(count.getAttribute("data-count"), 10);
    var start = null;
    count.textContent = "0";
    var step = function (t) {
      if (!start) start = t;
      var k = Math.min((t - start) / 1100, 1);
      count.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    setTimeout(function () { requestAnimationFrame(step); }, 450);
  }

  /* ---------- Certificate viewer ---------- */
  var viewer = document.getElementById("viewer");
  var stage = document.getElementById("viewer-stage");
  var title = document.getElementById("viewer-title");
  var openLink = document.getElementById("viewer-open");
  var lastFocus = null;
  // small screens and browsers without <dialog> just open the file in a new tab
  var canView = viewer && typeof viewer.showModal === "function";

  function openViewer(href, type, label) {
    stage.innerHTML = "";
    var node;
    if (type === "pdf") {
      node = document.createElement("iframe");
      node.src = href + "#view=FitH&toolbar=0";
      node.title = label;
    } else {
      node = document.createElement("img");
      node.src = href;
      node.alt = label;
    }
    stage.appendChild(node);
    title.textContent = label;
    openLink.href = href;
    lastFocus = document.activeElement;
    viewer.showModal();
    document.body.style.overflow = "hidden";
  }
  function closeViewer() {
    viewer.close();
  }
  if (canView) {
    viewer.addEventListener("close", function () {
      stage.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    });
    document.getElementById("viewer-close").addEventListener("click", closeViewer);
    viewer.addEventListener("click", function (e) {
      if (e.target === viewer) closeViewer();
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-viewer]");
      if (!a) return;
      var type = a.getAttribute("data-viewer");
      // PDFs do not render inline on most phones; let those open natively
      if (type === "pdf" && window.innerWidth < 760) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openViewer(a.getAttribute("href"), type, a.getAttribute("data-title") || "Certificate");
    });
  }
})();


/* Business overview carousel — dots, keyboard support and native touch swiping. */
(function () {
  "use strict";
  var track = document.querySelector("[data-bc-track]");
  if (!track) return;
  var slides = Array.prototype.slice.call(track.querySelectorAll("[data-bc-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-bc-go]"));
  var count = document.querySelector("[data-bc-count]");
  if (!slides.length || !dots.length) return;
  var active = 0;
  var frame = 0;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function setActive(index) {
    active = clamp(index, 0, slides.length - 1);
    slides.forEach(function (slide, i) {
      var current = i === active;
      slide.setAttribute("aria-hidden", current ? "false" : "true");
      if ("inert" in slide) slide.inert = !current;
    });
    dots.forEach(function (dot, i) {
      var current = i === active;
      dot.classList.toggle("is-active", current);
      dot.setAttribute("aria-current", current ? "true" : "false");
    });
    if (count) count.innerHTML = String(active + 1).padStart(2, "0") + ' <i>/</i> ' + String(slides.length).padStart(2, "0");
  }
  function goTo(index) {
    var target = clamp(index, 0, slides.length - 1);
    var slide = slides[target];
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    setActive(target);
  }
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () { goTo(Number(dot.getAttribute("data-bc-go"))); });
  });
  track.addEventListener("scroll", function () {
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      var nearest = 0;
      var smallest = Infinity;
      slides.forEach(function (slide, i) {
        var distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (distance < smallest) { smallest = distance; nearest = i; }
      });
      if (nearest !== active) setActive(nearest);
    });
  }, { passive: true });
  track.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
    if (event.key === "Home") { event.preventDefault(); goTo(0); }
    if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); }
  });
  setActive(0);
})();


/* ==========================================================
   Portfolio guided introduction — human-paced spoken delivery
   Cadence: warm welcome, lifted capability cues, grounded evidence,
   lower measured value proposition, confident invitation.
   ========================================================== */
(function () {
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
    status.textContent = "This browser does not support spoken introductions. You can still explore the portfolio normally.";
    return;
  }

  /*
   * Each beat is one spoken thought. Sentence boundaries are real pauses,
   * not punctuation piled into a single long speech-synthesis paragraph.
   * Pitch changes are deliberately subtle; pace, silence and contrast do
   * most of the expressive work.
   */
  var beats = [
    { stage: "Welcome", text: "Hello, and welcome.", pitch: 0.94, rate: 0.89, gap: 780 },
    { stage: "Welcome", text: "Before you explore, let me show you how to read this portfolio.", pitch: 0.93, rate: 0.90, gap: 420 },
    { stage: "Welcome", text: "This is the portfolio of V. Sai Manoj.", pitch: 0.90, rate: 0.88, gap: 720 },
    { stage: "The central idea", text: "My work asks one question: where can a business create an advantage customers value and operations deliver?", pitch: 0.93, rate: 0.90, gap: 760 },

    { stage: "Capability Snapshot", text: "Start with Capability Snapshot.", pitch: 0.98, rate: 0.91, gap: 340 },
    { stage: "Capability Snapshot", text: "Competitive intelligence. Market-gap analysis. Commercial judgement. Service-line strategy. Business operations.", pitch: 1.00, rate: 0.90, gap: 600 },
    { stage: "Capability Snapshot", text: "I examine customer needs, competitor offers, positioning, and delivery constraints.", pitch: 0.94, rate: 0.90, gap: 260 },
    { stage: "Capability Snapshot", text: "I look for opportunities a business can own—and deliver profitably.", pitch: 0.97, rate: 0.89, gap: 700 },

    { stage: "My Decision Logic", text: "Next, open My Decision Logic.", pitch: 0.96, rate: 0.90, gap: 340 },
    { stage: "My Decision Logic", text: "See how I frame decisions, test evidence, compare options, and find the next move.", pitch: 0.90, rate: 0.90, gap: 520 },
    { stage: "My Decision Logic", text: "Market signals matter when tied to commercial priorities and operational reality.", pitch: 0.91, rate: 0.89, gap: 760 },

    { stage: "Experience and Projects", text: "Then explore Experience and Projects.", pitch: 0.94, rate: 0.90, gap: 320 },
    { stage: "Experience and Projects", text: "At Mercedes-Benz, I reviewed Retail of the Future: inventory access, price transparency, dealer flexibility, and customer experience.", pitch: 0.90, rate: 0.87, gap: 460 },
    { stage: "Experience and Projects", text: "At NexaHomes, I benchmarked competitors and assessed new service-line opportunities aligned with the business positioning.", pitch: 0.92, rate: 0.88, gap: 460 },
    { stage: "Experience and Projects", text: "My venture and MBA research reflect the same discipline: question assumptions, connect evidence, structure choices.", pitch: 0.91, rate: 0.88, gap: 800 },

    { stage: "The difference I aim to make", text: "So, what can I bring to a business?", pitch: 0.88, rate: 0.86, gap: 680 },
    { stage: "The difference I aim to make", text: "A joined-up view of market, offer, and operations.", pitch: 0.87, rate: 0.88, gap: 460 },
    { stage: "The difference I aim to make", text: "I help teams spot underserved needs, find competitive gaps, test offer fit, and turn findings into priorities.", pitch: 0.89, rate: 0.87, gap: 560 },
    { stage: "The difference I aim to make", text: "Not analysis for its own sake—insight that makes decisions clearer and stronger.", pitch: 0.91, rate: 0.86, gap: 850 },

    { stage: "An invitation", text: "Here is my invitation.", pitch: 0.95, rate: 0.89, gap: 500 },
    { stage: "An invitation", text: "Give me a real business challenge—and the outcome that matters.", pitch: 0.96, rate: 0.88, gap: 400 },
    { stage: "An invitation", text: "Let me investigate, map options, and find where progress can begin.", pitch: 0.98, rate: 0.88, gap: 520 },
    { stage: "An invitation", text: "Judge my questions, my evidence, and the value I help create.", pitch: 0.97, rate: 0.88, gap: 760 },
    { stage: "An invitation", text: "Explore the work. Challenge the thinking.", pitch: 0.96, rate: 0.90, gap: 620 },
    { stage: "An invitation", text: "Let’s turn an overlooked gap into your next advantage.", pitch: 0.99, rate: 0.88, gap: 0 }
  ];

  var state = "idle";
  var currentIndex = 0;
  var totalWords = 0;
  var completedWords = 0;
  var firstBeatStarted = false;
  var autoStartTimer = null;
  var nextBeatTimer = null;
  var activeUtterance = false;
  var pendingIndex = null;
  var chosenVoice = null;

  beats.forEach(function (beat) {
    beat.words = beat.text.trim().split(/\s+/).length;
    beat.startWords = totalWords;
    totalWords += beat.words;
    beat.endWords = totalWords;
  });

  function clearTimers() {
    if (autoStartTimer) window.clearTimeout(autoStartTimer);
    if (nextBeatTimer) window.clearTimeout(nextBeatTimer);
    autoStartTimer = null;
    nextBeatTimer = null;
  }

  function setProgress(percent, duration) {
    var value = Math.max(0, Math.min(100, percent));
    progressFill.style.transitionDuration = (duration || 350) + "ms";
    progressFill.style.width = value + "%";
    progressTrack.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  function selectVoice() {
    var voices = synth.getVoices ? synth.getVoices() : [];
    var english = voices.filter(function (voice) {
      return /^en(-|_)/i.test(voice.lang || "");
    });

    // Prefer recognised male English voices, including natural/neural variants.
    // Voice labels vary by operating system and browser.
    var malePatterns = [
      /microsoft.*(?:guy|ryan|david|mark|christopher|jason|tony|andrew|brian|eric|roger|thomas|george|daniel|james|oliver|arthur|aaron).*natural/i,
      /microsoft.*(?:guy|ryan|david|mark|christopher|jason|tony|andrew|brian|eric|roger|thomas|george|daniel|james|oliver|arthur|aaron)/i,
      /google.*(?:uk|us|english).*male/i,
      /english.*male/i,
      /\b(?:daniel|alex|fred|ralph|david|george|james|oliver|aaron|guy|ryan|mark|brian|thomas|christopher|jason|andrew)\b/i
    ];
    for (var p = 0; p < malePatterns.length; p++) {
      for (var v = 0; v < english.length; v++) {
        if (malePatterns[p].test(english[v].name)) return english[v];
      }
    }

    // Avoid well-known female-labelled voices when no male voice is clearly labelled.
    var femalePattern = /zira|aria|jenny|samantha|susan|hazel|eva|heera|female|sonia|natasha|michelle|jane|amy|emma|libby/i;
    for (var i = 0; i < english.length; i++) {
      if (!femalePattern.test(english[i].name)) return english[i];
    }
    return english.length ? english[0] : null;
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
      if (state === "paused") return;
      if (state !== "speaking") return;
      pendingIndex = null;
      speakBeat(index);
    }, delay);
  }

  function speakBeat(index) {
    if (state !== "speaking") return;
    if (index >= beats.length) {
      finishGuide();
      return;
    }

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
      var voiceNote = chosenVoice ? "" : " · using your device’s default English voice";
      status.textContent = "Now guiding you through " + beat.stage + voiceNote + ".";
      setProgress(beat.endWords / totalWords * 100, expectedMs + beat.gap);
    };

    utterance.onend = function () {
      if (state === "stopped" || state === "failed") return;
      activeUtterance = false;
      completedWords = beat.endWords;
      if (index === beats.length - 1) {
        finishGuide();
      } else {
        scheduleBeat(index + 1, beat.gap);
      }
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
    chosenVoice = selectVoice();
    firstBeatStarted = false;
    currentIndex = 0;
    completedWords = 0;
    pendingIndex = null;
    activeUtterance = false;
    state = "speaking";
    setProgress(0, 0);
    stopButton.disabled = false;
    label.textContent = "Pause introduction";
    if (buttonIcon) buttonIcon.textContent = "Ⅱ";
    status.textContent = isAutoStart ? "Starting your guided introduction…" : "Preparing the guided introduction…";
    speakBeat(0);

    if (isAutoStart) {
      autoStartTimer = window.setTimeout(function () {
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
      }, 2400);
    }
  }

  playButton.addEventListener("click", function () {
    if (state === "speaking" && !firstBeatStarted) {
      startGuide(false);
      return;
    }
    if (state === "speaking") {
      if (nextBeatTimer) {
        window.clearTimeout(nextBeatTimer);
        nextBeatTimer = null;
      }
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
      if (activeUtterance) {
        synth.resume();
      } else {
        scheduleBeat(pendingIndex === null ? currentIndex + 1 : pendingIndex, 220);
      }
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

  // Attempt automatic welcome on page entry. Browsers may require a click
  // before allowing sound; the control stays available if automatic speech is blocked.
  window.setTimeout(function () {
    if (state === "idle") startGuide(true);
  }, 850);
})();

