export interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
}

export interface MovieItem {
    poster_path: string | null;
    title: string;
    overview: string;
    id: number;
}

