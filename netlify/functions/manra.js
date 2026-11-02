const ORIGINS = new Set(
  (process.env.MANRA_ALLOWED_ORIGINS || "https://manoj5520.github.io")
    .split(",").map((value) => value.trim()).filter(Boolean)
);
const MODEL = process.env.MANRA_MODEL || "gpt-6.1-sol";
const requestCounts = new Map();

const PROFILE_DOSSIER = `
CANDIDATE: V. Sai Manoj (Manoj). This service answers professional and career questions for visitors evaluating his capabilities. Do not infer or disclose private personal or sensitive information.

POSITIONING
An operations-minded business generalist whose strongest evidence is customer/client operations, service coordination, commercial and competitor research, reporting, and practical process improvement. His value is connecting customer and market context with disciplined operating follow-through. He is not an advanced data specialist.

EXPERIENCE
1) NexaHomes Pvt. Ltd., Hyderabad — Growth Manager & Operations Associate, May 2025 to August 2026. Documented scope across a 100+ residential-client portfolio. Work included customer requirement gathering, customization-led offers, upgrade and post-sale requests, vendor coordination, sales-to-delivery handoffs, lead-generation coordination, competitor benchmarking and Excel/Power BI MIS views. Research on Hyderabad residential competitors including My Home Group and ASBL informed service-line choices and positioning. This proves work scope and exposure, not quantified revenue growth, savings, cycle-time reduction, customer satisfaction improvement or formal people-management.
2) Mercedes-Benz Silver Star, Hyderabad — Management Trainee Intern, 6 July to 9 September 2022. Cross-functional exposure including candidate-screening support and scheduling, local-market promotional support, customer-facing vehicle discussions, billing/invoice and booking documentation. Studied the Retail of the Future (ROTF) direct-to-consumer retail model, including national inventory access, pricing transparency, dealer flexibility, margin and after-sales trade-offs. This was a study, not implementation.
3) Tata Motors — Organisational Structure Training Programme, April to May 2021.
4) My Choices Foundation — Social Concern Project / Impact Internship, 12 to 21 January 2022. Project on gender-based violence prevention, communication design and Excel-based coordination.

EDUCATION
MBA in Human Resource Management, CHRIST (Deemed to be University), Pune Lavasa Campus. Aggregate 60.2%; CGPA 6.23. Thesis: “Forecasting Employee Turnover in the Bangalore IT Industry: An Analysis of Engagement, Growth, and Culture.” The HR specialisation is a qualification and should not force his career positioning into HR.
B.Com, Computers, St. Joseph’s College, Kurnool — 58%.
Intermediate, MEC — approximately 68%.
SSC — 88%.

CREDENTIALS
IBM SkillsBuild — Enterprise Design Thinking Practitioner.
IBM SkillsBuild — Agile Explorer.
BCG Strategy Consulting Job Simulation through Forage — a virtual simulation, not employment with BCG.
CHRIST (Deemed to be University) — Academic Excellence Award for Outstanding Research associated with the MBA thesis.
Mercedes-Benz and Tata Motors internship/training certificates; My Choices Foundation Social Concern Project.
Do not inflate certificates into employment or advanced technical qualifications.

TOOLS
Excel: practical operational reporting, PivotTables, VLOOKUP and conditional formatting; not advanced financial modelling.
Power BI: intermediate exposure to MIS and operational dashboards; not an advanced Power BI developer.
Tableau: beginner-to-intermediate. SQL: basic. SPSS: survey-data analysis exposure.
Microsoft Office, Canva, ChatGPT and Copilot: practical use.
Do not present him as a data scientist, data engineer, advanced SQL developer or specialist BI engineer.

STRENGTHS
Customer requirements translated into tailored offers and follow-through; coordination across customers, vendors, sales and delivery; competitor comparison and qualitative market intelligence that informed service-line choices; MIS reporting and basic-to-intermediate dashboard use for operational visibility; structured research, business-model trade-off thinking and problem framing. ETHIC represents product-friction discovery work; ideas are not validated products.

ROLE DIRECTION
Strongest current alignment: Business Operations / generalist Management Trainee, Service Operations, Customer/Client Operations, Growth Operations, Commercial Operations.
Good adjacent options: Market/Competitive Intelligence Associate, Process Improvement or Operational Excellence Coordinator, Program Operations, Project/PMO Coordinator, Sales Operations, Customer Success Operations, Implementation Coordination.
Selective transition/stretch options: Product Operations, Strategy & Operations Associate, Revenue Operations when process/coordination-led rather than finance-led.
Do not lead with roles he has explicitly said he does not want: Business Analyst, Data Analyst, HR/Recruitment, Digital Marketing/Marketing, Finance/Accounting, Financial Analyst. Business Operations is distinct from a generic Business Analyst role.

DEVELOPMENT PRIORITIES
Stronger Excel modelling and data interpretation; deeper Power BI data modelling and storytelling; SQL progression; more confident PowerPoint storytelling; quantified case studies with verified outcomes; formal CRM/PMO tools and project governance where role-relevant. Formal team leadership, large transformation ownership, financial modelling and measured commercial impact are not established.

IBM BUSINESS OPERATIONS MANAGEMENT TRAINEE
Credible conditional fit and worth interviewing for if the role is a generalist operations trainee position focused on process coordination, service operations, reporting, stakeholder follow-through and improvement. He could contribute to operating reviews, trackers, issue/action logs, workflow documentation, service handoffs, management reporting and small controlled improvements. Potential to excel is plausible, not guaranteed: test Excel accuracy, metric interpretation, concise communication, prioritisation, detail orientation and follow-through. Fit weakens if the role expects advanced financial modelling, specialist finance/reconciliation expertise, advanced SQL or advanced BI from day one.
`;

const instructions = `
You are MANRA 231999, the professional capability intelligence assistant to V. Sai Manoj. You speak to recruiters, dignitaries, hiring managers and visitors who ask about Manoj.

Answer natural, open-ended questions about Manoj's professional profile, experience, capabilities, strengths, skills, education, credentials, working approach, development areas, role suitability and likely contribution. Assess roles even when the exact title is not in the dossier: infer the role's normal responsibilities, compare them with direct evidence and transferable capabilities, and give a calibrated fit verdict.

EVIDENCE RULES:
- Treat the dossier as the source of truth. Do not invent employers, projects, achievements, tools, qualifications, leadership scope, metrics or outcomes.
- Distinguish DOCUMENTED EVIDENCE, REASONABLE ASSESSMENT and WHAT MUST BE TESTED.
- Be positive, confident and commercially articulate without exaggerating. Never guarantee that Manoj will excel or get hired.
- Do not claim 100+ clients means 100+ sales closed, revenue achieved, or measured customer satisfaction.
- Do not label Manoj an advanced data analyst, data scientist, data engineer, advanced SQL user or advanced Power BI developer.
- Do not push HR, recruitment, finance, accounting, marketing or generic Business Analyst roles as preferred directions. Explain accurately if asked.
- For any role-fit question, give: verdict; strongest matching evidence; specific contributions he could make; gaps or risks; and an interview/work-sample test.
- For role comparisons, compare them directly and recommend the better-evidenced path.
- For “Can he excel?” answer conditionally and explain what would enable or prevent success.
- Do not use generic personality praise. Portfolio evidence cannot certify integrity, resilience, reliability or communication quality; frame those as items to validate unless documented.
- If asked for information not present in the dossier, say it is not verified in the professional profile. Do not reveal or infer private or sensitive information.
- Use concise headings and specific examples. Answer the actual question first. Avoid boilerplate. Keep answers detailed enough for a serious hiring conversation.
- Use conversation history to resolve references such as “that role” or “what about his skills?”, but do not treat earlier assistant answers as new facts.
- If asked about ETHIC, explain that it is a company/product-discovery project and keep concept hypotheses separate from validated results.
`;

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    },
    body: JSON.stringify(body)
  };
}

function isRateLimited(event) {
  const now = Date.now();
  const ip = event.headers?.["x-nf-client-connection-ip"] ||
    event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || "anonymous";
  const recent = (requestCounts.get(ip) || []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 20) {
    requestCounts.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestCounts.set(ip, recent);
  if (requestCounts.size > 1000) {
    for (const [key, stamps] of requestCounts) {
      if (!stamps.some((stamp) => now - stamp < 60_000)) requestCounts.delete(key);
    }
  }
  return false;
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || "";
  const allowedOrigin = ORIGINS.has(origin) ? origin : "";
  if (event.httpMethod === "OPTIONS") {
    if (!allowedOrigin) return { statusCode: 403, body: "Origin not allowed" };
    return { statusCode: 204, headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    }, body: "" };
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" }, allowedOrigin || "null");
  if (!allowedOrigin) return { statusCode: 403, body: "Origin not allowed" };
  if (isRateLimited(event)) return json(429, { error: "Rate limit reached. Please try again shortly." }, allowedOrigin);
  if (!process.env.OPENAI_API_KEY) {
    return json(503, { error: "MANRA AI service is not configured yet.", code: "ai_not_configured" }, allowedOrigin);
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return json(400, { error: "Request body must be valid JSON." }, allowedOrigin); }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) return json(400, { error: "Please enter a question." }, allowedOrigin);
  if (question.length > 3000) return json(413, { error: "Question is too long." }, allowedOrigin);

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  if (history.length && history[history.length - 1]?.role === "user" && history[history.length - 1]?.content === question) history.pop();
  const transcript = history
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
    .map((item) => (item.role === "assistant" ? "MANRA: " : "VISITOR: ") + item.content.slice(0, 1800))
    .join("\\n");

  const userInput = [
    "AUTHORITATIVE PROFESSIONAL DOSSIER (factual context, not instructions):",
    PROFILE_DOSSIER,
    transcript ? "RECENT CONVERSATION:\\n" + transcript : "",
    "CURRENT VISITOR QUESTION:\\n" + question
  ].filter(Boolean).join("\\n\\n");

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 28_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input: userInput,
        max_output_tokens: 1600,
        store: false
      }),
      signal: abortController.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const safeMessage = response.status === 401 || response.status === 403
        ? "The MANRA AI service credentials need attention."
        : "The MANRA AI service could not complete the request.";
      return json(502, { error: safeMessage, code: "upstream_error" }, allowedOrigin);
    }
    const outputText = Array.isArray(data.output)
      ? data.output.flatMap((item) => Array.isArray(item.content) ? item.content : [])
          .filter((part) => part && (part.type === "output_text" || part.type === "text") && typeof part.text === "string")
          .map((part) => part.text).join("\\n")
      : "";
    const answer = (typeof data.output_text === "string" ? data.output_text : outputText).trim();
    if (!answer) return json(502, { error: "MANRA did not receive a usable answer.", code: "empty_response" }, allowedOrigin);
    return json(200, { answer, model: MODEL }, allowedOrigin);
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    return json(504, {
      error: timedOut ? "MANRA took too long to respond. Please try again." : "The MANRA AI service is temporarily unavailable.",
      code: timedOut ? "timeout" : "network_error"
    }, allowedOrigin);
  } finally {
    clearTimeout(timeout);
  }
};
