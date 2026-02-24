/**
 * MoroVerse — Drizzle ORM Schema (PostgreSQL)
 * All tables for the MoroVerse platform
 * Author: Mohamed Amine El Amiri
 */

const {
    pgTable,
    serial,
    text,
    varchar,
    boolean,
    timestamp,
    integer,
    real,
    jsonb,
} = require('drizzle-orm/pg-core');

// ─── Blog Posts ───────────────────────────────────────────────────────────────
const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 512 }).notNull(),
    slug: varchar('slug', { length: 512 }).notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    category: varchar('category', { length: 100 }).default('blog'), // blog | biography | history
    tags: jsonb('tags').default([]),
    published: boolean('published').default(false),
    authorName: varchar('author_name', { length: 255 }).default('Mohamed Amine El Amiri'),
    seals: jsonb('seals').default([]),   // hidden artifact hunt seals
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Map Pins ─────────────────────────────────────────────────────────────────
const mapPins = pgTable('map_pins', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 512 }).notNull(),
    description: text('description'),
    lat: real('lat').notNull(),
    lng: real('lng').notNull(),
    type: varchar('type', { length: 100 }).notNull(), // hotel | landmark | battle | dynasty-capital | sacred
    mode: varchar('mode', { length: 20 }).default('modern'), // modern | ancient
    dynasty: varchar('dynasty', { length: 255 }),                // Almoravid | Almohad | Saadi | Alaoui…
    yearStart: integer('year_start'),
    yearEnd: integer('year_end'),
    imageUrl: text('image_url'),
    externalUrl: text('external_url'),
    weather: boolean('weather').default(false), // show live weather widget
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Audio Clips ──────────────────────────────────────────────────────────────
const audioClips = pgTable('audio_clips', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    region: varchar('region', { length: 100 }).notNull(), // marrakech | tangier | fes | agadir | sahara
    genre: varchar('genre', { length: 100 }),            // gnawa | andalusian | chaabi | berbere
    filePath: text('file_path').notNull(),
    duration: integer('duration'),        // seconds
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Cultural Figures ─────────────────────────────────────────────────────────
const culturalFigures = pgTable('cultural_figures', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(), // king | hero | scholar
    era: varchar('era', { length: 255 }),
    birthYear: integer('birth_year'),
    deathYear: integer('death_year'),
    portrait: text('portrait'),
    biography: text('biography'),
    facts: jsonb('facts').default([]),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Artifact Hunt Unlockables ────────────────────────────────────────────────
const artifacts = pgTable('artifacts', {
    id: serial('id').primaryKey(),
    sealCode: varchar('seal_code', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 512 }).notNull(),
    imageUrl: text('image_url').notNull(), // 4K Moroccan visual URL
    description: text('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

// ─── Generated Itineraries ────────────────────────────────────────────────────
const itineraries = pgTable('itineraries', {
    id: serial('id').primaryKey(),
    userEmail: varchar('user_email', { length: 255 }),
    cities: jsonb('cities').default([]),
    content: text('content').notNull(),
    pdfPath: text('pdf_path'),
    createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { posts, mapPins, audioClips, culturalFigures, artifacts, itineraries };
