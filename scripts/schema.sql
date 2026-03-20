-- MoroVerse Infinite Protocol: Supabase Schema

--- {city, foundation, history, year, etc}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Articles/Posts (Deep Content)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY, -- usually matches heritage_item.id or slug
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL,
    category TEXT,
    metaDescription JSONB,
    intro JSONB,
    sections JSONB, -- Array of {title 1. Heritage Items (The Atlas)
, content}
    conclusion JSONB,
    generatedImage TEXT,
    isPending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS and Policies (Simplified for now)
ALTER TABLE heritage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON heritage_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON articles FOR SELECT USING (true);
CREATE TABLE IF NOT EXISTS heritage_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name JSONB NOT NULL, -- {ar: string, en: string}
    description JSONB, -- {ar: string, en: string}
    imageUrl TEXT,
    modelUrl TEXT,
    audioUrl TEXT,
    videoUrl TEXT,
    seo JSONB, -- {metaTitle, metaDescription, slug, altText}
    metadata JSONB, -