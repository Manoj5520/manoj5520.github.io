/* MANRA — portfolio-grounded capability assistant.
   Static preview is intentionally transparent: connect a secure server endpoint
   through window.MANRA_API_ENDPOINT for open-ended generative answers.
   Never put provider API keys in this public file. */
(function () {
  "use strict";
  var launch = document.getElementById("manra-launch");
  var panel = document.getElementById("manra-assistant");
  if (!launch || !panel) return;
  var close = document.getElementById("manra-close");
  var form = document.getElementById("manra-form");
  var input = document.getElementById("manra-input");
  var thread = document.getElementById("manra-thread");
  var mic = document.getElementById("manra-mic");
  var status = document.getElementById("manra-status");
  var recognition = null;
  var listening = false;

  var profile = {
    positioning: "Manoj is best positioned at the intersection of business operations, structured research, process coordination and growth execution—not as a specialist data engineer or a conventional HR candidate.",
    capabilities: [
      ["Turning scattered information into decisions", "He can structure business questions, compare options and translate findings into practical next steps. His portfolio presents competitor benchmarking, business-model analysis and service-line choices as evidence of this approach."],
      ["Customer and service operations", "At NexaHomes, the documented experience includes work across a portfolio of 100+ residential clients and exposure to client requirements, property-related service coordination and operating workflows."],
      ["Commercial and market understanding", "His Mercedes-Benz internship included a retail-model study. Combined with competitor and service-line research, this supports a credible story around understanding how a business positions, delivers and differentiates its offer."],
      ["Reporting and operational visibility", "He has practical Excel experience and intermediate Power BI exposure for MIS/reporting. This supports operational tracking and decision support; it does not justify presenting him as an advanced BI developer."],
      ["Structured communication and execution", "His strongest narrative is connecting evidence, stakeholders and workflows: clarify the issue, organise inputs, identify options, communicate implications and follow through on execution."]
    ],
    evidence: [
      "NexaHomes experience (May 2025–August 2026), including a documented 100+ residential-client portfolio.",
      "Mercedes-Benz business/management internship (July–September 2022), including a retail-model study.",
      "MBA in Human Resource Management from CHRIST (Deemed to be University), Pune Lavasa Campus; thesis on forecasting employee turnover in Bangalore IT industry.",
      "Practical Excel, intermediate Power BI, beginner-to-intermediate Tableau and basic SQL—describe these accurately, without overstating technical depth."
    ],
    roles: [
      "Business Operations / Business Operations Associate",
      "Operations Excellence or Process Coordination",
      "Growth Operations / Commercial Operations",
      "Program or Product Operations (execution-oriented roles)",
      "Market and Competitive Intelligence",
      "Revenue Operations support focused on process, systems and coordination—not finance ownership"
    ],
    development: "The next step is to strengthen quantified case studies: show the original business problem, the information analysed, the recommendation, who used it, and a verified outcome. Where an outcome was not measured, state that plainly. Deepening SQL, Power BI modelling and process-mapping skills would widen role options."
  };

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    launch.setAttribute("aria-expanded", "true");
    window.setTimeout(function () { input.focus(); }, 80);
  }
  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    launch.setAttribute("aria-expanded", "false");
    stopListening();
    launch.focus();
  }
  launch.addEventListener("click", openPanel);
  close.addEventListener("click", closePanel);
  panel.addEventListener("click", function (event) {
    if (event.target === panel) closePanel();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
  });

  function addMessage(text, who) {
    var item = document.createElement("div");
    item.className = "manra-message " + (who === "user" ? "manra-user-message" : "manra-assistant-message");
    var label = document.createElement("strong");
    label.textContent = who === "user" ? "YOU" : "MANRA";
    var body = document.createElement("p");
    body.textContent = text;
    item.appendChild(label);
    item.appendChild(body);
    thread.appendChild(item);
    thread.scrollTop = thread.scrollHeight;
    return item;
  }
  function makeLocalAnswer(question) {
    var q = question.toLowerCase();
    var lead = "MANRA'S ASSESSMENT\n";
    if (/differentiat|unique|stand out|typical candidate|strength|talent|best at|best contribute|capabilit|ability/.test(q)) {
      return lead + "Manoj’s most credible differentiator is the combination of commercial curiosity and operational follow-through: he is interested not only in what the market is doing, but what a business should do with that information.\n\n" +
        "1. Evidence-to-action thinking — competitor benchmarking and business-model research are presented in his portfolio as inputs to service-line decisions.\n" +
        "2. Customer-facing operating context — NexaHomes experience includes a 100+ residential-client portfolio, giving him practical exposure to client needs and service coordination.\n" +
        "3. Commercial exposure — his Mercedes-Benz internship included a retail-model study, adding a structured business perspective beyond one industry.\n" +
        "4. Reporting discipline — practical Excel and intermediate Power BI can support operational visibility and MIS; they should not be marketed as advanced engineering skills.\n\n" +
        "Where this can matter: teams that need someone to organise information, spot process gaps, coordinate stakeholders and convert findings into clear next steps. These are evidence-backed strengths, not a claim that he has already delivered unverified revenue growth or cost savings.";
    }
    if (/where|contribut|role fit|role|position|team|hire|value|business/.test(q)) {
      return lead + "The strongest near-term fit is in execution-oriented roles where analysis informs operations, rather than roles requiring deep technical specialisation.\n\n" +
        "PRIORITY FIT\n• Business Operations: coordinate workflows, track issues, improve reporting and keep cross-functional work moving.\n" +
        "• Growth / Commercial Operations: organise market and competitor inputs, support service-line decisions and improve the handoff from insight to execution.\n" +
        "• Process Coordination / Operations Excellence: document workflows, identify recurring friction and help teams standardise follow-through.\n" +
        "• Market & Competitive Intelligence: structure competitor comparisons and convert findings into implications for positioning or service choices.\n" +
        "• Program / Product Operations: support execution plans, stakeholder updates, operating metrics and issue tracking.\n\n" +
        "WHY THE FIT IS CREDIBLE: NexaHomes client/service operations, a Mercedes-Benz retail-model study, competitor benchmarking and practical Excel/intermediate Power BI reporting. The best role will value judgement, organisation and business communication—not require advanced SQL, data engineering or a specialist finance/HR track.";
    }
    if (/weakness|gap|improv|develop|risk|limitation|not good|missing/.test(q)) {
      return lead + profile.development + "\n\nA fair hiring assessment should also test prioritisation, stakeholder communication, comfort with ambiguity and the ability to show one complete example from problem definition through recommendation and follow-up. His portfolio should not claim quantified impact unless there is evidence for it.";
    }
    if (/experience|proof|evidence|credential|background|track record|example/.test(q)) {
      return lead + "The portfolio's clearest evidence points are:\n\n" + profile.evidence.map(function (x, i) { return (i + 1) + ". " + x; }).join("\n") + "\n\nThese are useful starting points for interview questions. For a stronger case, ask Manoj to explain the context, his exact responsibility, the decision or deliverable, and the verified result. Do not infer business outcomes from participation alone.";
    }
    if (/resume|cv|summary|introduc|pitch|elevator/.test(q)) {
      return "A concise positioning statement:\n\n“V. Sai Manoj is a business-operations professional who connects customer and market signals with structured research, operational reporting and practical execution. His experience spans NexaHomes client/service operations, a Mercedes-Benz retail-model study and competitor benchmarking. He is best suited to roles where teams need clear analysis, coordinated delivery and better operating visibility.”\n\nThis is a positioning summary, not a claim of specialist-level technical expertise or unverified financial impact.";
    }
    if (/salary|package|ctc|lpa|pay/.test(q)) {
      return "MANRA'S VIEW\nSalary depends on the role scope, employer, location and interview performance. Manoj has previously targeted roles around ₹7–13 LPA, but that is an ambition—not evidence of market value or a guaranteed outcome. Prioritise roles whose responsibilities match his demonstrated operations, research, reporting and coordination strengths; validate the range against current openings and the actual job description.";
    }
    return lead + profile.positioning + "\n\nThe strongest documented signals are:\n" + profile.evidence.map(function (x, i) { return (i + 1) + ". " + x; }).join("\n") +
      "\n\nPOTENTIAL CONTRIBUTION\n" + profile.capabilities.map(function (x, i) { return (i + 1) + ". " + x[0] + " — " + x[1]; }).join("\n\n") +
      "\n\nROLE FAMILIES TO EXPLORE\n" + profile.roles.map(function (x) { return "• " + x; }).join("\n") +
      "\n\nDEVELOPMENT PRIORITY\n" + profile.development +
      "\n\nThis preview is grounded in the public portfolio. For genuinely open-ended, adaptive AI conversations, a secure server-side AI connection still needs to be configured; no API key is stored in this public website.";
  }

  async function answer(question) {
    var thinking = addMessage("Reviewing the question against the portfolio evidence…", "assistant");
    try {
      if (window.MANRA_API_ENDPOINT && /^https:\/\//i.test(window.MANRA_API_ENDPOINT)) {
        var response = await fetch(window.MANRA_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question })
        });
        if (!response.ok) throw new Error("Assistant service unavailable");
        var data = await response.json();
        thinking.querySelector("p").textContent = data.answer || "I couldn't prepare an answer for that question.";
        return;
      }
      thinking.querySelector("p").textContent = makeLocalAnswer(question);
    } catch (error) {
      thinking.querySelector("p").textContent = makeLocalAnswer(question) + "\n\nNote: the live AI service is not connected yet, so this is the portfolio-grounded preview.";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    answer(question);
  });
  document.querySelectorAll("[data-manra-prompt]").forEach(function (button) {
    button.addEventListener("click", function () {
      input.value = button.getAttribute("data-manra-prompt");
      form.requestSubmit();
    });
  });

  function stopListening() {
    if (recognition && listening) {
      try { recognition.stop(); } catch (e) {}
    }
    listening = false;
    mic.setAttribute("aria-pressed", "false");
  }
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    mic.disabled = true;
    status.textContent = "Voice input is not supported in this browser. You can type instead.";
    mic.title = "Voice input not supported";
  } else {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = function () {
      listening = true;
      mic.setAttribute("aria-pressed", "true");
      status.textContent = "Listening… ask your question.";
    };
    recognition.onresult = function (event) {
      var transcript = "";
      for (var i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      input.value = transcript;
    };
    recognition.onerror = function (event) {
      status.textContent = event.error === "not-allowed" ? "Allow microphone access in your browser settings." : "Voice input stopped. You can type instead.";
      stopListening();
    };
    recognition.onend = function () {
      listening = false;
      mic.setAttribute("aria-pressed", "false");
      if (status.textContent === "Listening… ask your question.") status.textContent = "Voice captured. Press Ask MANRA to submit.";
    };
    mic.addEventListener("click", function () {
      if (listening) { stopListening(); return; }
      try { recognition.start(); } catch (e) { status.textContent = "Please try the microphone again."; }
    });
  }
  status.textContent = window.MANRA_API_ENDPOINT ? "Voice-ready · AI service configured" : (SpeechRecognition ? "Voice-ready · AI connection pending" : "AI connection pending · type your question");
})();