/* MANRA 231999 — voice-first, portfolio-grounded capability intelligence.
   The public site never contains provider secrets. For fully open-ended AI,
   configure a secure HTTPS endpoint in window.MANRA_API_ENDPOINT. */
(function () {
  "use strict";

  var launch = document.getElementById("manra-launch");
  var panel = document.getElementById("manra-assistant");

  // Universal embed: create the same MANRA panel automatically on the ETHIC site.
  if (!launch || !panel) {
    var shell = document.createElement("div");
    shell.innerHTML =
      '<button class="manra-launch manra-standalone-launch" id="manra-launch" type="button" aria-controls="manra-assistant" aria-expanded="false">' +
        '<span class="manra-launch-mic" aria-hidden="true">◉</span><span class="manra-launch-copy"><strong>Hey MANRA</strong><small>Ask about Manoj · voice assistant</small></span><span class="manra-launch-arrow" aria-hidden="true">↗</span>' +
      '</button>' +
      '<section class="manra-widget" id="manra-assistant" aria-label="MANRA 231999 assistant" aria-hidden="true"><div class="manra-panel">' +
        '<div class="manra-head"><div><span class="manra-kicker">MANRA 231999 · PERSONAL &amp; PROJECT INTELLIGENCE</span><h2>MANRA <span>·</span> Capability Intelligence</h2></div><button class="manra-close" id="manra-close" type="button" aria-label="Close MANRA">×</button></div>' +
        '<p class="manra-intro">Ask about Manoj’s professional capabilities, evidence, portfolio or ETHIC’s Behavior Engineering work. MANRA distinguishes facts from hypotheses and keeps VM-PRIME access manual.</p>' +
        '<div class="manra-voice-console" id="manra-voice-console" data-state="idle" role="status" aria-live="polite"><div class="manra-visual" aria-hidden="true"><span class="manra-visual-ring manra-ring-one"></span><span class="manra-visual-ring manra-ring-two"></span><span class="manra-visual-ring manra-ring-three"></span><span class="manra-visual-orb"><i>MANRA</i><b>231999</b></span><span class="manra-visual-signal manra-signal-one"></span><span class="manra-visual-signal manra-signal-two"></span><span class="manra-visual-signal manra-signal-three"></span></div><div class="manra-voice-copy"><span class="manra-voice-overline">VOICE INTERFACE · 231999</span><strong id="manra-voice-title">MANRA is ready</strong><p id="manra-voice-caption">Ask by voice or type a question.</p></div></div>' +
        '<div class="manra-prompts" aria-label="Suggested questions"><button type="button" data-manra-prompt="What are Manoj’s strongest professional capabilities and what evidence supports them?">Manoj · strengths</button><button type="button" data-manra-prompt="Explain ETHIC’s Behavior Engineering thesis, friction discovery process and current evidence status.">ETHIC · intelligence</button><button type="button" data-manra-prompt="Open my personal portfolio.">Open personal portfolio</button><button type="button" data-manra-prompt="Open ETHIC VM-PRIME.">VM-PRIME · manual access</button></div>' +
        '<div class="manra-thread" id="manra-thread" role="log" aria-live="polite"><div class="manra-message manra-assistant-message"><strong>MANRA 231999</strong><p>Ready. Ask about Manoj or ETHIC, or ask me to open the personal portfolio.</p></div></div>' +
        '<form class="manra-form" id="manra-form"><label class="sr-only" for="manra-input">Ask MANRA a question</label><textarea id="manra-input" rows="2" maxlength="1600" placeholder="Ask about Manoj, ETHIC, capabilities or evidence…" required></textarea><div class="manra-controls"><button class="manra-mic" id="manra-mic" type="button" aria-label="Start MANRA voice conversation" title="Start voice conversation"><span class="manra-mic-icon" aria-hidden="true">◉</span><span id="manra-mic-label">Start voice conversation</span></button><span class="manra-status" id="manra-status">Voice availability depends on your browser.</span><button class="manra-send" type="submit">Ask MANRA <span aria-hidden="true">↗</span></button></div></form>' +
        '<p class="manra-footnote">Public portfolio and ETHIC information · VM-PRIME access is handled manually.</p></div></section>';
    document.body.appendChild(shell);
    launch = document.getElementById("manra-launch");
    panel = document.getElementById("manra-assistant");
  }
  if (!launch || !panel) return;

  var close = document.getElementById("manra-close");
  var form = document.getElementById("manra-form");
  var input = document.getElementById("manra-input");
  var thread = document.getElementById("manra-thread");
  var mic = document.getElementById("manra-mic");
  var status = document.getElementById("manra-status");
  var visual = document.getElementById("manra-voice-console");
  var visualTitle = document.getElementById("manra-voice-title");
  var visualCaption = document.getElementById("manra-voice-caption");
  var micLabel = document.getElementById("manra-mic-label");

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = SpeechRecognition ? new SpeechRecognition() : null;
  var listening = false;
  var voiceSession = false;
  var pendingVoiceQuestion = "";
  var conversationHistory = [];
  var speechSynthesis = window.speechSynthesis || null;

  var GREETING = "Hello, dignitaries. This is MANRA, the intelligence assistant to Manoj. How may I help you?";

  var profile = {
    positioning: "V. Sai Manoj is best positioned at the intersection of business operations, customer and service coordination, structured research, commercial intelligence and practical process improvement. His strongest story is not that he is a specialist data engineer; it is that he can organise business information, understand customer and market context, make operating issues clearer and help teams move from insight to execution.",
    strengths: [
      ["Business and customer operations", "At NexaHomes, his documented role was Growth Manager & Operations Associate from May 2025 to August 2026. The portfolio records work across a 100+ residential-client portfolio, including requirement capture, tailored offers, upgrade and post-sale follow-ups, vendor coordination, sales-to-delivery handoffs and reporting."],
      ["Commercial and competitor intelligence", "He conducted competitor benchmarking in the Hyderabad residential market and used the findings to inform service-line choices and business positioning. The credible strength is structured comparison and commercial interpretation—not claiming that research alone produced a measured revenue increase."],
      ["Process coordination and improvement thinking", "He has worked with handoffs, request tracking and coordination gaps, and has prepared proposed process-control examples. The portfolio carefully distinguishes proposed improvements from a fully implemented, measured transformation."],
      ["Operational reporting and decision support", "He has practical Excel experience and intermediate Power BI exposure for MIS and decision-support views. This can support tracking, reporting and management visibility. It does not establish advanced Excel modelling or advanced Power BI development."],
      ["Business research and structured problem framing", "His MBA thesis examined employee-turnover forecasting in the Bangalore IT industry through engagement, growth and culture. His work also includes a Mercedes-Benz retail-model study and business-model trade-off analysis."],
      ["Cross-functional execution context", "His NexaHomes evidence includes connecting customer requirements, vendors, sales and delivery activity. This supports a credible coordination narrative; it is not proof of formal people-management responsibility."]
    ],
    evidence: [
      "NexaHomes — Growth Manager & Operations Associate, May 2025–August 2026; documented scope across 100+ residential clients.",
      "NexaHomes — requirement capture, tailored offers, upgrade/post-sale follow-ups, vendor coordination, sales-to-delivery handoffs, competitor research and Excel/Power BI MIS views.",
      "Mercedes-Benz — Management Trainee Intern, July–September 2022; retail-model study and customer-engagement context.",
      "Tata Motors — organisational-structure training programme, April–May 2021.",
      "My Choices Foundation — Social Concern Project / Impact Internship.",
      "MBA — Human Resource Management, CHRIST (Deemed to be University), Pune Lavasa Campus; thesis on forecasting employee turnover in Bangalore IT through engagement, growth and culture.",
      "Tools — practical Excel, intermediate Power BI, beginner-to-intermediate Tableau and basic SQL.",
      "Credentials include IBM Enterprise Design Thinking Practitioner and IBM Agile Explorer. The BCG Strategy Consulting experience is a Forage job simulation, not BCG employment."
    ],
    roles: [
      "Business Operations / Business Operations Associate",
      "Service Operations / Customer Operations",
      "Process Coordination / Operations Excellence support",
      "Growth Operations / Commercial Operations",
      "Market and Competitive Intelligence",
      "Program or Product Operations in execution-focused teams"
    ],
    tools: "Excel: practical working ability including PivotTables, VLOOKUP and conditional formatting. Power BI: intermediate exposure for MIS and operational dashboards. Tableau: beginner-to-intermediate. SQL: basic. SPSS: survey-data analysis exposure. Microsoft Office, Canva, ChatGPT and Copilot: practical digital support. Do not describe him as an advanced SQL user, advanced Power BI developer, data scientist or data engineer.",
    development: "The main development priorities are stronger Excel modelling and data interpretation, more confident PowerPoint storytelling, deeper Power BI practice, basic-to-intermediate SQL progression, and quantified case studies that show the original problem, Manoj's exact responsibility, the action taken and a verified result. The portfolio does not claim unverified revenue growth, cost savings, cycle-time reduction or satisfaction improvement."
  };

  function setVisualState(state, title, caption) {
    if (visual) visual.setAttribute("data-state", state);
    if (visualTitle) visualTitle.textContent = title;
    if (visualCaption) visualCaption.textContent = caption;
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function setMicMode(active) {
    if (!mic) return;
    mic.setAttribute("aria-pressed", active ? "true" : "false");
    if (micLabel) micLabel.textContent = active ? "Stop voice session" : "Start voice conversation";
    mic.setAttribute("aria-label", active ? "Stop MANRA voice conversation" : "Start MANRA voice conversation");
  }

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    launch.setAttribute("aria-expanded", "true");
    window.setTimeout(function () { if (input) input.focus(); }, 80);
  }

  function closePanel() {
    stopVoiceSession();
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
  }

  launch.addEventListener("click", function () {
    openPanel();
    startVoiceSession();
  });
  if (close) close.addEventListener("click", closePanel);
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
    label.textContent = who === "user" ? "YOU" : "MANRA 231999";
    var body = document.createElement("p");
    body.textContent = text;
    item.appendChild(label);
    item.appendChild(body);
    thread.appendChild(item);
    thread.scrollTop = thread.scrollHeight;
    return item;
  }

  function formatEvidence() {
    return profile.evidence.map(function (item, index) {
      return (index + 1) + ". " + item;
    }).join("\n");
  }

  function answerIbmRole() {
    return "MANRA 231999 — IBM BUSINESS OPERATIONS MANAGEMENT TRAINEE ASSESSMENT\n\n" +
      "VERDICT: YES — Manoj is worth serious consideration for an interview, particularly if this is a generalist Business Operations trainee role focused on process coordination, service operations, reporting, stakeholder follow-through and improvement. I would call him a credible, conditional fit—not a guaranteed high performer.\n\n" +
      "WHY THE FIT IS REAL\n" +
      "1. Relevant operating context: At NexaHomes he worked across a 100+ residential-client portfolio, connecting requirements, tailored offers, vendor coordination, post-sale requests and sales-to-delivery handoffs. That is practical exposure to service operations and multiple moving parts.\n" +
      "2. Information-to-action thinking: Competitor benchmarking informed service-line choices. He has experience structuring information to help a business evaluate options, rather than treating research as an end in itself.\n" +
      "3. Reporting foundation: Practical Excel and intermediate Power BI exposure can support MIS, tracking and operating visibility.\n" +
      "4. Business education and learning context: His MBA, business research, Mercedes-Benz retail-model study and IBM learning credentials give him a relevant foundation for a trainee pathway.\n\n" +
      "WHERE HE COULD ADD VALUE AT IBM\n" +
      "He could support operating reviews, issue and action tracking, workflow documentation, stakeholder coordination, service-delivery handoffs, management reporting, competitor or business research, and small process-improvement initiatives. He should be positioned as an operations-minded business generalist who can use data—not as an advanced data specialist.\n\n" +
      "WHAT IBM SHOULD TEST BEFORE HIRING\n" +
      "• Excel accuracy and comfort with formulas, pivots, reconciliations and structured trackers.\n" +
      "• Ability to interpret operational metrics, identify a variance and explain what action should follow.\n" +
      "• Clear PowerPoint and verbal communication, especially when explaining an issue to a manager.\n" +
      "• Prioritisation when several stakeholders need updates at the same time.\n" +
      "• Attention to detail, follow-through and comfort with repeatable operating controls.\n\n" +
      "THE GAPS — NO SUGAR-COATING\n" +
      "His current evidence does not prove advanced Excel modelling, advanced Power BI development, strong SQL, formal finance operations, large-scale transformation ownership or quantified cost/revenue impact. If the IBM role is heavily finance-led, reconciliation-heavy or expects advanced modelling from day one, the fit is weaker and he would need training. His portfolio also needs one or two tightly quantified work examples wherever genuine measures are available.\n\n" +
      "CAN HE EXCEL?\n" +
      "Potentially, yes. His client-operations exposure and evidence-to-action approach give him a useful base for a trainee role. To excel, he must become dependable with data accuracy, status reporting, written updates, presentation and disciplined follow-through. Those capabilities should be tested in an interview or case exercise; they should not simply be assumed.\n\n" +
      "MANRA'S RECOMMENDATION\n" +
      "Shortlist him for a general Business Operations Management Trainee interview. Give him a practical case: review a small operations tracker, identify the three biggest issues, explain their likely causes, prioritise actions and present a one-page update. That will reveal more than a generic interview. The final fit depends on the actual IBM job description and the level of Excel, finance and analytics expected.";
  }


  var ROLE_CATALOG = [
    {
      key: "business-operations",
      title: "Business Operations / Management Trainee",
      fit: "Strongest near-term fit",
      aliases: [/business\s*operations?/i, /\bbiz\s*ops\b/i, /operations management trainee/i],
      evidence: "NexaHomes client operations across a 100+ residential-client portfolio; customer requirements, tailored offers, vendor coordination, sales-to-delivery handoffs, post-sale follow-through and MIS reporting.",
      contribution: "Operating trackers, issue and action logs, workflow documentation, stakeholder follow-through, service-delivery coordination, management reporting and small process-control improvements.",
      gaps: "Test Excel accuracy, metric interpretation, concise reporting, prioritisation under pressure and comfort with the role's finance or reconciliation content."
    },
    {
      key: "service-operations",
      title: "Service Operations / Customer Operations",
      fit: "Strong near-term fit",
      aliases: [/service operations?/i, /customer operations?/i, /client operations?/i, /customer experience operations?/i],
      evidence: "Customer requirement capture, customization-led offers, upgrade and post-sale requests, vendor handoffs and continuity across the client journey.",
      contribution: "Case tracking, service coordination, issue ageing, customer handoffs, escalation follow-through and reporting on service delivery.",
      gaps: "Add quantified service measures and demonstrate experience with ticketing, CRM or service-management systems where required."
    },
    {
      key: "strategy-growth-operations",
      title: "Strategy & Growth Operations",
      fit: "Good adjacent fit when the role combines commercial research with hands-on execution",
      aliases: [/strategy\\s*(?:and|&)\\s*growth operations?/i],
      evidence: "The NexaHomes Growth Manager & Operations Associate role, Hyderabad residential competitor benchmarking used to inform service-line choices, customer-to-delivery operating context and growth-support coordination.",
      contribution: "Translate market and customer signals into opportunity briefs, coordinate growth initiatives, maintain execution trackers, connect commercial priorities with operating teams and report progress.",
      gaps: "The evidence does not establish ownership of corporate strategy, market sizing, financial modelling, full P&L, paid acquisition performance or quantified revenue growth. The best fit is execution-led strategy and growth operations rather than a pure strategy-consulting role."
    },
    {
      key: "growth-commercial-operations",
      title: "Growth Operations / Commercial Operations",
      fit: "Strong-to-good fit",
      aliases: [/growth operations?/i, /commercial operations?/i, /strategy\s*(?:and|&)\s*growth operations?/i, /growth\s*(?:and|&)\s*strategy operations?/i],
      evidence: "The NexaHomes Growth Manager & Operations Associate role, competitor benchmarking, service-line choice inputs, lead-generation coordination and customer-to-delivery execution.",
      contribution: "Pipeline and activity visibility, commercial coordination, service-line tracking, lead-to-delivery handoffs and structured market feedback.",
      gaps: "Do not claim revenue ownership or proven growth impact. Build stronger CRM, funnel metrics, conversion analysis and quantified commercial case studies."
    },
    {
      key: "market-intelligence",
      title: "Market / Competitive Intelligence Associate",
      fit: "Good fit for an entry-level, research-led role",
      aliases: [/market intelligence/i, /competitive intelligence/i, /competitor analysis/i, /market research/i, /competitor benchmarking/i],
      evidence: "Hyderabad residential-market benchmarking, comparison of players including My Home Group and ASBL, and research that informed service-line choices and positioning.",
      contribution: "Competitor profiles, offer comparisons, market maps, customer-need synthesis, opportunity briefs and decision-ready research summaries.",
      gaps: "Strengthen market sizing, primary-research methodology, source triangulation, advanced Excel and presentation of quantified findings."
    },
    {
      key: "process-excellence",
      title: "Process Improvement / Operational Excellence Coordinator",
      fit: "Good adjacent fit",
      aliases: [/process improvement/i, /operational excellence/i, /business excellence/i, /continuous improvement/i, /process excellence/i],
      evidence: "Exposure to sales-to-delivery handoffs, vendor coordination, request follow-through, manual coordination gaps and proposed process controls.",
      contribution: "Workflow mapping, handoff checklists, issue logs, root-cause questions, baseline reporting and controlled improvement pilots.",
      gaps: "The portfolio does not establish a measured transformation. Learn formal process-mapping and root-cause methods, then document one before-and-after result."
    },
    {
      key: "program-pmo",
      title: "Program Operations / Project Coordinator / PMO Coordinator",
      fit: "Good adjacent fit",
      aliases: [/program operations/i, /project coordinator/i, /\bpmo\b/i, /project management office/i, /program coordinator/i, /project operations/i],
      evidence: "Cross-functional customer, vendor, sales and delivery coordination, follow-up discipline and reporting context.",
      contribution: "Milestone trackers, meeting actions, dependency follow-up, status reporting, risk logs and coordination across owners.",
      gaps: "Formal PMO governance, project scheduling tools, budget tracking and enterprise-scale programme ownership need to be demonstrated or learned."
    },
    {
      key: "sales-operations",
      title: "Sales Operations / Sales Enablement Operations",
      fit: "Good adjacent fit",
      aliases: [/sales operations?/i, /sales enablement/i, /sales support operations/i],
      evidence: "Lead-generation coordination, customer requirement capture, offer alignment, booking-related customer context and sales-to-delivery handoffs.",
      contribution: "Lead and activity trackers, handoff completeness, sales documentation, pipeline hygiene and coordination between sales and delivery.",
      gaps: "CRM proficiency, funnel definitions, forecast accuracy and sales productivity analysis are not yet established."
    },
    {
      key: "customer-success",
      title: "Customer Success Operations / Implementation Coordination",
      fit: "Good adjacent fit",
      aliases: [/customer success/i, /implementation coordinator/i, /onboarding coordinator/i, /client success/i],
      evidence: "Customer-facing requirements, tailored offers, upgrade requests, post-sale coordination and vendor follow-through.",
      contribution: "Onboarding checklists, implementation status, customer issue coordination, renewal or service follow-up support and feedback synthesis.",
      gaps: "SaaS onboarding, retention metrics, product adoption analytics and customer-success platforms may require training."
    },
    {
      key: "product-operations",
      title: "Product Operations Associate",
      fit: "Selective adjacent / stretch fit",
      aliases: [/product operations?/i, /\bproduct ops\b/i],
      evidence: "Structured friction discovery, problem framing and ETHIC product research, together with customer and operational context.",
      contribution: "User-feedback synthesis, research coordination, issue triage, product documentation and cross-functional release or support coordination.",
      gaps: "No established product launch ownership, roadmap management, product analytics or software delivery record. Treat this as a transition role, not a proven specialism."
    },
    {
      key: "strategy-operations",
      title: "Strategy & Operations Associate",
      fit: "Selective stretch fit",
      aliases: [/strategy\s*(?:and|&)\s*operations?/i, /strategic operations?/i, /strategy associate/i],
      evidence: "Competitor benchmarking linked to service-line choices, business-model study at Mercedes-Benz, MBA research and practical operating context.",
      contribution: "Market and competitor synthesis, operating reviews, opportunity assessment, decision briefs and execution tracking.",
      gaps: "Formal strategy project ownership, financial modelling, quantified impact and executive-level presentation need more proof. Stronger when paired with real operations execution."
    },
    {
      key: "revenue-operations",
      title: "Revenue Operations (process and coordination focus)",
      fit: "Selective adjacent fit",
      aliases: [/revenue operations?/i, /\brevops\b/i],
      evidence: "Lead-generation coordination, client operations, market benchmarking and business reporting provide some transferable commercial context.",
      contribution: "CRM data hygiene, pipeline coordination, handoff reporting and cross-functional visibility after role-specific training.",
      gaps: "Revenue forecasting, CRM administration, attribution, funnel analytics and sales-finance alignment are not proven. This is not a finance role recommendation."
    }
  ];

  function getRoleMatches(question) {
    return ROLE_CATALOG.filter(function (role) {
      return role.aliases.some(function (pattern) { return pattern.test(question); });
    });
  }

  function roleQuestionAsked(question) {
    return /fit|suit|role|job|position|career|contribut|excel|hire|shortlist|match|compare|versus|\bvs\b|recommend|where.*work|what.*apply/i.test(question);
  }

  function formatRole(role) {
    return role.title + "\nFIT: " + role.fit + "\n\nEvidence: " + role.evidence +
      "\n\nWhere he could contribute: " + role.contribution +
      "\n\nWhat must be tested or developed: " + role.gaps;
  }

  function answerAllRoles() {
    var strongest = ROLE_CATALOG.filter(function (r) {
      return ["business-operations", "service-operations", "growth-commercial-operations"].indexOf(r.key) >= 0;
    });
    var adjacent = ROLE_CATALOG.filter(function (r) {
      return ["strategy-growth-operations", "market-intelligence", "process-excellence", "program-pmo", "sales-operations", "customer-success"].indexOf(r.key) >= 0;
    });
    var stretch = ROLE_CATALOG.filter(function (r) {
      return ["product-operations", "strategy-operations", "revenue-operations"].indexOf(r.key) >= 0;
    });
    function group(title, items) {
      return title + "\n" + items.map(function (r) {
        return "• " + r.title + " — " + r.fit + ". " + r.evidence;
      }).join("\n\n");
    }
    return "MANRA 231999 — OVERALL ROLE-FIT MAP\n\n" +
      "The most credible positioning is an operations-minded business generalist: customer and service operations, commercial coordination, market intelligence and practical reporting. This is a better-supported story than presenting Manoj as an advanced data specialist.\n\n" +
      group("PRIORITY 1 — STRONGEST CURRENT ALIGNMENT", strongest) + "\n\n" +
      group("PRIORITY 2 — GOOD ADJACENT OPTIONS", adjacent) + "\n\n" +
      group("PRIORITY 3 — SELECTIVE TRANSITION / STRETCH OPTIONS", stretch) + "\n\n" +
      "ROLES NOT TO LEAD WITH\n" +
      "Advanced Data Analyst / Data Scientist / Data Engineer, specialist SQL or BI developer, Financial Analyst / Accounting, and pure Digital Marketing or Recruitment are not supported by the current evidence or the stated role direction. An HR MBA specialisation should not force the search into HR roles.\n\n" +
      "RECOMMENDATION\n" +
      "Prioritise Business Operations, Service/Customer Operations, Growth/Commercial Operations and Operations Coordination. Keep Market Intelligence and Strategy & Operations as targeted adjacent paths. The final decision must be checked against each employer's job description, technical thresholds and experience requirements.";
  }

  function answerRoleComparison(roles) {
    var first = roles[0];
    var second = roles[1];
    return "MANRA 231999 — ROLE COMPARISON\n\n" +
      formatRole(first) + "\n\n" +
      "────────────────────────\n\n" +
      formatRole(second) + "\n\n" +
      "MANRA'S COMPARATIVE JUDGEMENT\n" +
      "The stronger current fit is " + first.title + " because its evidence is more directly represented in Manoj's documented work. " +
      second.title + " is " + (second.fit.toLowerCase().indexOf("stretch") >= 0 ? "a more selective transition" : "also credible, but more dependent on the exact job scope") +
      ". For the second path, he should prepare one concrete case that proves the missing capability rather than relying on the title or MBA alone.";
  }

  function answerEducationAndCredentials(question) {
    var q = question.toLowerCase();
    if (/certificate|certification|credential|ibm agile|design thinking|forage|forge|claude/.test(q)) {
      return "EDUCATION, CREDENTIALS & LEARNING EVIDENCE\n\n" +
        "• IBM SkillsBuild — Enterprise Design Thinking Practitioner.\n" +
        "• IBM SkillsBuild — Agile Explorer.\n" +
        "• BCG Strategy Consulting Job Simulation through Forage — a virtual job simulation, not employment with BCG.\n" +
        "• Mercedes-Benz Silver Star — Management Trainee Internship, July–September 2022.\n" +
        "• Tata Motors — Organisational Structure Training Programme, April–May 2021.\n" +
        "• My Choices Foundation — Social Concern Project / Impact Internship.\n" +
        "• CHRIST (Deemed to be University) — Academic Excellence Award for Outstanding Research associated with the MBA thesis.\n\n" +
        "Credentials indicate learning and exposure; they should not be represented as professional employment or advanced technical certification unless the certificate explicitly says so.";
    }
    return "EDUCATION\n\n" +
      "• MBA, Human Resource Management — CHRIST (Deemed to be University), Pune Lavasa Campus; aggregate 60.2% (CGPA 6.23). Thesis: Forecasting Employee Turnover in the Bangalore IT Industry: An Analysis of Engagement, Growth, and Culture.\n" +
      "• B.Com — Computers, St. Joseph’s College, Kurnool; 58%.\n" +
      "• Intermediate — MEC; approximately 68%.\n" +
      "• SSC — 88%.\n\n" +
      "The MBA specialisation is a qualification, not a reason to position him only for HR. His preferred professional direction is business operations, commercial operations, market intelligence and execution-focused strategy roles.";
  }

  function answerCapabilityOverview() {
    return "MANRA 231999 — PROFESSIONAL CAPABILITY ASSESSMENT\n\n" +
      profile.positioning + "\n\n" +
      "1. CUSTOMER & SERVICE OPERATIONS\n" + profile.strengths[0][1] + "\n\n" +
      "2. COMMERCIAL & MARKET INTELLIGENCE\n" + profile.strengths[1][1] + "\n\n" +
      "3. PROCESS COORDINATION\n" + profile.strengths[2][1] + "\n\n" +
      "4. REPORTING & DECISION SUPPORT\n" + profile.strengths[3][1] + "\n\n" +
      "5. RESEARCH & PROBLEM STRUCTURING\n" + profile.strengths[4][1] + "\n\n" +
      "6. CROSS-FUNCTIONAL EXECUTION\n" + profile.strengths[5][1] + "\n\n" +
      "The strongest differentiator is the combination of customer-facing operations, market comparison and reporting discipline. The evidence supports potential and transferable capability; it does not prove unmeasured revenue, savings, efficiency or formal team-leadership outcomes.";
  }

  function makeLocalAnswer(question) {
    var q = question.toLowerCase();

    if (/\bibm\b|management trainee|business operations trainee|ibm.*operations|operations.*ibm/.test(q)) {
      return answerIbmRole();
    }

    if (q.indexOf("ethic") >= 0 || q.indexOf("behavior engineering") >= 0 || q.indexOf("behaviour engineering") >= 0 || q.indexOf("friction discovery") >= 0 || q.indexOf("f1-f11") >= 0 || q.indexOf("p1") >= 0 && q.indexOf("p2") >= 0) {
      return "ETHIC × MANRA — PROJECT INTELLIGENCE\\n\\n" +
        "ETHIC is the company concept. MANRA is its strategic-intelligence and discovery system. ETHIC is being developed around Behavior Engineering: begin with the task a person is trying to complete, identify recurring resistance and workarounds, examine existing solutions, then decide whether a better intervention is justified.\\n\\n" +
        "DISCOVERY LOGIC\\n1. Observe recurring friction in a real context.\\n2. Record the workaround people already use.\\n3. Separate direct observation from hypothesis.\\n4. Compare existing products, prior art and alternative explanations.\\n5. Test physical or technological feasibility, user value and commercial credibility.\\n\\n" +
        "TAXONOMY\\nF1–F4: micro-friction families. F5: a human-friction / technology bridge. F6–F11: technology-led and wider workflow frictions. These are categories for investigation, not proof that a product opportunity is validated.\\n\\n" +
        "EVIDENCE DISCIPLINE\\nObserved, Hypothesis and Verified claims remain separate. P1 is not cleared / unclaimed. P2 is unclaimed. The ₹11,500–₹12,500 prototype envelope is a planning target, not secured spend. Commercial validation, patentability, market demand and scale are not established.\\n\\n" +
        "VM-PRIME is a separate manual-access workspace. MANRA can explain public ETHIC information but will not open or grant VM-PRIME access automatically.";
    }

    if (/compare|versus|\bvs\b|which is better|better fit|difference between/i.test(q)) {
      var comparedRoles = getRoleMatches(question);
      if (comparedRoles.length >= 2) return answerRoleComparison(comparedRoles.slice(0, 2));
    }

    if (/which roles|what roles|roles.*fit|fit.*overall|career options|overall.*career|where can he fit|role map|roles can he apply/i.test(q)) {
      return answerAllRoles();
    }

    var detectedRoles = getRoleMatches(question);
    if (detectedRoles.length && roleQuestionAsked(question)) {
      return detectedRoles.length > 1
        ? answerRoleComparison(detectedRoles.slice(0, 2))
        : formatRole(detectedRoles[0]) + "\n\n" +
          "Can he excel? There is a credible basis to pursue this role, but performance depends on learning speed, execution quality, manager expectations and the specific job description. The evidence is a reason to interview and test—not a guarantee of success.";
    }

    if (/data analyst|business analyst|data scientist|data engineer|financial analyst|accountant|accounting|recruiter|recruitment|digital marketing/i.test(q)) {
      return "This is not where MANRA would position Manoj first. The current evidence is stronger in business and service operations, commercial coordination, market intelligence and execution support. The profile does not establish specialist data engineering, advanced analytics, core accounting/finance or recruitment expertise. The MBA HR specialisation is a qualification; it does not require him to pursue HR roles.";
    }

    if (/certificate|certification|credential|education|qualification|academic|degree|college|university|thesis|marks|percentage|cgpa/i.test(q)) {
      return answerEducationAndCredentials(question);
    }

    if (/overall.*capabilit|full.*profile|complete.*profile|professional.*strength|what can he do|what is he capable|capability overview|strongest capabilities/i.test(q)) {
      return answerCapabilityOverview();
    }

    if (/weakness|gap|improv|develop|risk|limitation|not good|missing|shortcoming/.test(q)) {
      return "A balanced assessment of Manoj's development areas:\n\n" + profile.development +
        "\n\nA hiring manager should also validate his ability to prioritise under pressure, communicate concise updates, handle ambiguous requests and present a clear recommendation. These are interview tests—not weaknesses that can be concluded without speaking to him. His public evidence does not establish formal team leadership or quantified process impact.";
    }

    if (/technical|excel|power.?bi|tableau|sql|software|tool/.test(q)) {
      return "MANRA'S SKILL READOUT\n\n" + profile.tools +
        "\n\nBest application: operational trackers, MIS, basic reporting, data checks, dashboard interpretation and structured business updates. Development focus: Excel modelling, Power BI data modelling and visual storytelling, and SQL fundamentals. Do not market him as a data scientist, data engineer or advanced BI developer.";
    }

    if (/leadership|leader|manage people|team management|teamwork|collaborat|stakeholder/.test(q)) {
      return "Manoj's documented work supports a coordination and stakeholder-follow-through narrative. At NexaHomes, the described work connected customers, vendors, sales and delivery activity, including handoffs and post-sale requests. That is relevant to collaborative execution.\n\nWhat the evidence does not yet prove is formal people management, direct-report responsibility, team-size leadership or ownership of a large transformation. A fair assessment is that he has practical coordination exposure and should be tested for leadership potential through examples of influencing, resolving disagreement and taking accountability.";
    }

    if (/differentiat|unique|stand out|typical candidate|strength|talent|best at|best contribute|capabilit|ability|what is he good/.test(q)) {
      return "MANRA'S ASSESSMENT\n\n" + profile.positioning + "\n\n" +
        profile.strengths.map(function (item, index) {
          return (index + 1) + ". " + item[0] + " — " + item[1];
        }).join("\n\n") +
        "\n\nThe differentiator is the combination of customer-facing operating context, commercial research and practical reporting. That combination is more credible than presenting him as a specialist in one advanced technical tool.";
    }

    if (/where|contribut|role fit|role|position|team|hire|value|business|career|suitable|fit/.test(q)) {
      return "The strongest near-term role fit is in execution-oriented work where structured thinking supports day-to-day operations.\n\n" +
        profile.roles.map(function (item) { return "• " + item; }).join("\n") +
        "\n\nWHY THE FIT IS CREDIBLE\n" + profile.strengths.slice(0, 4).map(function (item) {
          return "• " + item[0] + ": " + item[1];
        }).join("\n\n") +
        "\n\nThe actual job description matters. Roles requiring advanced coding, deep financial ownership or specialist data engineering would not match his current evidence as closely.";
    }

    if (/experience|proof|evidence|credential|background|track record|example|worked|internship|education|qualification/.test(q)) {
      return "The portfolio's clearest evidence points are:\n\n" + formatEvidence() +
        "\n\nEvidence discipline: scope is not the same as measured impact. The 100+ client portfolio establishes operating scope; it does not prove a revenue increase, cost saving or service improvement. Ask Manoj to explain the context, his exact responsibility, the output and any verified result.";
    }

    if (/resume|cv|summary|introduc|pitch|elevator|tell me about/.test(q)) {
      return "A concise professional introduction:\n\n“V. Sai Manoj is a business-operations professional who connects customer and market signals with structured research, operational reporting and practical execution. His experience includes customer and service coordination across a 100+ residential-client portfolio at NexaHomes, competitor benchmarking, a Mercedes-Benz retail-model study and MBA research. He is best suited to roles where teams need organised execution, clearer operating visibility and evidence-led decisions.”\n\nThis is a positioning summary, not a claim of advanced technical expertise or unverified financial impact.";
    }

    if (/90 day|first 90|first month|first 30|onboard|joining|start at|new role/.test(q)) {
      return "A practical first-90-day plan for Manoj in a Business Operations team:\n\nDAYS 1–30 — LEARN THE OPERATING SYSTEM\nUnderstand the service or business model, key stakeholders, recurring workflows, definitions of core metrics, reporting calendar, escalation paths and quality checks. Shadow the people doing the work before proposing changes.\n\nDAYS 31–60 — BUILD VISIBILITY\nTake ownership of a defined tracker or recurring report. Validate data, identify repeat exceptions, document a handoff or workflow and confirm observations with the process owner.\n\nDAYS 61–90 — IMPROVE ONE CONTROLLED STEP\nRecommend one small improvement, agree a baseline and success measure, run a limited pilot with the owner's approval, document the result and present what should happen next.\n\nThe discipline is to understand first, measure second and change only with evidence.";
    }

    if (/salary|package|ctc|lpa|pay/.test(q)) {
      return "Salary depends on the exact job level, location, employer band and interview performance. Manoj's previously stated target range is an aspiration, not evidence of market value or a guaranteed outcome. The better approach is to evaluate the IBM role's actual scope, eligibility, compensation band and learning runway before negotiating.";
    }

    if (/communicat|present|english|speak|articulat/.test(q)) {
      return "The portfolio gives evidence of business research, reporting and cross-functional coordination, but it does not objectively measure spoken English, executive presence or presentation quality. Those should be validated directly. A strong interview test would ask Manoj to explain one work example in two minutes: the business problem, his role, the action, the evidence and the outcome—without overstating the impact.";
    }

    if (/problem solv|ambigu|decision|judgement|analys|think/.test(q)) {
      return "The strongest evidence of Manoj's problem-structuring approach is the connection between competitor benchmarking and service-line choices, plus his work with customer requirements, service handoffs and reporting. His MBA research adds experience framing a question and examining multiple factors.\n\nA fair test is to give him an unfamiliar operating problem and assess whether he clarifies the objective, separates facts from assumptions, identifies the root issue, prioritises options and recommends a measurable next step.";
    }

    if (/personality|character|work ethic|attitude|reliable|ownership|integrity|adapt/.test(q)) {
      return "I can describe the professional behaviours suggested by the work evidence, but I cannot certify private character traits from a portfolio alone. The documented work suggests comfort with customer context, structured research, coordination and follow-through. Reliability, integrity, resilience and adaptability should be validated through specific examples, references and a practical work exercise—not claimed as facts without evidence.";
    }

    if (/achievement|impact|result|success|accomplish|outcome/.test(q)) {
      return "The strongest documented achievement is the scope of work across a 100+ residential-client portfolio at NexaHomes, alongside competitor research, customer/service coordination and reporting deliverables. The portfolio deliberately does not claim unverified revenue, margin, savings, cycle-time or satisfaction improvements. To strengthen the achievement story, Manoj should add dated, verifiable before-and-after measures where company records permit.";
    }

    if (/why.*ibm|why this company|why should we choose|why hire|why select/.test(q)) {
      return "A credible reason for IBM is the opportunity to learn how a large, complex organisation manages processes, service delivery, reporting and cross-functional execution. Manoj can bring customer-operations context, structured research, coordination and a practical reporting foundation. He should be candid about the areas he is developing—especially advanced Excel and deeper analytics—and show how he learns through a concrete example.";
    }

    if (/hello|hi\b|who are you|what can you do|help me/.test(q)) {
      return "Hello. I am MANRA 231999, Manoj's portfolio-grounded capability intelligence assistant. I can assess his strengths, evidence, experience, tools, development areas, role alignment, interview positioning and likely contribution. I distinguish documented facts from reasonable inferences and never invent performance results.";
    }

    return "I can assess questions about V. Sai Manoj's professional capabilities, strengths, experience, work evidence, education, tools, development areas, working style, role fit, interview positioning and potential contribution. I also have a detailed assessment for an IBM Management Trainee role in Business Operations.\n\nFor an accurate answer, ask the question in the context of Manoj's profile—for example: “Could he excel in business operations?”, “What evidence supports his process-improvement ability?” or “What would he need to prove in an IBM interview?”\n\n" +
      profile.positioning + "\n\nThis website is currently in portfolio-grounded mode. Open-ended responses to any subject require the secure AI service to be configured; the public page does not expose an API key.";
  }

  function speak(text, after) {
    if (!speechSynthesis || !window.SpeechSynthesisUtterance) {
      if (after) after();
      return;
    }
    speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.96;
    utterance.pitch = 1.0;
    var voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
    var voice = voices.find(function (item) { return /^en-IN$/i.test(item.lang); }) ||
      voices.find(function (item) { return /^en-GB$/i.test(item.lang); }) ||
      voices.find(function (item) { return /^en/i.test(item.lang); });
    if (voice) utterance.voice = voice;
    utterance.onstart = function () {
      setVisualState("speaking", "MANRA is responding", "Speaking your answer. You can stop the voice session at any time.");
    };
    utterance.onend = function () {
      if (after) after();
    };
    utterance.onerror = function () {
      if (after) after();
    };
    speechSynthesis.speak(utterance);
  }

  function startListening() {
    if (!voiceSession || !recognition) return;
    pendingVoiceQuestion = "";
    try {
      recognition.start();
    } catch (error) {
      setStatus("The microphone is not ready. Select Start voice conversation to try again.");
      setVisualState("idle", "Voice session paused", "The microphone could not be restarted.");
    }
  }

  function stopVoiceSession() {
    voiceSession = false;
    pendingVoiceQuestion = "";
    listening = false;
    if (recognition) {
      try { recognition.stop(); } catch (error) {}
    }
    if (speechSynthesis) speechSynthesis.cancel();
    setMicMode(false);
    setVisualState("idle", "MANRA is ready", "Ask a question by voice or type it below.");
    setStatus(recognition ? "Voice session stopped. You can restart it whenever you are ready." : "Voice input is not supported in this browser.");
  }

  function startVoiceSession() {
    if (voiceSession) {
      stopVoiceSession();
      return;
    }
    voiceSession = true;
    setMicMode(true);
    setVisualState("speaking", "MANRA is greeting you", "Opening the voice session.");
    setStatus("Starting voice session…");
    speak(GREETING, function () {
      if (!voiceSession) return;
      if (!recognition) {
        voiceSession = false;
        setMicMode(false);
        setStatus("This browser cannot listen for speech. Use a supported browser or type your question.");
        setVisualState("idle", "Voice input unavailable", "The greeting was played, but speech recognition is not supported here.");
        return;
      }
      setVisualState("listening", "MANRA is listening", "Ask your question naturally. MANRA will respond and then listen for the next question.");
      setStatus("Listening for your question…");
      startListening();
    });
  }

  function finishLocalAnswer(options, reply) {
    addMessage(reply, "assistant");
    if (options.speak && voiceSession) {
      speak(reply, function () {
        if (!voiceSession) return;
        setVisualState("listening", "MANRA is listening", "Go ahead with your next question.");
        setStatus("Listening for your next question…");
        startListening();
      });
    } else {
      setVisualState("idle", "MANRA is ready", "Ask another question or start a voice conversation.");
    }
  }

  function handleNavigationIntent(question, options) {
    var q = question.toLowerCase();
    var openWords = ["open", "show", "take me to", "go to", "navigate to", "launch", "visit"];
    var wantsPortfolio = q.indexOf("portfolio") >= 0 || q.indexOf("personal site") >= 0;
    var requestsOpen = openWords.some(function (word) { return q.indexOf(word) >= 0; });
    if (requestsOpen && wantsPortfolio) {
      var onMainPortfolio = window.location.hostname === "manoj5520.github.io" &&
        window.location.pathname.toLowerCase().indexOf("/ethic-manra/") !== 0;
      if (onMainPortfolio) {
        finishLocalAnswer(options, "You are already viewing Manoj’s personal portfolio. I can take you to its home section.");
        if (q.indexOf("home") >= 0 || q.indexOf("top") >= 0) window.location.href = "https://manoj5520.github.io/#top";
      } else {
        addMessage("Opening V. Sai Manoj’s personal portfolio now.", "assistant");
        window.location.assign("https://manoj5520.github.io/");
      }
      return true;
    }
    if (q.indexOf("vm-prime") >= 0 || q.indexOf("vm prime") >= 0 || q.indexOf("vmprime") >= 0) {
      finishLocalAnswer(options, "VM-PRIME is deliberately handled as a manual project-access hand-off. MANRA will not automatically open, reveal or grant access to that workspace. Please request access directly from Manoj through the personal portfolio contact section: https://manoj5520.github.io/#contact. Public portfolio and ETHIC information can be handled here.");
      return true;
    }
    return false;
  }

  async function answer(question, options) {
    options = options || {};
    if (handleNavigationIntent(question, options)) return;
    setVisualState("thinking", "MANRA is considering the evidence", "Separating documented facts, reasonable inferences and development areas.");
    var thinking = addMessage("Reviewing the question against Manoj's portfolio evidence…", "assistant");
    var reply = "";
    try {
      if (window.MANRA_API_ENDPOINT && /^https:\/\//i.test(window.MANRA_API_ENDPOINT)) {
        var response = await fetch(window.MANRA_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question, profile_context: profile, history: conversationHistory.slice(-12), page_context: window.location.hostname })
        });
        if (!response.ok) throw new Error("The secure assistant service is unavailable.");
        var data = await response.json();
        reply = data.answer || "I couldn't prepare an answer for that question.";
      } else {
        reply = makeLocalAnswer(question);
      }
    } catch (error) {
      reply = makeLocalAnswer(question) + "\n\nThe live AI connection is currently unavailable, so this response uses the portfolio-grounded assessment.";
    }
    conversationHistory.push({ role: "assistant", content: reply });
    conversationHistory = conversationHistory.slice(-16);
    thinking.querySelector("p").textContent = reply;
    thread.scrollTop = thread.scrollHeight;

    if (options.speak && voiceSession) {
      speak(reply, function () {
        if (!voiceSession) return;
        setVisualState("listening", "MANRA is listening", "Go ahead with your next question.");
        setStatus("Listening for your next question…");
        startListening();
      });
    } else {
      setVisualState("idle", "MANRA is ready", "Ask another question or start a voice conversation.");
      setStatus(window.MANRA_API_ENDPOINT ? "AI service configured · portfolio context enabled" : "Portfolio-grounded mode · secure AI service not connected");
    }
  }

  function submitQuestion(question, options) {
    question = (question || "").trim();
    if (!question) return;
    addMessage(question, "user");
    conversationHistory.push({ role: "user", content: question });
    conversationHistory = conversationHistory.slice(-16);
    input.value = "";
    answer(question, options || {});
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitQuestion(input.value, { speak: voiceSession });
    });
  }

  document.querySelectorAll("[data-manra-prompt]").forEach(function (button) {
    button.addEventListener("click", function () {
      var question = button.getAttribute("data-manra-prompt");
      input.value = question;
      submitQuestion(question, { speak: voiceSession });
    });
  });

  if (recognition) {
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = function () {
      listening = true;
      setVisualState("listening", "MANRA is listening", "Speak naturally. Your question will be processed when you finish.");
      setStatus("Listening…");
    };
    recognition.onresult = function (event) {
      var finalText = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      }
      if (finalText.trim()) pendingVoiceQuestion = (pendingVoiceQuestion + " " + finalText).trim();
    };
    recognition.onerror = function (event) {
      listening = false;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        voiceSession = false;
        setMicMode(false);
        setStatus("Allow microphone access in your browser settings, then start voice again.");
        setVisualState("idle", "Microphone permission needed", "Your browser must allow microphone access.");
      } else if (event.error === "no-speech") {
        setStatus("I didn't hear a question. Please try again.");
        if (voiceSession) {
          setVisualState("listening", "MANRA is listening", "Please ask your question again.");
          window.setTimeout(startListening, 350);
        }
      } else {
        setStatus("Voice input stopped. You can restart the session or type instead.");
        setVisualState("idle", "Voice session paused", "Check your microphone and browser permissions.");
      }
    };
    recognition.onend = function () {
      listening = false;
      if (!voiceSession) return;
      if (pendingVoiceQuestion.trim()) {
        var captured = pendingVoiceQuestion.trim();
        pendingVoiceQuestion = "";
        submitQuestion(captured, { speak: true });
      } else if (visual && visual.getAttribute("data-state") === "listening") {
        setStatus("Listening ended. Start voice again or type your question.");
      }
    };
  }

  if (mic) mic.addEventListener("click", startVoiceSession);

  setVisualState("idle", "MANRA is ready", "Ask about Manoj's strengths, evidence, capabilities or role fit.");
  setStatus(recognition ? "Voice input available · profile-grounded mode · live AI service not connected" : "Voice input requires a supported browser. You can type your question.");
  if (!speechSynthesis) {
    setStatus("Speech output is unavailable in this browser. Typed answers remain available.");
  }
})();