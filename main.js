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
