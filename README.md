# PulsePoint ERIS

**A professional-grade Emergency Response Information System for logging calls, dispatching teams, and managing incidents.**

---

![PulsePoint ERIS Screenshot](https://storage.googleapis.com/aai-web-samples/apps/eris-screenshot.png)

## 📖 Introduction

PulsePoint ERIS is a modern, web-based application designed to streamline the operations of emergency response teams. It provides a centralized, role-based platform for every level of an emergency response organization. Dispatchers can log incoming calls with AI-assisted priority suggestions and manage units on a live map. EMTs can handle their assignments in the field. Supervisors can manage team rosters and weekly schedules. COOs can analyze operational performance against service level agreements. And Administrators can audit system activity.

With its clean, role-based interface and real-time data updates, PulsePoint ERIS is built to perform under pressure, ensuring that critical information is always accurate and accessible.

## ✨ Core Features

PulsePoint ERIS provides a tailored experience for each role within an emergency response organization.

### For Dispatchers
- **AI-Assisted Call Logging:** A dedicated form to quickly capture critical information, with a Gemini-powered AI that automatically suggests a priority level based on the incident description.
- **Live Status Map:** A dynamic map providing a real-time (simulated) view of all active incidents and team locations. Available teams patrol randomly, while dispatched teams move toward their assigned incident.
- **Interactive Call Queue:** View all pending incidents, automatically sorted by priority, with a clear visual distinction for Priority 1 calls.
- **Advanced Search:** Instantly find pending calls by location or description.
- **Efficient Dispatching:** Select a pending call and assign it to any available team with a single click.
- **End-of-Day Reporting:** Generate an instant modal report summarizing the day's call volume, priority breakdown, and average dispatch time.

### For EMTs (Emergency Medical Technicians)
- **Focused Assignment View:** A clear, detailed card shows the current active assignment, including location, caller details, and incident description.
- **Interactive Status Updates:** Manage your response status with a logical workflow of action buttons: "On Scene," "Transporting," and "Complete Call," which become enabled as the incident progresses.
- **Clock In / Out:** Easily manage your on-duty status for the day.
- **Detailed Patient Care Records (PCR):** After completing a call, fill out a comprehensive form to log patient vitals, treatments administered, medications, and transfer destination.
- **Shift Summary Analytics:** An at-a-glance dashboard with a doughnut chart showing a breakdown of calls handled by priority during the current shift.

### For Supervisors
- **High-Level Operational Dashboard:** Key performance indicators (KPIs) are displayed in clear "stat cards," showing total calls, open incidents, PCRs filed, total personnel, and teams on duty.
- **Team Roster Management:** View, filter (by station or grade), and manage all teams. An intuitive modal allows for editing team names, grades, and member assignments.
- **Weekly Scheduling Tool:** A powerful scheduling interface to assign teams to day and night shifts for the entire week.
- **Shift Handover Reporting:** Generate an "Exception Report" that lists all currently open incidents, their age, and assigned team, ensuring a smooth handover between shifts.
- **Full Data Export:** Export the complete list of open incidents to a CSV file with a single click for offline analysis or record-keeping.

### For COOs (Chief Operating Officers)
- **Executive SLA Dashboard:** An analytics-focused dashboard for viewing Service Level Agreement (SLA) performance.
- **Key Performance Metrics:** Stat cards display critical metrics like Average Dispatch Time, Average On-Scene Time, Average Total Response Time, and overall SLA Compliance Percentage.
- **SLA Compliance Visualization:** A clear bar chart shows the percentage of responses that met or missed the target response time.

### For Administrators
- **System Audit Log:** A comprehensive, immutable log of all significant actions taken within the system, including user logins, call creations, status updates, and more.
- **System Backup:** A one-click function to trigger a manual system backup (simulated).

### System-Wide Features
- **Secure Authentication:** A complete login and sign-up system ensures only authorized personnel can access the system.
- **Role-Based Access Control (RBAC):** The interface and capabilities are automatically tailored to the logged-in user's role.
- **Responsive Design:** The layout is optimized for a seamless experience on desktops, tablets, and mobile devices.
- **Dark & Light Mode:** A theme toggle to reduce eye strain, especially crucial for dispatchers working in low-light environments.

## 🚀 How It Works

A typical incident workflow in PulsePoint ERIS looks like this:

1.  **Call Intake:** A dispatcher receives a call and uses the "Log New Call" form. As they type the description, a Gemini-powered AI suggests a priority level.
2.  **Dispatch:** The new call appears in the dispatcher's queue. The dispatcher views the `Live Status Map` to identify the best unit and assigns the call.
3.  **Response:** The assigned EMT sees the new incident on their dashboard. They update their status from `Dispatched` to `On Scene`, and their icon on the live map stops moving. These status changes are reflected in real-time across the system.
4.  **Reporting:** After resolving the incident and marking it `Completed`, the EMT is prompted to `File PCR`. They fill out the detailed patient care record.
5.  **Oversight & Management:**
    - A **Supervisor** can log in to see the updated team statuses, generate an exception report for shift handover, or manage the upcoming week's schedule.
    - The **COO** reviews their dashboard to see how this call impacted the day's SLA compliance metrics.
    - An **Admin** can see the entire lifecycle of the call—from creation to PCR filing—in the audit log.

## 💻 Technology Stack

PulsePoint ERIS is a modern frontend application built with industry-standard technologies.

- **React:** A powerful JavaScript library for building user interfaces.
- **TypeScript:** Adds static typing to JavaScript for improved code quality and maintainability.
- **Tailwind CSS:** A utility-first CSS framework for rapid, custom UI development.
- **Chart.js:** A flexible library for creating beautiful and informative data visualizations.
- **@google/genai (Gemini API):** Integrated for AI-powered priority suggestions during call logging.

## 🔮 Future Enhancements (Version 2+)

-   **Real-Time Backend:** Replace the local state simulation with a true backend service (e.g., Node.js with WebSockets) for real-time data synchronization across all clients.
-   **Mobile EMT Application:** Dedicated iOS/Android apps for even faster data entry and GPS integration in the field.
-   **Predictive Analytics:** Use historical data to forecast demand and optimize resource allocation.
-   **Billing & Hospital Integration:** Streamline the data pipeline for billing and patient handovers.