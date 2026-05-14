# Changelog

All notable changes to **Nidus** are documented here.

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and the format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-05-14

### Added

#### Authentication
- Email/password sign-up and sign-in via Supabase Auth
- Social OAuth login with **GitHub** and **Google**
- Protected routes — unauthenticated users are redirected to `/login`
- Session persistence managed entirely by Supabase (no localStorage)
- Auto-created user profile on first sign-up via database trigger

#### Sprint Management
- Create, edit, and delete sprints with title, goal, start date, end date, and status
- Sprint statuses: `Planned`, `Active`, `Completed`
- Sprint progress bar (% of tasks in `Done` state)
- Filter dashboard sprints by status tab (All / Active / Planned / Completed)

#### Task Management
- Create, edit, and delete tasks within a sprint
- Task fields: title, description, assignee, priority, status, due date
- Task statuses: `Backlog → In Progress → In Review → Done`
- Task priorities: `Low`, `Medium`, `High`
- Drag-and-drop kanban board powered by `@hello-pangea/dnd`
- Status change persisted to Supabase on every drag event
- Overdue task highlighting in red

#### UI / UX
- Dark-mode first design (slate/violet palette) built with Tailwind CSS v4
- Fully responsive — mobile nav, stacked kanban columns on mobile
- Animated modals with keyboard (Escape) dismissal and backdrop click support
- Sprint cards with progress bars, date range, and task count
- Avatar component with image or initials fallback

#### Data Persistence
- All state changes written directly to Supabase PostgreSQL
- No `localStorage`, `sessionStorage`, or browser caching used
- Real-time subscriptions enabled on `sprints` and `tasks` tables

#### Testing
- 66 unit and integration tests across utilities, UI components, and pages
- Test coverage ≥ 30% enforced via Vitest coverage thresholds
- Test runner: Vitest + React Testing Library + jsdom

#### CI/CD & Deployment
- GitHub Actions workflow: lint → type-check → test → build → deploy
- Deployment to Vercel on merge to `main`
- Semantic versioning with GitHub Releases

---

## Links

- [GitHub Repository](https://github.com/keynotii/nidus)
- [Live Demo](https://nidus.vercel.app) *(configure after deployment)*
