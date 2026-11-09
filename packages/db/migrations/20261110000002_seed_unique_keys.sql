-- migrate:up
-- Clés naturelles pour que le seed soit rejouable (upsert).
ALTER TABLE source ADD CONSTRAINT source_name_key UNIQUE (name);
ALTER TABLE regime ADD CONSTRAINT regime_kind_label_start_key UNIQUE (kind, label, start_date);

-- migrate:down
ALTER TABLE regime DROP CONSTRAINT regime_kind_label_start_key;
ALTER TABLE source DROP CONSTRAINT source_name_key;
