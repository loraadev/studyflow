-- Tabela de tarefas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'med', 'low')),
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de sessões de estudo
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  studied_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  daily_goal_minutes INTEGER NOT NULL DEFAULT 240,
  pomodoro_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  streak INTEGER NOT NULL DEFAULT 0,
  last_study_day DATE
);

INSERT INTO settings (id) VALUES (1);