# Fortress X Architecture Documentation

This document provides a comprehensive architectural overview of the Fortress X fraud detection system. The diagrams follow an academic, black-and-white standard using Mermaid syntax.

## 1. System Architecture (C4 Model)
This diagram illustrates the high-level flow of the Fortress X system. It demonstrates how external users interact with the React frontend, which in turn communicates with the FastAPI backend and PostgreSQL database via REST APIs and WebSockets.

```mermaid
flowchart TD
    User([User / Analyst])
    
    subgraph FrontendSystem [Frontend Subsystem]
        ReactApp[React Application]
    end
    
    subgraph BackendSystem [Backend Subsystem]
        FastAPI[FastAPI Server]
        FraudEngine[Fraud Detection Engine]
    end
    
    subgraph DatabaseSystem [Data Subsystem]
        PostgreSQL[(PostgreSQL Database)]
    end
    
    User -->|Interacts via Browser| ReactApp
    ReactApp -->|REST API Requests| FastAPI
    ReactApp -.->|WebSocket Live Updates| FastAPI
    FastAPI -->|Processes Requests| FraudEngine
    FastAPI -->|Reads / Writes| PostgreSQL
    FraudEngine -->|Stores Scores| PostgreSQL
```

## 2. Deployment Diagram
This diagram outlines the cloud deployment topology. It shows the distribution of the system across Vercel for static asset hosting, Render for backend execution, and Supabase for managed database services.

```mermaid
flowchart TD
    ClientNode[Client Browser]
    
    subgraph VercelCloud [Vercel Deployment]
        FrontendNode[React Frontend Assets]
    end
    
    subgraph RenderCloud [Render Deployment]
        BackendNode[FastAPI Service]
    end
    
    subgraph SupabaseCloud [Supabase Platform]
        DBNode[(PostgreSQL Instance)]
    end
    
    ClientNode -->|HTTPS| FrontendNode
    FrontendNode -->|HTTPS / WSS| BackendNode
    BackendNode -->|TCP 5432| DBNode
```

## 3. Entity-Relationship (ER) Diagram
This diagram details the relational database schema of the system. It highlights the primary entities, their attributes, and the foreign key constraints mapping Users, Transactions, Scores, Alerts, and Devices.

```mermaid
erDiagram
    USER {
        int id PK
        string email
        string hashed_password
        string role
        datetime created_at
    }
    
    TRANSACTION {
        string id PK
        string user_id FK
        float amount
        string currency
        string ip_address
        string device_id FK
        datetime timestamp
    }
    
    FRAUD_SCORE {
        int id PK
        string transaction_id FK
        float ml_score
        float ip_score
        float behavior_score
        float final_score
        string decision
    }
    
    ALERT {
        int id PK
        string transaction_id FK
        string severity
        string reason
        string status
        datetime created_at
    }
    
    DEVICE {
        string id PK
        string signature
        datetime first_seen
    }
    
    USER ||--o{ TRANSACTION : initiates
    TRANSACTION ||--|| FRAUD_SCORE : receives
    TRANSACTION ||--o{ ALERT : triggers
    DEVICE ||--o{ TRANSACTION : associated_with
```

## 4. Fraud Prediction Sequence Diagram
This sequence diagram captures the operational flow of processing a transaction. It traces the path from the initial user input through the prediction engines and down to the final database persistence and UI update.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant PredictAPI
    participant FraudEngine
    participant Database
    
    User->>Frontend: Submits Transaction Data
    Frontend->>PredictAPI: POST /predict (Payload)
    PredictAPI->>FraudEngine: Analyze Risk Parameters
    
    FraudEngine->>FraudEngine: Calculate ML Score
    FraudEngine->>FraudEngine: Calculate IP Risk
    FraudEngine->>FraudEngine: Calculate Behavior Score
    
    FraudEngine->>Database: Save Transaction & Scores
    
    alt is High Risk
        FraudEngine->>Database: Generate Alert
    end
    
    PredictAPI-->>Frontend: Return Decision (ALLOW/REVIEW/BLOCK)
    Frontend-->>User: Display Results on Dashboard
```

## 5. Real-Time Communication Flow
This diagram illustrates the dual-strategy synchronization mechanism used by the frontend dashboard. It relies on a primary WebSocket connection for immediate updates, backed by a robust interval polling mechanism.

```mermaid
flowchart TD
    ClientApp[Frontend Dashboard]
    WebSocketServer[Backend WebSocket Route]
    RESTServer[Backend Metrics Route]
    
    ClientApp -->|1. Opens Connection| WebSocketServer
    WebSocketServer -.->|2. Pushes Live Alerts| ClientApp
    
    ClientApp -->|3. Interval: Every 5s| RESTServer
    RESTServer -.->|4. Returns Fallback Data| ClientApp
    
    subgraph Frontend Logic
        UpdateState[Update UI State]
    end
    
    WebSocketServer -.-> UpdateState
    RESTServer -.-> UpdateState
```

## 6. Fraud Detection Activity Diagram
This activity diagram demonstrates the conditional logic applied to an incoming transaction. It maps out how the combination of three independent scoring models results in one of three definitive actions.

```mermaid
flowchart TD
    Start([Receive Transaction]) --> AnalyzeML[Evaluate ML Weights]
    AnalyzeML --> AnalyzeIP[Evaluate IP Reputation]
    AnalyzeIP --> AnalyzeBehavior[Evaluate Behavioral Anomalies]
    AnalyzeBehavior --> AggregateScore[Compute Final Aggregate Score]
    
    AggregateScore --> Decision{Risk Threshold Check}
    
    Decision -->|Score < 0.4| Allow[Action: ALLOW]
    Decision -->|0.4 <= Score < 0.7| Review[Action: REVIEW]
    Decision -->|Score >= 0.7| Block[Action: BLOCK]
    
    Allow --> End([Process Complete])
    Review --> Alert[Generate Warning Alert] --> End
    Block --> AlertCritical[Generate Critical Alert] --> End
```

## 7. Authentication & Authorization Sequence
This diagram details the security lifecycle within Fortress X. It explains the acquisition, storage, and validation of JSON Web Tokens (JWT), as well as the implementation of Role-Based Access Control (RBAC).

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthAPI
    participant ResourceAPI
    
    User->>Frontend: Enters Credentials
    Frontend->>AuthAPI: POST /login
    AuthAPI-->>Frontend: Returns JWT Token
    Frontend->>Frontend: Store Token in localStorage
    
    User->>Frontend: Navigates to /users (Admin Only)
    Frontend->>Frontend: Check Token Role
    
    alt Role == Analyst
        Frontend-->>User: Redirect to /dashboard
    else Role == Admin
        Frontend->>ResourceAPI: GET /users (Bearer Token)
        ResourceAPI-->>Frontend: Return User Data
        Frontend-->>User: Display Admin Panel
    end
```

## 8. Frontend Component Diagram
This diagram maps the hierarchical structure of the React frontend application. It visualizes how routing encapsulates layout logic, which in turn renders specific pages and reusable UI artifacts.

```mermaid
flowchart TD
    App[App.tsx / Router]
    
    App --> MainLayout[Main Layout]
    App --> AuthViews[Login / Landing]
    
    MainLayout --> Sidebar[Sidebar Component]
    MainLayout --> RouterOutlet[Router Outlet]
    
    RouterOutlet --> Dashboard[Dashboard Page]
    RouterOutlet --> LiveFeed[Live Feed Page]
    RouterOutlet --> Sandbox[Sandbox Page]
    RouterOutlet --> Alerts[Alerts Page]
    
    subgraph Reusable Components
        CyberCard[Cyber Card UI]
        CyberBackground[3D Cyber Background]
    end
    
    Dashboard -.-> CyberCard
    Dashboard -.-> CyberBackground
    Sandbox -.-> CyberCard
```
