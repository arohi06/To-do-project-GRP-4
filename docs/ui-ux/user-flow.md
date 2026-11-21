# User Flow & Screen Navigation — Group 4 To-Do Application

**Author:** Naivedya Pramod Yadav ([@Not-naive18](https://github.com/Not-naive18)) — UI/UX Designer  
**Repository:** `arohi06/To-do-project-GRP-4`  
**Git Branch:** `feature/ui-ux`  

---

## 1. High-Level Screen Flow Architecture

```mermaid
flowchart TD
    Start([User Opens Application]) --> AuthCheck{Is User Logged In?}
    
    AuthCheck -- No --> Screen1["Screen 1: Login / Sign Up"]
    AuthCheck -- Yes --> Screen2["Screen 2: Dashboard"]
    
    Screen1 -- Authenticated --> Screen2
    
    Screen2 --> ActionSelect{User Action}
    
    ActionSelect -- View Statistics --> Screen2
    ActionSelect -- Click '+ New Task' --> Screen3["Screen 3: Add Task Modal / Form"]
    ActionSelect -- Click 'View All Tasks' --> Screen4["Screen 4: Task List & Management"]
    
    Screen3 -- Save Task --> Screen4
    Screen3 -- Cancel --> Screen2
    
    Screen4 --> TaskAction{Task Action}
    TaskAction -- 1-Click Checkbox --> ToggleStatus["Toggle Pending <-> Completed"]
    TaskAction -- Filter / Search --> FilterView["Update Displayed Tasks"]
    TaskAction -- Click Edit --> Screen3
    TaskAction -- Click Delete --> ConfirmDelete{"Confirm Deletion?"}
    
    ConfirmDelete -- Yes --> DeleteTask["Remove Task & Refresh List"]
    ConfirmDelete -- No --> Screen4
    
    ToggleStatus --> Screen4
    FilterView --> Screen4
    DeleteTask --> Screen4
```

---

## 2. Task Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending : User Creates Task
    
    Pending --> InProgress : Start Working
    InProgress --> Completed : Mark Finished
    Pending --> Completed : Quick Checkbox Click
    
    Completed --> Pending : Uncheck / Reopen Task
    InProgress --> Pending : Blocked / Paused
    
    Pending --> [*] : Delete Task
    InProgress --> [*] : Delete Task
    Completed --> [*] : Delete Task
```

---

## 3. Data Flow Between Frontend and Backend

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Naivedya/Team)
    participant UI as Angular Frontend (Dhruva)
    participant API as Fastify Backend API (Adhira)
    participant DB as PostgreSQL Database (Arohi)

    User->>UI: Opens Dashboard
    UI->>API: GET /api/tasks
    API->>DB: knex('tasks').select('*')
    DB-->>API: Returns tasks records
    API-->>UI: 200 OK [tasks JSON]
    UI-->>User: Renders KPI Counters & Recent Tasks

    User->>UI: Clicks Checkbox on Task #4
    UI->>API: PUT /api/tasks/4 { status: 'completed' }
    API->>DB: knex('tasks').where({id: 4}).update({status: 'completed'})
    DB-->>API: 1 row updated
    API-->>UI: 200 OK { updatedTask }
    UI-->>User: Updates UI with green completed badge & strike-through
```
