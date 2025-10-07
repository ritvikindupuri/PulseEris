# PulsePoint ERIS - Technical Documentation

This document provides a technical overview of the PulsePoint ERIS application, intended for developers and system architects.

---

## 1. System Architecture

PulsePoint ERIS is a client-side React application designed with a component-based architecture. All state is managed centrally within the main `App` component and passed down to child components as props. This creates a unidirectional data flow, making the application predictable and easier to debug.

### 1.1 Architecture Diagram (Mermaid)

```mermaid
graph TD
    A[index.tsx] --> B(App.tsx);

    subgraph "State Management (in App.tsx)"
        B -- Manages State --> C{Users};
        B -- Manages State --> D{Calls};
        B -- Manages State --> E{Teams};
        B -- Manages State --> F{Patient Care Records};
        B -- Manages State --> G{UI State (View, Theme)};
    end

    subgraph "Core Components (Views)"
        B -- Renders --> H{LoginPage};
        B -- Renders --> I{SignUpPage};
        B -- Renders --> J(Dashboard Container);
    end
    
    subgraph "Role-Based Dashboards"
        J -- Contains --> K[DispatcherDashboard];
        J -- Contains --> L[EmtDashboard];
        J -- Contains --> M[SupervisorDashboard];
        J -- Contains --> N[COODashboard];
    end

    subgraph "Dispatcher Features"
        K -- Displays --> O(Call List);
        K -- Displays --> P(Team Availability Panel);
        K -- Displays --> Q(LiveMapPanel - GIS Sim);
        K -- Triggers --> R[LogCallForm];
    end
    
    subgraph "EMT Features"
       L -- Displays --> S(Assigned Call);
       L -- Triggers --> T[PatientCareRecordForm];
       L -- Displays --> U(Shift Analytics);
    end

    subgraph "External Services"
        R -- API Call --> V(Gemini API for Priority);
    end

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#ccf,stroke:#333,stroke-width:2px
```

### 1.2 Data Flow

1.  **Initialization:** The app loads initial data from `constants.ts` or `localStorage`.
2.  **Authentication:** The user logs in via `LoginPage`. `App.tsx` verifies credentials and sets `currentUser`.
3.  **Rendering:** Based on the `currentUser`'s role, the appropriate dashboard (`DispatcherDashboard`, `EmtDashboard`, etc.) is rendered.
4.  **Actions:**
    *   A dispatcher logs a call using `LogCallForm`. The form's `onSubmit` handler calls a function in `App.tsx` (`handleLogNewCall`).
    *   `App.tsx` updates the `calls` state array with the new call.
    *   React re-renders the `DispatcherDashboard` with the updated list of calls.
5.  **Team Dispatch:**
    *   A dispatcher selects a team from a dropdown on a pending call.
    *   `handleAssignCallToTeam` is called in `App.tsx`.
    *   The `calls` and `teams` state arrays are updated.
    *   The `DispatcherDashboard` and `EmtDashboard` both re-render to reflect the new assignment and status.

## 2. State Management

The entire application state is held within the `App.tsx` component using `React.useState`. This centralized approach, while simple, is effective for an application of this scale.

### 2.1 Main State Objects

-   `users: User[]`: A list of all user accounts in the system.
-   `teams: Team[]`: A list of all response teams, including their members and status.
-   `calls: EmergencyCall[]`: The master list of all emergency incidents.
-   `pcrs: PatientCareRecord[]`: A collection of all submitted Patient Care Records.
-   `currentUser: User | null`: The currently authenticated user object.
-   `view: AppView`: A string that controls which primary view is rendered (e.g., 'login', 'dashboard').
-   `isDarkMode: boolean`: Controls the application's theme.

### 2.2 State Persistence

State (`users`, `calls`, `teams`, `pcrs`) is persisted to the browser's `localStorage` using `React.useEffect`. This ensures that data is not lost on a page refresh, simulating a persistent backend.

## 3. Component Breakdown

### `App.tsx`
-   **Role:** The root component and central state manager.
-   **Responsibilities:** Holds all application state, contains all state-mutating functions (event handlers), and handles the routing logic to display the correct view based on application state.

### `DispatcherDashboard.tsx`
-   **Role:** The primary interface for dispatchers.
-   **Features:**
    -   Displays a filterable list of all emergency calls.
    -   Presents a real-time **Team Availability** panel, showing all teams grouped by base station with their current status.
    -   Includes a **Live Map Panel** to simulate a GIS/AVL feed, providing a visual representation of team locations.
    -   Allows dispatchers to assign a pending call to an available team via a dropdown menu.

### `EmtDashboard.tsx`
-   **Role:** The interface for field personnel, designed for mobile/tablet use.
-   **Features:**
    -   **Team-Centric View:** Shows only the single, active incident assigned to the user's team.
    -   **Shift Management:** Provides "Clock In" and "Clock Out" functionality.
    -   **Team Status Updates:** Action buttons ("On Scene", "Transporting", etc.) update the status of the entire team, which is reflected on the Dispatcher Dashboard.
    -   Initiates the Patient Care Record (PCR) filing workflow upon call completion.

### `SupervisorDashboard.tsx`
-   **Role:** Provides an operational overview for management.
-   **Features:**
    -   Displays key metric cards (KPIs).
    -   **Team Management:** Allows supervisors to edit team details, including name, grade, and member roster.
    -   **Reporting:** Features analytics like "Demand by Base Station" and an "Exception Report" generator for open calls at shift handover (exports to CSV).

### `COODashboard.tsx`
-   **Role:** High-level executive dashboard.
-   **Features:**
    -   Focuses on Service Level Agreement (SLA) metrics.
    -   Calculates and displays average response times (dispatch, on-scene) and overall SLA compliance.

### `LogCallForm.tsx`
-   **Role:** The form for logging new emergency calls.
-   **Key Feature:** Integrates with the **Gemini API** to provide real-time, AI-powered suggestions for the call's priority level based on the dispatcher's text input.

## 4. Key Workflows & Logic

### 4.1 Team Status Logic
A team's status is derived from the actions performed on it.
-   When a call is assigned to a team, its status becomes `DISPATCHED`.
-   When an EMT on that team marks the call as `COMPLETED`, the team's status reverts to `AVAILABLE`.
-   An EMT can also manually set their individual status to `AWAY`, which would update the team status accordingly if business rules required it (currently illustrative).

### 4.2 GIS/AVL Integration (Simulated)
-   The `LiveMapPanel.tsx` component serves as the integration point for a future GIS/AVL API.
-   Currently, it displays a static map and renders team locations based on mock data in `constants.ts`. The icons are color-coded based on the team's live status from the `teams` state object.
-   In a production environment, this component would be replaced with a library like Leaflet or Mapbox GL JS and would fetch real-time coordinates from a dedicated backend service.

### 4.3 Non-Functional Requirements
-   **UI Response (NFR-5):** The application is optimized using `React.useMemo` to prevent unnecessary re-renders of lists, ensuring the UI remains responsive even with a large number of calls or teams.
-   **Security (NFR-4):** All data is currently client-side. In a production app, API calls to a backend would be made over HTTPS to encrypt data in transit. The backend would be responsible for encrypting data at rest in the database.
-   **Concurrency & Reliability (NFR-1, NFR-2):** These are backend and infrastructure concerns. The frontend is built to handle data from a scalable API, but the implementation of load balancing, database scaling, and uptime monitoring would be part of the backend architecture.
