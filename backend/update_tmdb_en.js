import mongoose from 'mongoose';
import axios from 'axios';
import Movie from './models/movie.js';

const API_KEY = '8d7cd14f75ff2bb827d966152a610eab';
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=`;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateTmdbWithEnglish() {
    try {
        await mongoose.connect('mongodb://localhost:27017/pelis_online');
        console.log('Conectado a MongoDB');

        const movies = await Movie.find({});
        console.log(`Procesando ${movies.length} películas...`);

        let updatedCount = 0;

        for (const movie of movies) {
            try {
                let searchTitle = movie.titleEn || movie.title;
                let url = `${SEARCH_URL}${encodeURIComponent(searchTitle)}`;
                if (movie.year) {
                    url += `&primary_release_year=${movie.year}`;
                }

                const response = await axios.get(url);
                const results = response.data.results;

                if (results && results.length > 0) {
                    const bestMatch = results[0];
                    const titleEn = bestMatch.original_title || bestMatch.title;
                    const posterPath = bestMatch.poster_path;

                    // If we got the English title from Spanish search, try again with English
                    // for better poster match
                    if (!movie.titleEn && titleEn && titleEn !== searchTitle) {
                        let enUrl = `${SEARCH_URL}${encodeURIComponent(titleEn)}`;
                        if (movie.year) {
                            enUrl += `&primary_release_year=${movie.year}`;
                        }
                        try {
                            const enResponse = await axios.get(enUrl);
                            const enResults = enResponse.data.results;
                            if (enResults && enResults.length > 0) {
                                const enMatch = enResults[0];
                                await Movie.findByIdAndUpdate(movie._id, {
                                    titleEn: titleEn,
                                    tmdbId: enMatch.id,
                                    thumbnail: enMatch.poster_path || posterPath
                                });
                            } else {
                                await Movie.findByIdAndUpdate(movie._id, {
                                    titleEn: titleEn,
                                    tmdbId: bestMatch.id,
                                    thumbnail: posterPath || movie.thumbnail
                                });
                            }
                        } catch {
                            await Movie.findByIdAndUpdate(movie._id, {
                                titleEn: titleEn,
                                tmdbId: bestMatch.id,
                                thumbnail: posterPath || movie.thumbnail
                            });
                        }
                    } else {
                        await Movie.findByIdAndUpdate(movie._id, {
                            titleEn: titleEn || movie.titleEn,
                            tmdbId: bestMatch.id,
                            thumbnail: posterPath || movie.thumbnail
                        });
                    }

                    updatedCount++;
                    console.log(`✅ ${movie.title} -> EN: ${titleEn} | Poster: ${posterPath}`);
                } else {
                    console.log(`❌ No encontrado: ${movie.title} (${movie.year})`);
                }

                await delay(250);
            } catch (error) {
                console.error(`Error: ${movie.title}:`, error.message);
            }
        }

        console.log(`\n${updatedCount}/${movies.length} películas actualizadas.`);
    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await mongoose.connection.close();
    }
}

updateTmdbWithEnglish();
