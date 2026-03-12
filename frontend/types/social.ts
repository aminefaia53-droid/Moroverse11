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
    content: string;
    image_url: string | null;
    location_name: string | null;
    location_type: 'monument' | 'city' | 'hidden_gem';
    lat: number | null;
    lng: number | null;
    likes_count: number;
    created_at: string;
    profiles?: Profile;
}

export interface ViewportBounds {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
}
