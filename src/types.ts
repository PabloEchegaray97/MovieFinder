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

export interface HomeProps {
    searchResults: MovieItem[] | Actor[];
    searchType: string;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void; // Cambiado para aceptar el número de página directamente
    isLoading: boolean; // Nuevo prop para manejar el estado de carga
    selectedGenre?: string; // Nuevo prop para el género seleccionado
}
export interface MainContainerProps {
    navbarHeight: number;
    children: React.ReactNode;
}

export interface MovieProps {
    posterPath: string | null;
    title: string;
}
//moviedetails


export interface Genre {
    id: number;
    name: string;
}


export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface MovieDetailsData {
    title: string;
    original_title: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    release_date: string;
    genres: Genre[];
    runtime: number;
    certification: string;
    tagline: string;
    production_companies: ProductionCompany[];
    vote_average: number;
    vote_count: number;
    budget: number;
    revenue: number;
    original_language: string;
    popularity: number;
    adult: boolean;
    spoken_languages: { iso_639_1: string; name: string }[];
    production_countries: { iso_3166_1: string; name: string }[];
}
export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
}
export interface RelatedMovie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
}

export interface Video {
    key: string;
    name: string;
    site: string;
    type: string;
}
export interface Provider {
    display_priority: number;
    logo_path: string;
    provider_name: string;
    provider_id: number;
}

export interface ProvidersData {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
}

export interface NavBarProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    setNavbarHeight: (height: number) => void;
    onSearch: (type: string, query: string) => void;
}
export interface Person {
    id: number;
    name: string;
    profile_path: string | null;
}
