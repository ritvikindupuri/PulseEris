# PulsePoint ERIS

**A professional-grade Emergency Response Information System for logging calls, dispatching teams, and managing incidents.**

---

![PulsePoint ERIS Screenshot](https://storage.googleapis.com/aai-web-samples/apps/eris-screenshot.png)

## 📖 Introduction

PulsePoint ERIS is a modern, web-based application designed to streamline the operations of emergency response teams. It provides a centralized platform for dispatchers to log incoming calls, for EMTs to manage their assignments in the field, and for supervisors to monitor operational efficiency. With its clean, role-based interface and real-time data updates, PulsePoint ERIS is built to perform under pressure, ensuring that critical information is always accurate and accessible.

This application serves as a comprehensive solution for:
- **Call Intake & Triage:** Quickly capturing and prioritizing emergency calls.
- **Dispatch Management:** Visualizing team status and location for efficient dispatch.
- **Field Operations:** Providing EMTs with the incident details they need to respond effectively.
- **Incident Reporting:** Ensuring complete and compliant patient care records for every call.
- **Operational Oversight:** Giving managers the data to make informed decisions.

## ✨ Core Features

PulsePoint ERIS provides a tailored experience for each role within an emergency response organization.

### For Dispatchers
- **Real-Time Call Queue:** View all active emergency calls, automatically sorted by priority and time.
- **Advanced Filtering & Search:** Instantly find calls by caller name, phone number, location, priority, or status.
- **Live Team Availability Panel:** See a real-time overview of all on-duty EMTs, their current status (Available, Dispatched, Away), and their assigned base station.
- **Efficient Call Logging:** A dedicated form to quickly capture critical information, including caller details, location, nearest landmark, and a description of the emergency.
- **Urgent Visual Cues:** High-contrast, color-coded priority levels, including a flashing animation for the most critical (Priority 1) incidents.

### For EMTs (Emergency Medical Technicians)
- **Prioritized Task List:** View a clear, ordered list of assigned calls, ensuring the most critical incidents are addressed first.
- **Interactive Workflow:** Manage your response status with prominent action buttons: "Clock In/Out", "En Route", "On Scene", and "Submit PCR".
- **Live Map Integration:** View the exact location of the active call on an embedded map for quick navigation.
- **Detailed Patient Care Records (PCR):** After an incident, fill out a comprehensive form to log patient vitals, treatments administered, medications, and transfer destination.
- **Shift Summary Analytics:** An at-a-glance dashboard with charts showing a breakdown of calls handled during your shift.

### For Supervisors & Managers
- **High-Level Operational Dashboard:** Key performance indicators (KPIs) are displayed in clear "stat cards," showing total calls, open incidents, and PCR compliance rates.
- **Detailed Incident Log:** A comprehensive, sortable log of all calls, showing status, priority, and whether a PCR has been filed.
- **Full Data Export:** Export the complete incident log to a CSV file with a single click for offline analysis, auditing, or record-keeping.

### System-Wide Features
- **Secure Authentication:** A complete login and sign-up system ensures only authorized personnel can access the system.
- **Role-Based Access Control (RBAC):** The interface and capabilities are automatically tailored to the logged-in user's role.
- **Responsive Design:** The layout is optimized for a seamless experience on desktops, tablets, and mobile devices.
- **Dark & Light Mode:** A theme toggle to reduce eye strain, especially crucial for dispatchers working in low-light environments.

## 🚀 How It Works

A typical incident workflow in PulsePoint ERIS looks like this:

1.  **Call Intake:** A dispatcher receives an emergency call and uses the "Log Emergency Call" form to input the details, assigning a priority level.
2.  **Dispatch:** The new call appears instantly in the dispatcher's "Active Calls" queue. The dispatcher checks the "Team Availability" panel to identify the nearest available EMT unit.
3.  **Assignment:** The call is assigned to an EMT. The call appears on that EMT's dashboard.
4.  **Response:** The EMT clocks in, views the call details and location on the map, and updates their status to "En Route" and then "On Scene". These status changes are reflected in real-time on the dispatcher's availability panel.
5.  **Reporting:** After resolving the incident, the EMT's status becomes "Submit PCR". They fill out the detailed Patient Care Record form.
6.  **Closure:** Once the PCR is submitted, the call status is automatically updated to "Closed" across the system.
7.  **Oversight:** A supervisor can log in at any time to see the updated incident log, view the PCR compliance rate, and export the data for weekly reports.

## 💻 Technology Stack

PulsePoint ERIS is a modern frontend application built with industry-standard technologies.

- **React:** A powerful JavaScript library for building user interfaces.
- **TypeScript:** Adds static typing to JavaScript for improved code quality and maintainability.
- **Tailwind CSS:** A utility-first CSS framework for rapid, custom UI development.
- **Chart.js:** A flexible library for creating beautiful and informative data visualizations.

## 🔮 Future Enhancements (Version 2+)

-   **Mobile EMT Application:** Dedicated iOS/Android apps for even faster data entry in the field.
-   **Predictive Analytics:** Use historical data to forecast demand and optimize resource allocation.
-   **AI-Assisted Dispatch:** Provide dispatchers with intelligent suggestions for the best unit to assign.
-   **Billing & Hospital Integration:** Streamline the data pipeline for billing and patient handovers.
