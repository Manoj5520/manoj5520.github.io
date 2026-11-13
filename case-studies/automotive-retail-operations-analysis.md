# Automotive Retail Operations
## From Customer Journey to Measurable Improvement

**Portfolio case study · Independent analytical demonstration · Automotive retail**

**Author:** V. Sai Manoj  
**Domain context:** Premium automotive dealership operations  
**Status:** Illustrative analysis design — not a completed dealership transformation

---

## 1. Business question

How can a premium automotive retailer identify and reduce avoidable friction across the customer journey while protecting customer experience, commercial discipline and operational control?

This is the decision question for the case study. It is not a claim that a specific dealership has a confirmed performance problem.

## 2. Why this domain

During my Management Trainee Internship at Mercedes-Benz Silver Star (Raam Group), from 6 July to 9 September 2022, I had cross-functional exposure and contributed to a Retail of the Future (ROTF) Introduction Method study.

My portfolio records that study as reviewing:
- Inventory access
- Pricing transparency
- Dealer flexibility
- Customer-experience implications

The analysis below is independently developed to demonstrate how I would structure a Business Analyst assignment in automotive retail. It is not an official Mercedes-Benz project, does not use internal dealership data and is not endorsed by Mercedes-Benz or the dealer.

## 3. Business scope

**Illustrative journey to examine**

1. Enquiry and lead capture
2. First response and appointment
3. Consultation and vehicle requirement clarification
4. Vehicle discovery, configuration or test drive
5. Offer, pricing and availability discussion
6. Booking and order progression
7. Delivery preparation and handover
8. Post-delivery support and service handoff

The actual process, systems, role ownership and exceptions must be confirmed with the dealership before analysis.

## 4. Questions a Business Analyst should answer

| Business area | Questions to investigate | Evidence required |
|---|---|---|
| Lead management | Are enquiries assigned and followed up within the agreed service level? | Lead timestamps, owner, source, status and follow-up history |
| Customer requirements | Are customer needs captured once and visible to relevant teams? | Requirement records, CRM fields and handoff samples |
| Vehicle availability | Can teams give customers reliable availability information? | Inventory snapshots, reservation status and order records |
| Offer and pricing | Are quotations clear, consistent and appropriately approved? | Quote versions, approval rules and change reasons |
| Booking to delivery | Where does elapsed time accumulate? | Booking, order, allocation and delivery milestone dates |
| Handoffs | Does each transfer have a clear owner and next action? | Handoff records, open actions and exception logs |
| Post-delivery | Are unresolved issues visible and assigned? | Complaint/service records, ageing and resolution status |

These are investigation questions, not findings. The data must establish whether a gap exists and how material it is.

## 5. Analysis method

### A. Define the problem precisely

Avoid starting with “sales are low” or “customers are unhappy.”

First establish:
- Which customer segment, outlet and journey stage?
- What period is being examined?
- What outcome is below expectation?
- Compared with which baseline or target?
- Is the issue volume, conversion, delay, quality or customer effort?

### B. Map the current state

For each stage, document:
- Customer action and expectation
- Employee/team responsible
- System or information used
- Input required to proceed
- Handoff and approval
- Waiting time and rework
- Exception and escalation route

### C. Validate the cause

Use process records, stakeholder interviews and customer feedback together. Check whether an apparent delay is caused by missing information, approval dependencies, vehicle availability, unclear ownership or another factor.

Do not assume correlation proves root cause.

### D. Design the future state

Prioritise changes that are:
- Valuable to customers
- Feasible for dealership teams
- Consistent with commercial controls
- Measurable using available data
- Clear in ownership and implementation effort

## 6. Illustrative hypotheses to test

| Hypothesis | How to test it | Possible response if validated |
|---|---|---|
| Enquiries wait because ownership is unclear | Compare enquiry time, assignment time and first-response time | Defined lead owner and escalation rule |
| Customers repeat requirements across teams | Review handoff records and interview customers/staff | Standard customer-requirement record |
| Delivery expectations change during order progression | Compare promised and actual milestone dates with change reasons | Milestone visibility and exception communication |
| Open customer issues remain unresolved too long | Segment open issues by age, owner and blocker | Ageing review and escalation ownership |

These are hypotheses only. No root cause has been established without evidence.

## 7. Proposed KPI dictionary

The business must agree definitions, exclusions, targets and data owners before reporting.

| KPI | Proposed definition | Why it matters |
|---|---|---|
| First-response time | Time from valid enquiry receipt to first meaningful response | Responsiveness |
| Appointment conversion | Eligible enquiries resulting in appointments ÷ eligible enquiries | Lead progression |
| Test-drive-to-booking conversion | Bookings ÷ completed test drives in the agreed cohort | Customer and offer fit |
| Quote turnaround time | Time from complete requirement capture to quotation issue | Commercial responsiveness |
| Order-to-delivery cycle time | Elapsed time from agreed order milestone to vehicle handover | Fulfilment visibility |
| Milestone reliability | Milestones completed on or before the agreed date ÷ due milestones | Execution discipline |
| Handoff completeness | Transfers containing required information, owner and next action ÷ transfers sampled | Continuity |
| Issue ageing | Open customer issues grouped by age and accountable owner | Resolution control |

**Important:** A KPI is only useful when its numerator, denominator, event timestamps, exclusions, source system, refresh frequency and accountable owner are defined. Targets should follow baseline measurement, not be invented in advance.

## 8. Example business requirements

The following are proposed requirements for an illustrative improvement initiative.

**BR-01 — Lead ownership**  
The business should be able to identify the current owner, status and next action for each eligible enquiry.

**BR-02 — Customer requirement continuity**  
Relevant teams should be able to access the agreed customer requirements without repeatedly requesting the same information.

**BR-03 — Milestone visibility**  
Authorised users should be able to view key order and delivery milestones, due dates and exceptions.

**BR-04 — Issue accountability**  
Open customer issues should have an accountable owner, age, status and escalation path.

### Example user story

As a dealership sales manager, I want to see enquiries without a recorded next action so that I can review ownership gaps before they affect customer follow-up.

**Acceptance criteria**
- The view identifies eligible enquiries with no next action.
- Each record displays its current owner and latest status.
- Users can filter by age and owner.
- The report shows the data refresh timestamp.
- Excluded or incomplete records are clearly identified.

## 9. Proposed analytical workflow and tools

| Stage | Method/tool | Output |
|---|---|---|
| Understand | Stakeholder interviews and process walkthrough | Problem statement and scope |
| Structure | Excel and process mapping | Current-state process and issue log |
| Validate | Excel analysis; basic SQL where data access permits | Evidence and root-cause assessment |
| Communicate | Power BI | KPI and exception visibility |
| Specify | Requirements and acceptance criteria | Prioritised change requirements |
| Follow through | Action tracker and review cadence | Ownership and outcome monitoring |

Tool selection depends on data access, system capability and the assignment. A dashboard is not a substitute for understanding the process.

## 10. Recommendation structure

A final recommendation to management should contain:

1. **Finding:** What the evidence demonstrates.
2. **Business implication:** Why the finding matters to customer experience, conversion, time, cost or control.
3. **Root cause:** What has been validated, with supporting evidence.
4. **Options:** Practical alternatives and trade-offs.
5. **Recommendation:** The preferred action and rationale.
6. **Ownership:** Accountable team, dependencies and timing.
7. **Measurement:** Baseline, KPI definition and review date.

## 11. What this case study demonstrates

It demonstrates how I structure an automotive business-analysis problem: customer journey understanding, process decomposition, evidence requirements, hypothesis testing, KPI design, business requirements and decision communication.

It does **not** claim:
- Access to Mercedes-Benz internal systems or confidential data
- A measured improvement in dealership conversion or delivery time
- Implementation of the proposed requirements
- An official Mercedes-Benz or Raam Group recommendation
- A quantified financial or customer-experience impact

## 12. My intended contribution

I can contribute to an automotive business team by connecting customer-facing activity with the processes and information behind it: clarifying the problem, identifying where evidence is missing, structuring operational analysis, documenting requirements and helping teams track whether an agreed change improves the intended outcome.

**The objective is not to produce another report. It is to help the business make a better decision and follow that decision through to a measurable result.**

---

[Return to GitHub profile README](../README.md) · [View full portfolio](https://manoj5520.github.io/)
