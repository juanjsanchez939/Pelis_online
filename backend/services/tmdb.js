import axios from 'axios';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const TMDB = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
    28: 'Acción', 12: 'Aventura', 16: 'Animadas',
    10752: 'Bélicas', 35: 'Comedias', 27: 'Terror'
};

function mapMovie(m) {
    return {
        id: m.id,
        title: m.title,
        titleEn: m.original_title,
        category: (m.genre_ids || []).map(g => GENRE_MAP[g]).filter(Boolean),
        thumbnail: m.poster_path,
        description: m.overview,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        rating: Math.round((m.vote_average / 2) * 10) / 10,
        backdrop: m.backdrop_path,
    };
}

function mapTv(t) {
    return {
        id: t.id,
        title: t.name,
        titleEn: t.original_name,
        thumbnail: t.poster_path,
        description: t.overview,
        year: t.first_air_date ? new Date(t.first_air_date).getFullYear() : null,
        rating: Math.round((t.vote_average / 2) * 10) / 10,
        backdrop: t.backdrop_path,
    };
}

export class TmdbService {
    static async fetchPages(urlBase, pages = 5) {
        let all = [];
        for (let p = 1; p <= pages; p++) {
            const res = await axios.get(`${urlBase}&page=${p}`);
            all = all.concat(res.data.results || []);
            if (p >= (res.data.total_pages || 1)) break;
        }
        return all;
    }

    static async getPopularMovies() {
        const all = await TmdbService.fetchPages(`${TMDB}/movie/popular?api_key=${API_KEY}&language=es-ES`, 7);
        return all.map(mapMovie);
    }

    static async getNowPlaying() {
        const all = await TmdbService.fetchPages(`${TMDB}/movie/now_playing?api_key=${API_KEY}&language=es-ES`, 7);
        return all.map(mapMovie);
    }

    static async getUpcoming() {
        const all = await TmdbService.fetchPages(`${TMDB}/movie/upcoming?api_key=${API_KEY}&language=es-ES`, 7);
        return all.map(mapMovie);
    }

    static async getTopRated() {
        const all = await TmdbService.fetchPages(`${TMDB}/movie/top_rated?api_key=${API_KEY}&language=es-ES`, 7);
        return all.map(mapMovie);
    }

    static async getPopularTv() {
        const all = await TmdbService.fetchPages(`${TMDB}/tv/popular?api_key=${API_KEY}&language=es-ES`, 4);
        return all.map(mapTv);
    }

    static async getAiringToday() {
        const all = await TmdbService.fetchPages(`${TMDB}/tv/airing_today?api_key=${API_KEY}&language=es-ES`, 4);
        return all.map(mapTv);
    }

    static async getOnTheAir() {
        const all = await TmdbService.fetchPages(`${TMDB}/tv/on_the_air?api_key=${API_KEY}&language=es-ES`, 4);
        return all.map(mapTv);
    }

    static async getTopRatedTv() {
        const all = await TmdbService.fetchPages(`${TMDB}/tv/top_rated?api_key=${API_KEY}&language=es-ES`, 4);
        return all.map(mapTv);
    }
}
