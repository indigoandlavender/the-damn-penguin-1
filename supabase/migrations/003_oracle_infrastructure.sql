-- The Morocco Oracle: Infrastructure & Market Intelligence
-- Migration 003: 2030 World Cup Infrastructure + Heat Map Data

-- =============================================================================
-- INFRASTRUCTURE TYPES
-- =============================================================================

CREATE TYPE infrastructure_type AS ENUM (
  'stadium',
  'tgv_station',
  'tgv_line',
  'airport',
  'dam',
  'solar_plant',
  'wind_farm',
  'desalination',
  'port'
);

CREATE TYPE infrastructure_status AS ENUM (
  'operational',
  'under_construction',
  'planned',
  'announced'
);

CREATE TYPE development_status AS ENUM (
  'confirmed',
  'under_construction',
  'planned',
  'rumored'
);

-- =============================================================================
-- INFRASTRUCTURE TABLE
-- =============================================================================

CREATE TABLE infrastructure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name VARCHAR(200) NOT NULL,
  name_ar VARCHAR(200),
  type infrastructure_type NOT NULL,
  
  -- Location
  location geography(POINT, 4326) NOT NULL,
  region investment_region,
  city city_classification,
  
  -- Attributes
  status infrastructure_status NOT NULL DEFAULT 'planned',
  completion_date DATE,
  capacity VARCHAR(100), -- "115,000 seats", "350 MW", "2.5M passengers/year"
  
  -- 2030 World Cup specific
  is_world_cup_venue BOOLEAN DEFAULT false,
  fifa_tier VARCHAR(50), -- "Primary", "Secondary"
  
  -- Metadata
  source_url TEXT,
  source_date DATE,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- TGV LINES (LineString geometry for routes)
-- =============================================================================

CREATE TABLE tgv_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(200) NOT NULL,
  route geography(LINESTRING, 4326) NOT NULL,
  
  status infrastructure_status NOT NULL DEFAULT 'planned',
  length_km NUMERIC(6,1),
  max_speed_kmh INTEGER,
  
  start_station UUID REFERENCES infrastructure(id),
  end_station UUID REFERENCES infrastructure(id),
  
  completion_date DATE,
  source_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- DEVELOPMENT PIPELINE (Hotels, Resorts, Mixed-Use)
-- =============================================================================

CREATE TABLE developments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name VARCHAR(200) NOT NULL,
  developer VARCHAR(200),
  brand VARCHAR(100), -- "Marriott", "Four Seasons", "Accor"
  
  -- Location
  location geography(POINT, 4326),
  region investment_region,
  city city_classification,
  neighborhood VARCHAR(100),
  
  -- Project Details
  status development_status NOT NULL DEFAULT 'rumored',
  property_type VARCHAR(50), -- "Hotel", "Resort", "Mixed-Use", "Riad Collection"
  keys INTEGER, -- Number of rooms/units
  investment_mad NUMERIC(15,2),
  
  -- Timeline
  announced_date DATE,
  construction_start DATE,
  expected_opening DATE,
  
  -- Verification
  confidence_pct INTEGER CHECK (confidence_pct >= 0 AND confidence_pct <= 100),
  source_url TEXT,
  source_type VARCHAR(50), -- "press_release", "government", "industry_chatter", "satellite"
  last_verified DATE,
  
  -- 2030 Proximity (calculated)
  nearest_stadium_km NUMERIC(6,2),
  nearest_tgv_km NUMERIC(6,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- MARKET HEAT DATA (Aggregated by region/time)
-- =============================================================================

CREATE TABLE market_heat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Location granularity
  region investment_region NOT NULL,
  city city_classification,
  commune VARCHAR(100),
  
  -- Time period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  transaction_count INTEGER,
  avg_price_sqm_mad NUMERIC(10,2),
  price_change_pct NUMERIC(5,2), -- vs previous period
  
  foreign_buyer_pct NUMERIC(5,2),
  listing_count INTEGER,
  days_on_market_avg NUMERIC(5,1),
  
  -- Heat score (0-100, calculated)
  heat_score NUMERIC(5,2),
  
  -- Source
  data_source VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- MARKET SIGNALS (Real-time events)
-- =============================================================================

CREATE TYPE signal_type AS ENUM (
  'price_drop',
  'price_surge',
  'listing_surge',
  'listing_drought',
  'sentiment_shift',
  'government_tender',
  'development_announced',
  'infrastructure_milestone'
);

CREATE TYPE signal_severity AS ENUM (
  'info',
  'notable',
  'significant',
  'critical'
);

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  type signal_type NOT NULL,
  severity signal_severity NOT NULL DEFAULT 'info',
  
  -- Location
  region investment_region,
  city city_classification,
  
  -- Content
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Metrics
  metric_value NUMERIC(15,2),
  metric_unit VARCHAR(50),
  metric_change_pct NUMERIC(5,2),
  
  -- Source
  source_url TEXT,
  
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_infrastructure_type ON infrastructure (type);
CREATE INDEX idx_infrastructure_location ON infrastructure USING GIST (location);
CREATE INDEX idx_infrastructure_world_cup ON infrastructure (is_world_cup_venue) WHERE is_world_cup_venue = true;

CREATE INDEX idx_tgv_routes_route ON tgv_routes USING GIST (route);

CREATE INDEX idx_developments_status ON developments (status);
CREATE INDEX idx_developments_location ON developments USING GIST (location);
CREATE INDEX idx_developments_brand ON developments (brand);
CREATE INDEX idx_developments_opening ON developments (expected_opening);

CREATE INDEX idx_market_heat_region_period ON market_heat (region, period_start, period_end);
CREATE INDEX idx_market_heat_city ON market_heat (city);

CREATE INDEX idx_signals_type ON signals (type);
CREATE INDEX idx_signals_detected ON signals (detected_at DESC);
CREATE INDEX idx_signals_region ON signals (region);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE tgv_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_heat ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Public read access for Oracle data
CREATE POLICY "Public read access for infrastructure" ON infrastructure FOR SELECT USING (true);
CREATE POLICY "Public read access for tgv_routes" ON tgv_routes FOR SELECT USING (true);
CREATE POLICY "Public read access for developments" ON developments FOR SELECT USING (true);
CREATE POLICY "Public read access for market_heat" ON market_heat FOR SELECT USING (true);
CREATE POLICY "Public read access for signals" ON signals FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated insert for infrastructure" ON infrastructure FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated insert for developments" ON developments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated insert for market_heat" ON market_heat FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated insert for signals" ON signals FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================================================
-- SEED DATA: 2030 World Cup Stadiums
-- =============================================================================

INSERT INTO infrastructure (name, name_ar, type, location, region, city, status, completion_date, capacity, is_world_cup_venue, fifa_tier, source_url) VALUES
-- Grand Stade Hassan II (New) - Casablanca
('Grand Stade Hassan II', 'الملعب الكبير الحسن الثاني', 'stadium', 
 ST_SetSRID(ST_MakePoint(-7.5898, 33.5731), 4326)::geography,
 'Casablanca-Settat', 'Casablanca', 'under_construction', '2028-11-01',
 '115,000 seats', true, 'Primary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'),

-- Stade Mohammed V (Renovation) - Casablanca  
('Stade Mohammed V', 'ملعب محمد الخامس', 'stadium',
 ST_SetSRID(ST_MakePoint(-7.6192, 33.5883), 4326)::geography,
 'Casablanca-Settat', 'Casablanca', 'under_construction', '2028-06-01',
 '67,000 seats', true, 'Secondary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'),

-- Grand Stade de Marrakech (New)
('Grand Stade de Marrakech', 'الملعب الكبير بمراكش', 'stadium',
 ST_SetSRID(ST_MakePoint(-8.0511, 31.6667), 4326)::geography,
 'Marrakech-Safi', 'Marrakech', 'under_construction', '2028-09-01',
 '70,000 seats', true, 'Primary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'),

-- Stade de Rabat (New)
('Grand Stade de Rabat', 'الملعب الكبير بالرباط', 'stadium',
 ST_SetSRID(ST_MakePoint(-6.8498, 34.0209), 4326)::geography,
 'Rabat-Sale-Kenitra', 'Rabat', 'planned', '2029-03-01',
 '70,000 seats', true, 'Primary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'),

-- Stade de Tanger (Expansion)
('Grand Stade Ibn Batouta', 'ملعب ابن بطوطة الكبير', 'stadium',
 ST_SetSRID(ST_MakePoint(-5.8326, 35.7595), 4326)::geography,
 'Tanger-Tetouan', 'Tangier', 'under_construction', '2028-06-01',
 '68,000 seats', true, 'Primary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026'),

-- Stade d'Agadir (Expansion)
('Stade Adrar', 'ملعب أدرار', 'stadium',
 ST_SetSRID(ST_MakePoint(-9.5981, 30.4278), 4326)::geography,
 'Souss-Massa', 'Agadir', 'under_construction', '2028-06-01',
 '50,000 seats', true, 'Secondary',
 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026');

-- =============================================================================
-- SEED DATA: TGV Stations
-- =============================================================================

INSERT INTO infrastructure (name, type, location, region, city, status, completion_date, capacity) VALUES
('Gare Casa-Voyageurs LGV', 'tgv_station', 
 ST_SetSRID(ST_MakePoint(-7.6114, 33.5897), 4326)::geography,
 'Casablanca-Settat', 'Casablanca', 'operational', '2018-11-15', '10M passengers/year'),

('Gare Rabat-Agdal LGV', 'tgv_station',
 ST_SetSRID(ST_MakePoint(-6.8456, 33.9911), 4326)::geography,
 'Rabat-Sale-Kenitra', 'Rabat', 'operational', '2018-11-15', '6M passengers/year'),

('Gare Tanger-Ville LGV', 'tgv_station',
 ST_SetSRID(ST_MakePoint(-5.8128, 35.7847), 4326)::geography,
 'Tanger-Tetouan', 'Tangier', 'operational', '2018-11-15', '5M passengers/year'),

('Gare Kénitra LGV', 'tgv_station',
 ST_SetSRID(ST_MakePoint(-6.5802, 34.2610), 4326)::geography,
 'Rabat-Sale-Kenitra', NULL, 'operational', '2018-11-15', '3M passengers/year'),

('Gare Marrakech LGV', 'tgv_station',
 ST_SetSRID(ST_MakePoint(-7.9956, 31.6342), 4326)::geography,
 'Marrakech-Safi', 'Marrakech', 'planned', '2029-06-01', '8M passengers/year');

-- =============================================================================
-- SEED DATA: Energy Infrastructure
-- =============================================================================

INSERT INTO infrastructure (name, type, location, region, status, completion_date, capacity, source_url) VALUES
-- Noor-Ouarzazate Solar Complex
('Noor-Ouarzazate Solar Complex', 'solar_plant',
 ST_SetSRID(ST_MakePoint(-6.8600, 31.0500), 4326)::geography,
 'Draa-Tafilalet', 'operational', '2018-01-01', '580 MW',
 'https://www.masen.ma/en/projects/noor-ouarzazate'),

-- Tarfaya Wind Farm
('Tarfaya Wind Farm', 'wind_farm',
 ST_SetSRID(ST_MakePoint(-12.9333, 27.9500), 4326)::geography,
 'Other', 'operational', '2014-12-01', '301 MW',
 'https://www.nareva.ma/en/projects/tarfaya'),

-- Midelt Wind Farm
('Midelt Wind Farm', 'wind_farm',
 ST_SetSRID(ST_MakePoint(-4.7500, 32.6833), 4326)::geography,
 'Draa-Tafilalet', 'under_construction', '2026-06-01', '180 MW',
 NULL),

-- Al Hoceima Desalination
('Al Hoceima Desalination Plant', 'desalination',
 ST_SetSRID(ST_MakePoint(-3.9314, 35.2517), 4326)::geography,
 'Other', 'operational', '2021-01-01', '50,000 m³/day',
 NULL);

-- =============================================================================
-- SEED DATA: Sample Developments
-- =============================================================================

INSERT INTO developments (name, developer, brand, location, region, city, status, property_type, keys, expected_opening, confidence_pct, source_type) VALUES
('Four Seasons Rabat', 'ONA Group', 'Four Seasons',
 ST_SetSRID(ST_MakePoint(-6.8378, 34.0181), 4326)::geography,
 'Rabat-Sale-Kenitra', 'Rabat', 'under_construction', 'Resort', 200, '2027-06-01', 95, 'press_release'),

('Marriott Tangier City Center', 'MDI Group', 'Marriott',
 ST_SetSRID(ST_MakePoint(-5.8100, 35.7800), 4326)::geography,
 'Tanger-Tetouan', 'Tangier', 'confirmed', 'Hotel', 180, '2028-03-01', 90, 'press_release'),

('Aman Dakhla', 'Aman Resorts', 'Aman',
 ST_SetSRID(ST_MakePoint(-15.9320, 23.7145), 4326)::geography,
 'Other', NULL, 'rumored', 'Resort', 40, '2029-01-01', 45, 'industry_chatter'),

('Accor Lifestyle Essaouira', 'Accor', 'Accor',
 ST_SetSRID(ST_MakePoint(-9.7690, 31.5125), 4326)::geography,
 'Marrakech-Safi', 'Essaouira', 'planned', 'Hotel', 120, '2028-09-01', 75, 'government');

-- =============================================================================
-- FUNCTION: Calculate 2030 Proximity Score
-- =============================================================================

CREATE OR REPLACE FUNCTION calculate_2030_proximity(
  p_location geography
) RETURNS TABLE (
  nearest_stadium_name VARCHAR,
  nearest_stadium_km NUMERIC,
  nearest_tgv_name VARCHAR,
  nearest_tgv_km NUMERIC,
  proximity_score INTEGER
) AS $$
DECLARE
  v_stadium_dist NUMERIC;
  v_stadium_name VARCHAR;
  v_tgv_dist NUMERIC;
  v_tgv_name VARCHAR;
  v_score INTEGER;
BEGIN
  -- Find nearest World Cup stadium
  SELECT 
    i.name,
    ST_Distance(i.location, p_location) / 1000
  INTO v_stadium_name, v_stadium_dist
  FROM infrastructure i
  WHERE i.is_world_cup_venue = true
  ORDER BY ST_Distance(i.location, p_location)
  LIMIT 1;
  
  -- Find nearest TGV station
  SELECT 
    i.name,
    ST_Distance(i.location, p_location) / 1000
  INTO v_tgv_name, v_tgv_dist
  FROM infrastructure i
  WHERE i.type = 'tgv_station'
  ORDER BY ST_Distance(i.location, p_location)
  LIMIT 1;
  
  -- Calculate score (0-100)
  -- Closer = higher score
  v_score := GREATEST(0, LEAST(100, 
    100 - (COALESCE(v_stadium_dist, 100) * 0.5) - (COALESCE(v_tgv_dist, 100) * 0.3)
  ))::INTEGER;
  
  RETURN QUERY SELECT v_stadium_name, v_stadium_dist, v_tgv_name, v_tgv_dist, v_score;
END;
$$ LANGUAGE plpgsql;
