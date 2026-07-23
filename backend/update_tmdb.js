import mongoose from 'mongoose';
import axios from 'axios';
import Movie from './models/movie.js';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=`;

async function updateTmdbIds() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pelis_online');
        console.log('Conectado a MongoDB');

        const movies = await Movie.find({});
        console.log(`Buscando IDs para ${movies.length} películas...`);

        let updatedCount = 0;

        for (const movie of movies) {
            try {
                let url = `${SEARCH_URL}${encodeURIComponent(movie.title)}`;
                if (movie.year) {
                    url += `&primary_release_year=${movie.year}`;
                }

                const response = await axios.get(url);
                const results = response.data.results;

                if (results && results.length > 0) {
                    const bestMatch = results[0];
                    const tmdbId = bestMatch.id;
                    const posterPath = bestMatch.poster_path;

                    await Movie.findByIdAndUpdate(movie._id, {
                        tmdbId: tmdbId,
                        thumbnail: posterPath || movie.thumbnail
                    });
                    updatedCount++;
                    console.log(`✅ ${movie.title} (${movie.year}) -> ID: ${tmdbId}`);
                } else {
                    console.log(`❌ No se encontró coincidencia para: ${movie.title} (${movie.year})`);
                }
            } catch (error) {
                console.error(`Error buscando ${movie.title}:`, error.message);
            }
        }

        console.log(`\nMigración completada. ${updatedCount}/${movies.length} películas actualizadas.`);
    } catch (error) {
        console.error('Error general en la migración:', error);
    } finally {
        await mongoose.connection.close();
    }
}

updateTmdbIds();
