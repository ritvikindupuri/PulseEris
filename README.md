# PulsePoint ERIS

**A professional-grade Emergency Response Information System for logging calls, dispatching teams, and managing incidents, leveraging the power of Google's Gemini API.**

---

![PulsePoint ERIS Screenshot](https://storage.googleapis.com/aai-web-samples/apps/eris-screenshot.png)

## 📖 Introduction

PulsePoint ERIS is a modern, web-based application designed to streamline the operations of emergency response teams. It provides a centralized, role-based platform for every level of an emergency response organization, with intelligent features powered by Google's Gemini API. Dispatchers can log incoming calls with AI-assisted priority suggestions and location intelligence. EMTs can handle their assignments and accelerate reporting with an AI Scribe. Supervisors can manage team rosters, schedules, and generate AI-powered handover summaries. COOs can analyze operational performance, and Administrators can audit system activity.

With its clean, role-based interface and real-time data updates, PulsePoint ERIS is built to perform under pressure, ensuring that critical information is always accurate, intelligent, and accessible.

## ✨ Core Features

PulsePoint ERIS provides a tailored experience for each role within an emergency response organization.

### For Dispatchers
- **AI-Assisted Call Logging:** A dedicated form to quickly capture critical information, with a Gemini-powered AI that automatically suggests a priority level based on the incident description.
- **AI-Powered Location Intelligence:** Using Gemini with Google Maps Grounding, dispatchers can verify an address, get a summary of potential access challenges for an ambulance, and see a list of nearby hospitals, all before dispatching a unit.
- **Live Status Map:** A dynamic map providing a real-time (simulated) view of all active incidents and team locations.
- **Interactive Call Queue:** View all pending incidents, automatically sorted by priority, with a clear visual distinction for Priority 1 calls.
- **Advanced Search:** Instantly find pending calls by location or description.
- **Efficient Dispatching:** Select a pending call and assign it to any available team with a single click.
- **End-of-Day Reporting with AI Analysis:** Generate an instant report summarizing the day's key metrics, and use Gemini to create a qualitative analysis of trends, anomalies, and potential operational improvements.

### For EMTs (Emergency Medical Technicians)
- **Focused Assignment View:** A clear, detailed card shows the current active assignment, including location, caller details, and incident description.
- **Interactive Status Updates:** Manage your response status with a logical workflow of action buttons: "On Scene," "Transporting," and "Complete Call."
- **Clock In / Out:** Easily manage your on-duty status for the day.
- **Detailed Patient Care Records (PCR):** After completing a call, fill out a comprehensive form to log patient vitals and treatments, featuring a low-latency **AI Scribe** to instantly generate professional narratives from raw notes.
- **Shift Summary Analytics:** An at-a-glance dashboard with a doughnut chart showing a breakdown of calls handled by priority during the current shift.

### For Supervisors
- **High-Level Operational Dashboard:** Key performance indicators (KPIs) are displayed in clear "stat cards," showing total calls, open incidents, PCRs filed, and personnel status.
- **Team Roster Management:** View, filter, and manage all teams. An intuitive modal allows for editing team names, grades, and member assignments.
- **Weekly Scheduling Tool:** A powerful scheduling interface to assign teams to day and night shifts for the entire week.
- **Shift Handover Reporting with AI Summary:** Generate an "Exception Report" that lists all currently open incidents, and use Gemini to create an **AI-generated summary** to highlight critical information for the incoming shift.
- **Full Data Export:** Export the complete list of open incidents to a CSV file with a single click.

### For COOs (Chief Operating Officers)
- **Executive SLA Dashboard:** An analytics-focused dashboard for viewing Service Level Agreement (SLA) performance.
- **Key Performance Metrics:** Stat cards display critical metrics like Average Dispatch Time, Average On-Scene Time, Average Total Response Time, and overall SLA Compliance Percentage.
- **SLA Compliance Visualization:** A clear bar chart shows the percentage of responses that met or missed the target response time.

### For Administrators
- **System Audit Log:** A comprehensive, immutable log of all significant actions taken within the system.
- **System Backup:** A one-click function to trigger a manual system backup (simulated).

### System-Wide Features
- **Secure Authentication:** A complete login and sign-up system ensures only authorized personnel can access the system.
- **Role-Based Access Control (RBAC):** The interface and capabilities are automatically tailored to the logged-in user's role.
- **Responsive Design:** The layout is optimized for a seamless experience on desktops, tablets, and mobile devices.
- **Dark & Light Mode:** A theme toggle to reduce eye strain, especially crucial for dispatchers working in low-light environments.

## 🚀 How It Works

A typical incident workflow in PulsePoint ERIS looks like this:

1.  **Call Intake:** A dispatcher receives a call and uses the "Log New Call" form. As they type the description, an AI suggests a priority level. The dispatcher then uses **AI-Powered Location Intelligence** to verify the address and assess the scene.
2.  **Dispatch:** The new call appears in the dispatcher's queue. The dispatcher views the `Live Status Map` to identify the best unit and assigns the call.
3.  **Response:** The assigned EMT sees the new incident on their dashboard. They update their status from `Dispatched` to `On Scene`. These status changes are reflected in real-time across the system.
4.  **Reporting:** After resolving the incident and marking it `Completed`, the EMT is prompted to `File PCR`. They enter raw notes and use the **AI Scribe** to rapidly generate a professional narrative.
5.  **Oversight & Management:**
    - A **Supervisor** logs in, generates an **AI-powered handover summary** for the next shift, and manages the upcoming week's schedule.
    - A **Dispatcher** ends their shift by generating an **EOD report with AI analysis** to identify key operational trends from the day.
    - The **COO** reviews their dashboard to see how this call impacted the day's SLA compliance metrics.
    - An **Admin** can see the entire lifecycle of the call—from creation to PCR filing—in the audit log.

## 💻 Technology Stack

PulsePoint ERIS is a modern frontend application built with industry-standard technologies.

- **React:** A powerful JavaScript library for building user interfaces.
- **TypeScript:** Adds static typing to JavaScript for improved code quality and maintainability.
- **Tailwind CSS:** A utility-first CSS framework for rapid, custom UI development.
- **Chart.js:** A flexible library for creating beautiful and informative data visualizations.
- **@google/genai (Gemini API):** Heavily integrated for a variety of intelligent features:
    - **`gemini-2.5-flash`:** Powers fast tasks like priority suggestions and AI-driven handover summaries.
    - **`gemini-2.5-flash` with Google Maps Grounding:** Provides location-based intelligence for dispatchers.
    - **`gemini-2.5-flash-lite`:** Enables extremely low-latency text generation for the EMT's AI Scribe feature.
    - **`gemini-2.5-pro`:** Used for more complex analytical tasks, like generating deep operational insights for the End of Day report.

## 🔮 Future Enhancements (Version 2+)

-   **Real-Time Backend:** Replace the local state simulation with a true backend service (e.g., Node.js with WebSockets) for real-time data synchronization across all clients.
-   **Mobile EMT Application:** Dedicated iOS/Android apps for even faster data entry and GPS integration in the field.
-   **Predictive Analytics:** Use historical data to forecast demand and optimize resource allocation.
-   **Billing & Hospital Integration:** Streamline the data pipeline for billing and patient handovers.
