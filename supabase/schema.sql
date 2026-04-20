-- ============================================================
-- Casa Seis Inmobiliaria — Supabase Schema v2
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Properties ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 3 AND 150),
  slug        TEXT        NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT        NOT NULL DEFAULT '',
  price       NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  location    TEXT        NOT NULL DEFAULT '',
  address     TEXT        NOT NULL DEFAULT '',
  city        TEXT        NOT NULL DEFAULT '',
  state       TEXT        NOT NULL DEFAULT '',
  latitude    DOUBLE PRECISION CHECK (latitude BETWEEN -90 AND 90),
  longitude   DOUBLE PRECISION CHECK (longitude BETWEEN -180 AND 180),
  type        TEXT        NOT NULL DEFAULT 'sale'
                          CHECK (type IN ('sale', 'rent')),
  status      TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'sold', 'rented', 'inactive')),
  bedrooms    INTEGER     NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms   INTEGER     NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  area        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (area >= 0),
  parking     INTEGER     NOT NULL DEFAULT 0 CHECK (parking >= 0),
  featured    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Images ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS images (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url   TEXT        NOT NULL CHECK (image_url ~* '^https?://'),
  alt_text    TEXT,
  "order"     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_properties_slug     ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status   ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type     ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_city     ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price    ON properties(price);
CREATE INDEX IF NOT EXISTS idx_images_property_id  ON images(property_id);
-- Composite for the most common filter combo
CREATE INDEX IF NOT EXISTS idx_properties_status_type
  ON properties(status, type);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE images     ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (idempotent)
DROP POLICY IF EXISTS "public_read_active_properties" ON properties;
DROP POLICY IF EXISTS "public_read_images"            ON images;
DROP POLICY IF EXISTS "admin_all_properties"          ON properties;
DROP POLICY IF EXISTS "admin_all_images"              ON images;

CREATE POLICY "public_read_active_properties"
  ON properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "public_read_images"
  ON images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = images.property_id AND p.status = 'active'
    )
  );

CREATE POLICY "admin_all_properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_all_images"
  ON images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Storage bucket ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,   -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "public_read_storage"  ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_storage" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_storage" ON storage.objects;

CREATE POLICY "public_read_storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "admin_upload_storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "admin_delete_storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- ── Seed data ────────────────────────────────────────────────
-- ⚠️  COMENTA LAS LÍNEAS SIGUIENTES ANTES DE CORRER EN PRODUCCIÓN.
-- Este bloque solo existe para tener datos de prueba en desarrollo.
-- Si corres este archivo completo en una DB de producción, se insertan
-- 3 propiedades ficticias con ON CONFLICT DO NOTHING (no rompe, pero
-- llena tu catálogo con datos falsos).
-- Para saltarlo, rodea el INSERT de abajo con un comentario multilínea:
--   /*  INSERT INTO properties ...  */
INSERT INTO properties (
  title, slug, description, price, location, address, city, state,
  latitude, longitude, type, status, bedrooms, bathrooms, area, parking, featured
) VALUES
(
  'Casa Contemporánea en Zona Dorada',
  'casa-contemporanea-zona-dorada',
  'Espectacular residencia de diseño contemporáneo ubicada en la exclusiva Zona Dorada. Cuenta con acabados de primera, amplios espacios y jardín privado. La cocina está equipada con electrodomésticos de acero inoxidable y cubierta de granito.',
  4500000, 'Los Mochis, Sinaloa', 'Blvd. Macario Gaxiola 1250',
  'Los Mochis', 'Sinaloa', 25.7910, -108.9870, 'sale', 'active', 4, 3, 280, 2, true
),
(
  'Departamento de Lujo Vista al Mar',
  'departamento-lujo-vista-mar',
  'Exclusivo departamento de lujo con impresionantes vistas al mar. Diseño minimalista con materiales de alta calidad, pisos de mármol y cocina italiana.',
  2800000, 'Mazatlán, Sinaloa', 'Av. del Mar 456, Torre Azul',
  'Mazatlán', 'Sinaloa', 23.2494, -106.4111, 'sale', 'active', 2, 2, 140, 1, true
),
(
  'Casa Residencial para Renta',
  'casa-residencial-renta-fracc',
  'Hermosa casa en fraccionamiento privado con seguridad las 24 horas. Cuenta con sala, comedor, cocina integral, cuarto de lavado, terraza y jardín.',
  18000, 'Los Mochis, Sinaloa', 'Fracc. Las Fuentes, Privada Girasol 23',
  'Los Mochis', 'Sinaloa', 25.7990, -108.9810, 'rent', 'active', 3, 2, 200, 2, false
)
ON CONFLICT (slug) DO NOTHING;
