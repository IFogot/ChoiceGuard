CREATE TABLE IF NOT EXISTS schema_migrations (
  migration_id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  source_key TEXT NOT NULL CHECK (char_length(source_key) BETWEEN 1 AND 96),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  relationship TEXT CHECK (relationship IS NULL OR char_length(relationship) <= 80),
  age SMALLINT CHECK (age IS NULL OR age BETWEEN 0 AND 130),
  tag TEXT CHECK (tag IS NULL OR char_length(tag) <= 160),
  avatar_icon TEXT CHECK (avatar_icon IS NULL OR char_length(avatar_icon) <= 32),
  health_condition TEXT NOT NULL CHECK (health_condition IN ('hypertension', 'diabetes', 'dyslipidemia', 'elderly', 'general')),
  daily_budget JSONB NOT NULL,
  daily_consumed JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(household_id, source_key)
);

CREATE INDEX IF NOT EXISTS health_profiles_household_id_idx ON health_profiles(household_id);

CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES health_profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL CHECK (char_length(product_id) <= 96),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  portion NUMERIC(4,2) NOT NULL CHECK (portion >= 0.25 AND portion <= 4),
  broth_percent SMALLINT CHECK (broth_percent IS NULL OR broth_percent BETWEEN 0 AND 100),
  nutrition JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS meal_logs_profile_created_at_idx ON meal_logs(profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS grocery_plan_items (
  id UUID PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL CHECK (char_length(product_id) <= 96),
  original_product_id TEXT CHECK (original_product_id IS NULL OR char_length(original_product_id) <= 96),
  quantity SMALLINT NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 99),
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS grocery_plan_items_household_id_idx ON grocery_plan_items(household_id);

CREATE TABLE IF NOT EXISTS recall_notices (
  id UUID PRIMARY KEY,
  product_id TEXT NOT NULL CHECK (char_length(product_id) <= 96),
  product_name TEXT NOT NULL CHECK (char_length(product_name) <= 200),
  affected_lot_codes TEXT[] NOT NULL,
  recall_level TEXT NOT NULL CHECK (recall_level IN ('Class I', 'Class II', 'Class III')),
  hazard_description TEXT NOT NULL CHECK (char_length(hazard_description) <= 2000),
  hazard_reason TEXT NOT NULL CHECK (hazard_reason IN ('microbial', 'chemical', 'physical', 'undeclared_allergen')),
  published_date DATE NOT NULL,
  authorizing_agency TEXT NOT NULL CHECK (char_length(authorizing_agency) <= 160),
  action_required TEXT NOT NULL CHECK (char_length(action_required) <= 2000),
  source_url TEXT CHECK (source_url IS NULL OR char_length(source_url) <= 2048),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL CHECK (char_length(product_id) <= 96),
  lot_code TEXT NOT NULL CHECK (char_length(lot_code) BETWEEN 1 AND 128),
  expiry_date DATE NOT NULL,
  quantity SMALLINT NOT NULL CHECK (quantity BETWEEN 1 AND 99),
  recall_status TEXT NOT NULL DEFAULT 'safe' CHECK (recall_status IN ('safe', 'monitoring', 'recalled')),
  active_recall_id UUID REFERENCES recall_notices(id) ON DELETE SET NULL,
  confirmed_handled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(household_id, product_id, lot_code)
);

CREATE INDEX IF NOT EXISTS pantry_items_household_id_idx ON pantry_items(household_id);

CREATE TABLE IF NOT EXISTS recall_actions (
  id UUID PRIMARY KEY,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  pantry_item_id UUID NOT NULL REFERENCES pantry_items(id) ON DELETE CASCADE,
  recall_notice_id UUID NOT NULL REFERENCES recall_notices(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('viewed', 'handled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recall_actions_household_created_at_idx ON recall_actions(household_id, created_at DESC);
