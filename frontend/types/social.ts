export interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    website: string | null;
    is_admin: boolean;
    trust_score: number;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    user_id: string;
    content: string; // Used for "Full Article"
    summary?: string; // Used for "Quick Summary"
    image_url: string | null;
    model_url?: string | null;
    video_url?: string | null;
    gallery?: string[] | null;
    location_name: string | null;
    location_type: 'geography' | 'heritage' | 'chronicles' | 'biographies' | 'tourism' | 'monument' | 'city' | 'hidden_gem' | string;
    lat: number | null;
    lng: number | null;
    likes_count: number;
    created_at: string;
    profiles?: Profile;
    
    // Additional Dynamic Dashboard Fields
    slug?: string;
    year?: string;
    era?: string;
    dynasty?: string;
    city?: string; // Appears in biography and heritage
    field?: string; // Appears in biographies
    notable_works?: string;
    combatants?: string;
    leaders?: string;
    outcome?: string;
    tactics?: string;
    impact?: string;
    activities?: string[]; // Appears in tourism
    best_time?: string; // Appears in tourism
}

export interface ViewportBounds {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
}
