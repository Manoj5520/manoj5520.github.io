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


/* Business Lens 01 — scroll-driven market intelligence scene. */
(function () {
  "use strict";
  var track = document.querySelector("[data-mi-scroll-track]");
  if (!track) return;
  var frame = track.querySelector(".mi-sticky-frame");
  var visual = track.querySelector("[data-mi-visual]");
  var copies = Array.prototype.slice.call(track.querySelectorAll("[data-mi-copy]"));
  var buttons = Array.prototype.slice.call(track.querySelectorAll("[data-mi-jump]"));
  var stateLabel = track.querySelector(".mi-current-state");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var labels = ["01 / FRAME THE MARKET", "02 / COMPARE CONSISTENTLY", "03 / IDENTIFY THE GAP", "04 / DEFINE THE DIRECTION"];
  var jumpStops = [0.045, 0.34, 0.64, 0.91];
  var ticking = false;
  var lastPhase = -1;
  var mobilePhase = null;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function update() {
    var rect = track.getBoundingClientRect();
    var travel = track.offsetHeight - frame.offsetHeight;
    var isMobile = window.matchMedia("(max-width: 760px)").matches;
    var progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
    var phase;
    if (isMobile) {
      phase = mobilePhase !== null ? mobilePhase : Number(track.getAttribute("data-mi-phase") || 0);
    } else {
      mobilePhase = null;
      phase = progress < 0.23 ? 0 : progress < 0.49 ? 1 : progress < 0.75 ? 2 : 3;
    }
    track.style.setProperty("--mi-progress", progress.toFixed(3));
    track.setAttribute("data-mi-phase", String(phase));
    if (visual) visual.setAttribute("data-mi-phase", String(phase));
    if (phase !== lastPhase) {
      copies.forEach(function (copy, i) {
        var active = Number(copy.getAttribute("data-mi-copy")) === phase;
        copy.classList.toggle("is-active", active);
        copy.setAttribute("aria-hidden", active ? "false" : "true");
      });
      buttons.forEach(function (button, i) {
        var active = Number(button.getAttribute("data-mi-jump")) === phase;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (stateLabel) stateLabel.textContent = labels[phase];
      lastPhase = phase;
    }
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 760px)").matches) {
        var mobileTargetPhase = Number(button.getAttribute("data-mi-jump"));
        var copy = track.querySelector('[data-mi-copy="' + mobileTargetPhase + '"]');
        if (copy) {
          mobilePhase = mobileTargetPhase;
          track.setAttribute("data-mi-phase", String(mobileTargetPhase));
          if (visual) visual.setAttribute("data-mi-phase", String(mobileTargetPhase));
          copies.forEach(function (item) {
            var active = item === copy;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-hidden", active ? "false" : "true");
          });
          buttons.forEach(function (item) {
            var active = item === button;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-pressed", active ? "true" : "false");
          });
          if (stateLabel) stateLabel.textContent = labels[mobileTargetPhase];
          lastPhase = mobileTargetPhase;
          return;
        }
      }
      var rect = track.getBoundingClientRect();
      var travel = track.offsetHeight - frame.offsetHeight;
      var targetProgress = jumpStops[Number(button.getAttribute("data-mi-jump"))] || 0;
      var target = window.scrollY + rect.top + Math.max(0, travel) * targetProgress;
      window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
