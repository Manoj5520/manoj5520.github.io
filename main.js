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
   Portfolio guided introduction — browser voice with controls
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

  var segments = [
    {
      label: "Welcome",
      text: "Hello, and welcome. Before you explore, pause for a moment. This is V. Sai Manoj’s portfolio. Rather than listing skills, I want to show you the thinking that connects my work.",
      pitch: 1.07, rate: 0.94
    },
    {
      label: "Capability Snapshot",
      text: "Start with Capability Snapshot. Here are my core strengths: competitive intelligence, market-gap analysis, commercial judgement, differentiated service strategy, and operational improvement. I look beyond what competitors already offer. I ask where customer needs remain underserved, what could set a business apart, and whether the opportunity can be delivered in practice.",
      pitch: 1.10, rate: 0.92
    },
    {
      label: "My Decision Logic",
      text: "Next, open My Decision Logic. It shows how I move from observation to recommendation: understand the context, frame the decision, compare alternatives, test commercial fit, and consider operational reality. The goal is not analysis for its own sake. It is clarity on what matters, what is feasible, and what should happen next.",
      pitch: 1.02, rate: 0.93
    },
    {
      label: "Experience and Projects",
      text: "Then explore Experience and Projects. Look for my Mercedes-Benz Retail of the Future review, competitor benchmarking and differentiated service-line research at NexaHomes, independent venture research, and MBA research into employee turnover. Different contexts, one discipline: examine evidence, question assumptions, recognise patterns, and connect insight with action.",
      pitch: 1.04, rate: 0.92
    },
    {
      label: "The difference I aim to make",
      text: "What difference can I make? I can help teams see opportunities beyond their current offer, understand trade-offs before committing, and connect customer expectations with commercial priorities and operational delivery. I bring curiosity to discovery, structure to decisions, and a bias for practical action. I do not claim to know every answer; I bring a disciplined way to investigate the right question and build a recommendation people can act on.",
      pitch: 1.08, rate: 0.92
    },
    {
      label: "An invitation",
      text: "Here is my invitation: give me a real business challenge. Share the context, constraints, and result you need. Give me the chance to explore the problem, map the choices, and show where meaningful progress can begin. Judge me by the questions I ask, the evidence I uncover, and the clarity of my thinking. I’m Sai Manoj. Let’s find what your business is missing—and turn it into an advantage.",
      pitch: 1.13, rate: 0.93
    }
  ];

  var state = "idle";
  var totalWords = 0;
  var completedWords = 0;
  segments.forEach(function (segment) {
    segment.words = segment.text.trim().split(/\s+/).length;
    segment.startWords = totalWords;
    totalWords += segment.words;
    segment.endWords = totalWords;
  });

  function setProgress(percent, duration) {
    var value = Math.max(0, Math.min(100, percent));
    progressFill.style.transitionDuration = (duration || 350) + "ms";
    progressFill.style.width = value + "%";
    progressTrack.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  function selectVoice() {
    var voices = synth.getVoices ? synth.getVoices() : [];
    var preferredPatterns = [
      /aria.*natural/i,
      /jenny.*natural/i,
      /google.*uk english female/i,
      /google.*us english/i,
      /samantha/i,
      /zira/i,
      /aria/i,
      /jenny/i,
      /sonia/i,
      /amy|emma|libby/i,
      /english.*female/i
    ];
    for (var p = 0; p < preferredPatterns.length; p++) {
      for (var v = 0; v < voices.length; v++) {
        if (preferredPatterns[p].test(voices[v].name) && /^en(-|_)/i.test(voices[v].lang || "")) return voices[v];
      }
    }
    for (var i = 0; i < voices.length; i++) {
      if (/^en(-|_)/i.test(voices[i].lang || "")) return voices[i];
    }
    return null;
  }

  function startGuide() {
    synth.cancel();
    state = "speaking";
    completedWords = 0;
    setProgress(0, 0);
    playButton.disabled = false;
    stopButton.disabled = false;
    label.textContent = "Pause introduction";
    if (buttonIcon) buttonIcon.textContent = "Ⅱ";
    status.textContent = "Preparing the guided introduction…";
    var voice = selectVoice();

    segments.forEach(function (segment, index) {
      var utterance = new window.SpeechSynthesisUtterance(segment.text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }
      utterance.pitch = segment.pitch;
      utterance.rate = segment.rate;
      utterance.volume = 1;

      utterance.onstart = function () {
        if (state === "stopped") return;
        var endPercent = segment.endWords / totalWords * 100;
        var expectedMs = Math.max(2400, segment.words / (145 * segment.rate) * 60000);
        var voiceNote = voice ? "" : " · using your device’s default English voice";
        status.textContent = "Now guiding you through " + segment.label + voiceNote + ".";
        setProgress(endPercent, expectedMs);
      };
      utterance.onend = function () {
        if (state === "stopped") return;
        completedWords = segment.endWords;
        if (index === segments.length - 1) {
          state = "finished";
          setProgress(100, 300);
          label.textContent = "Listen again";
          if (buttonIcon) buttonIcon.textContent = "▶";
          stopButton.disabled = true;
          status.textContent = "Introduction complete. Explore the portfolio at your own pace.";
        }
      };
      utterance.onerror = function (event) {
        if (state === "stopped" || (event && event.error === "canceled")) return;
        state = "idle";
        label.textContent = "Try the introduction again";
        if (buttonIcon) buttonIcon.textContent = "▶";
        stopButton.disabled = true;
        status.textContent = "Your browser could not continue the spoken introduction. Please try again or explore the portfolio normally.";
      };
      synth.speak(utterance);
    });
  }

  playButton.addEventListener("click", function () {
    if (state === "speaking") {
      synth.pause();
      state = "paused";
      label.textContent = "Resume introduction";
      if (buttonIcon) buttonIcon.textContent = "▶";
      status.textContent = "Introduction paused. Select Resume to continue.";
      return;
    }
    if (state === "paused") {
      synth.resume();
      state = "speaking";
      label.textContent = "Pause introduction";
      if (buttonIcon) buttonIcon.textContent = "Ⅱ";
      status.textContent = "Resuming the guided introduction…";
      return;
    }
    startGuide();
  });

  stopButton.addEventListener("click", function () {
    state = "stopped";
    synth.cancel();
    setProgress(0, 180);
    label.textContent = "Listen to the guided introduction";
    if (buttonIcon) buttonIcon.textContent = "▶";
    stopButton.disabled = true;
    status.textContent = "Introduction stopped. Press play whenever you are ready.";
  });
})();
