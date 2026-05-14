# Nidus

**A clean, focused place for your team's work.**

Nidus is a sprint-based project management tool built for teams that are tired of overcomplicated software. It's not trying to be Jira. It's not a glorified to-do list either. It sits right in the middle - simple enough that anyone can pick it up in minutes, but solid enough to actually run a real project on.

The name comes from the Latin word for *nest*. The idea is simple: every project deserves a proper home.

---

## What it does

You organize work into **Sprints** - short, focused time periods where your team commits to getting specific things done. Inside each sprint, you create tasks, assign them to people, set priorities, and watch everything move from start to finish.

Here's a quick rundown of what's inside:

- **Sprint management** - Create sprints with a name, goal, start date, and end date. See all your active, upcoming, and completed sprints at a glance, with a progress bar showing how much has been done.

- **Kanban board** - Tasks live on a board with four columns: *Backlog*, *In Progress*, *In Review*, and *Done*. You drag cards across as work progresses. Simple, visual, satisfying.

- **Task details** - Each task has a title, description, assignee, priority (Low / Medium / High), and due date. You always know who owns what and when it's due.

- **Team accounts** - Sign up with your email, or skip the form entirely and log in with GitHub or Google. Everyone on the team gets their own account, and tasks are assigned to real people.

- **Live updates** - Changes save instantly to the database. No refreshing, no losing work. If someone else updates a task, you'll see it.

- **Works on any screen** - Whether you're on a laptop or your phone, the layout adjusts so nothing feels cramped or broken.

---

## Running it yourself

If you want to run Nidus locally, here's what you'll need:

- [Node.js](https://nodejs.org/) (v18 or newer)
- A free [Supabase](https://supabase.com/) account (this is where the database lives)

**Step 1 - Clone the project**

```bash
git clone https://github.com/iankinoti-cloud/nidus-task-management-application.git
cd nidus-task-management-application
```

**Step 2 - Install dependencies**

```bash
npm install
```

**Step 3 - Set up your environment**

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Open `.env` and add your Supabase project URL and anon key. You can find both in your Supabase dashboard under **Project Settings - API**.

**Step 4 - Set up the database**

In your Supabase project, open the SQL editor and run the contents of `supabase/schema.sql`. This creates all the tables Nidus needs.

**Step 5 - Start the app**

```bash
npm run dev
```

That's it. Open [http://localhost:5173](http://localhost:5173) and you're in.

---

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the app for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Checks the code for style issues |
| `npm test` | Runs the test suite |
| `npm run test:coverage` | Runs tests and shows coverage report |

---

## Tech, if you're curious

Nidus is built with React and TypeScript on the frontend, styled with Tailwind CSS, and backed by Supabase for the database and authentication. Data fetching is handled by TanStack Query, and drag-and-drop uses `@hello-pangea/dnd`. Tests run on Vitest. The whole thing deploys automatically via GitHub Actions on every push to `main`.

---

## Project status

This is `v1.0.0` - the first full release. Core features are stable and working. There's more planned, but the foundation is solid.

---

> *Every great project needs a home. Nidus is that home.*
