-- ============================================================
-- Nidus — Supabase Database Schema
-- Version: 1.0.0
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT,
  full_name  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SPRINTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sprints (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  goal       TEXT,
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  status     TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all sprints"
  ON public.sprints FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create sprints"
  ON public.sprints FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Sprint creator can update their sprint"
  ON public.sprints FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Sprint creator can delete their sprint"
  ON public.sprints FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sprint_id   UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status      TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'in_review', 'done')),
  due_date    DATE,
  created_by  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Task creator can update their task"
  ON public.tasks FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Task creator can delete their task"
  ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.sprints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
