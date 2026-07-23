import mongoose from 'mongoose';
import axios from 'axios';
import Movie from './models/movie.js';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const TMDB_BASE = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animadas',
    10752: 'Bélicas',
    35: 'Comedias',
    27: 'Terror'
};

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getMovieCredits(movieId) {
    const res = await axios.get(
        `${TMDB_BASE}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-ES`
    );
    return res.data;
}

async function getMovieDetails(movieId) {
    const res = await axios.get(
        `${TMDB_BASE}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=videos`
    );
    return res.data;
}

async function addMovies() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pelis_online');
        console.log('Conectado a MongoDB\n');

        const years = [2025, 2026];
        const genres = Object.entries(GENRE_MAP);
        let totalAdded = 0;

        for (const [tmdbGenreId, ourGenre] of genres) {
            for (const year of years) {
                console.log(`\n=== Buscando ${ourGenre} (${year}) ===`);

                const discoverUrl = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${tmdbGenreId}&primary_release_year=${year}&sort_by=popularity.desc&page=1`;
                const discoverRes = await axios.get(discoverUrl);

                const movies = discoverRes.data.results.slice(0, 5);

                for (const m of movies) {
                    await delay(300);

                    try {
                        const details = await getMovieDetails(m.id);
                        await delay(300);
                        let credits = null;
                        try {
                            credits = await getMovieCredits(m.id);
                        } catch {}

                        const titleEn = m.original_title || m.title;
                        const titleEs = details.title || m.title;

                        const director = credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
                        const cast = credits?.cast?.slice(0, 5).map(c => c.name) || [];

                        const trailer = details.videos?.results?.find(
                            v => v.type === 'Trailer' && v.site === 'YouTube'
                        );

                        const movieDoc = {
                            title: titleEs,
                            titleEn: titleEn,
                            category: [ourGenre],
                            thumbnail: m.poster_path || null,
                            description: details.overview || 'Sin descripción disponible.',
                            year: year,
                            director: director,
                            duration: details.runtime ? `${details.runtime} min` : 'TBA',
                            rating: Math.round((m.vote_average / 2) * 10) / 10,
                            cast: cast,
                            trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                            tmdbId: m.id,
                            comments: []
                        };

                        const existing = await Movie.findOne({ tmdbId: m.id });
                        if (existing) {
                            console.log(`  ⏭️ Ya existe: ${titleEs}`);
                            continue;
                        }

                        const newMovie = new Movie(movieDoc);
                        await newMovie.save();
                        totalAdded++;
                        console.log(`  ✅ ${titleEs}`);
                    } catch (err) {
                        console.log(`  ❌ Error con ${m.title}: ${err.message}`);
                    }
                }
            }
        }

        console.log(`\n\n🎉 Total películas agregadas: ${totalAdded}`);
    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await mongoose.connection.close();
    }
}

addMovies();
