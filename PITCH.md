# IAN_KHELAN
## Nidus — PROJECT PITCH

---

## PROBLEM STATEMENT

Modern software teams, startups, and remote-first organizations struggle to manage work effectively across fragmented tools. Trello is too simple, Jira is too complex, and most project management solutions either lack real-time collaboration, are prohibitively expensive, or require steep learning curves. Teams end up juggling spreadsheets, Slack threads, and sticky notes — losing track of who owns what, what's overdue, and what's actually been shipped. The result is missed deadlines, duplicated effort, and a constant lack of visibility into project health.

---

## PROPOSED SOLUTION

**Nidus** is a focused, developer-friendly project management platform built around the concept of **Sprints**. Named after the Latin word for "nest," Nidus gives every team a structured home for their work. It is a full-stack web application where teams can create time-boxed Sprints, assign tasks to members, and track progress through clear, persistent status workflows — all backed by a real-time database to ensure consistency across every session and device.

Nidus strips away the bloat and delivers exactly what agile teams need: a clean, fast, and reliable workspace to plan, execute, and ship.

---

## MINIMUM VIABLE PRODUCT

### Key Features

#### Sprint Management
- **Create & Configure Sprints:** Users can define sprints with a name, goal, start date, and end date — providing clear time-boxing for all work within the sprint.
- **Sprint Dashboard:** A real-time overview of all active, upcoming, and completed sprints with progress indicators showing task completion percentages.

#### Task & Assignment System
- **Task Creation:** Within each sprint, users can create tasks with a title, description, assignee, priority level (Low / Medium / High), and due date.
- **Role-Based Assignment:** Tasks can be assigned to any authenticated team member, with clear ownership displayed on every card.
- **Status Workflow:** Tasks move through clearly defined stages — `Backlog → In Progress → In Review → Done` — with drag-and-drop support and persistent state on every status change.

#### Authentication & Social Auth
- **Secure Login:** Email/password authentication with session management powered by Supabase Auth.
- **Social Login:** One-click sign-in via GitHub and Google OAuth, reducing onboarding friction for developer teams.
- **Protected Routes:** All sprint and task data is gated behind authentication, with role-aware UI rendering.

#### Real-Time Data Persistence
- **No Local Storage:** Every state change — task creation, status update, sprint modification — is immediately written to the backend database, ensuring the UI is fully consistent across browser sessions, devices, and users.
- **Live Updates:** Team members see changes reflected in real time without needing to refresh the page.

#### Responsive Design
- **Mobile-First Layout:** Nidus is fully responsive across all screen sizes, from desktop sprint boards to mobile task cards, ensuring productivity on any device.
- **Adaptive UI:** Navigation collapses gracefully on smaller screens, and the kanban board stacks vertically for touch-friendly use.

#### Testing
- **30%+ Test Coverage:** Core business logic — including authentication flows, sprint CRUD operations, task status transitions, and route guards — is covered by unit and integration tests using Vitest and React Testing Library.

#### CI/CD & Deployment
- **GitHub Actions Pipeline:** Automated workflows handle linting, type-checking, test runs, and deployment on every push to `main`, ensuring only passing builds reach production.
- **Semantic Versioning:** Releases follow `MAJOR.MINOR.PATCH` versioning, with GitHub Releases tagging each deployed version and an auto-generated changelog.

---

## TECH STACK

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript, React Router v7, Tailwind CSS v4 |
| **State Management** | TanStack Query (React Query) for server state |
| **Backend / BaaS** | Supabase (PostgreSQL database, Auth, Realtime subscriptions) |
| **Authentication** | Supabase Auth — Email/Password + GitHub & Google OAuth |
| **Testing** | Vitest + React Testing Library |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel (Frontend) |
| **Version Control** | Git & GitHub with semantic versioning via GitHub Releases |

---

## THE VISION

Nidus is built on a simple belief: **great tools should get out of the way**. The goal is not to replace enterprise project management suites, but to be the go-to sprint workspace for small and mid-sized engineering teams who value speed, clarity, and reliability. By combining a clean agile workflow with real-time persistence, social authentication, and automated deployments, Nidus demonstrates what a modern, production-grade project management tool looks like — built to scale, built to last, and built to help teams ship with confidence.

> *"Every great project needs a home. Nidus is that home."*

---

**Initial Release:** `v1.0.0`  
**Versioning Standard:** [Semantic Versioning 2.0.0](https://semver.org/)  
**Repository:** [github.com/keynotii/nidus](https://github.com/keynotii/nidus)
