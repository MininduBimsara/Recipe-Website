-- =====================================================================
-- PEBBLEPLATE - SUPABASE DATABASE SCHEMA AND ACCESS CONTROL DEFINITIONS
-- Designated Admin User ID: c7fdab45-32f0-4b92-8d21-6fe025e431d7
-- =====================================================================

-- Enable extensions if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------
-- 1. RECIPES TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    category TEXT,
    cuisine TEXT,
    difficulty TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER DEFAULT 4,
    calories INTEGER,
    tags TEXT[],
    ingredients JSONB,
    instructions JSONB,
    chef_secrets JSONB,
    pinterest_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft',
    layout_template TEXT,
    template_images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 2. BLOG POSTS / EDITORIALS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    cover_image TEXT,
    body TEXT,
    category TEXT,
    tags TEXT[],
    reading_time_minutes INTEGER DEFAULT 5,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'draft',
    layout_template TEXT,
    template_images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 3. NEWSLETTER SUBSCRIBERS TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 4. PERFORMANCE OPTIMIZING INDEXES
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_is_published ON public.recipes(is_published);
CREATE INDEX IF NOT EXISTS idx_recipes_published_at ON public.recipes(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- -------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RECIPES POLICIES:
-- Anyone (public) can read published recipes
DROP POLICY IF EXISTS "Allow public read access for published recipes" ON public.recipes;
CREATE POLICY "Allow public read access for published recipes" 
ON public.recipes 
FOR SELECT 
USING (is_published = true);

-- Only the designated admin ID (c7fdab45-32f0-4b92-8d21-6fe025e431d7) can manage recipes (create, read all, update, delete)
DROP POLICY IF EXISTS "Allow designated admin full access to recipes" ON public.recipes;
CREATE POLICY "Allow designated admin full access to recipes" 
ON public.recipes 
FOR ALL 
TO authenticated 
USING (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid) 
WITH CHECK (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid);


-- BLOG_POSTS POLICIES:
-- Anyone (public) can read published blog posts
DROP POLICY IF EXISTS "Allow public read access for published blog posts" ON public.blog_posts;
CREATE POLICY "Allow public read access for published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- Only the designated admin ID (c7fdab45-32f0-4b92-8d21-6fe025e431d7) can manage blog posts (create, read all, update, delete)
DROP POLICY IF EXISTS "Allow designated admin full access to blog posts" ON public.blog_posts;
CREATE POLICY "Allow designated admin full access to blog posts" 
ON public.blog_posts 
FOR ALL 
TO authenticated 
USING (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid) 
WITH CHECK (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid);


-- NEWSLETTER_SUBSCRIBERS POLICIES:
-- Anyone can subscribe to the newsletter (insert access)
DROP POLICY IF EXISTS "Allow public to subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow public to subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only the designated admin ID (c7fdab45-32f0-4b92-8d21-6fe025e431d7) can view/manage subscribers
DROP POLICY IF EXISTS "Allow designated admin full access to newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow designated admin full access to newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
TO authenticated 
USING (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid) 
WITH CHECK (auth.uid() = 'c7fdab45-32f0-4b92-8d21-6fe025e431d7'::uuid);
