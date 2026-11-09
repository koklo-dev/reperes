-- migrate:up
CREATE TABLE source (
  id serial PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  licence text,
  fetched_at timestamptz
);

CREATE TABLE regime (            -- frise du pouvoir
  id serial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('president','gouvernement','majorite')),
  label text NOT NULL,
  start_date date NOT NULL,
  end_date date,                 -- NULL = en cours
  cohabitation boolean NOT NULL DEFAULT false,
  CHECK (end_date IS NULL OR end_date > start_date)
);
CREATE INDEX regime_kind_start_idx ON regime (kind, start_date);

CREATE TABLE indicator (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  unit text NOT NULL,
  sector text NOT NULL,
  frequency text NOT NULL,
  definition_url text,
  source_id int REFERENCES source(id)
);

CREATE TABLE observation (
  indicator_id int NOT NULL REFERENCES indicator(id),
  period date NOT NULL,
  geo text NOT NULL DEFAULT 'FR',
  value numeric NOT NULL,
  series_break boolean NOT NULL DEFAULT false,
  PRIMARY KEY (indicator_id, period, geo)
);

CREATE TABLE decision (          -- lois, ordonnances, repères de contexte
  id serial PRIMARY KEY,
  decided_on date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('decision','contexte')),
  title text NOT NULL,
  sector text,
  legifrance_ref text,
  source_id int REFERENCES source(id)
);

-- migrate:down
DROP TABLE decision;
DROP TABLE observation;
DROP TABLE indicator;
DROP TABLE regime;
DROP TABLE source;
