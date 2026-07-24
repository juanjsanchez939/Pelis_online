import { TmdbService } from '../services/tmdb.js';

export function tmdbRoutes(app) {
    app.get('/api/movies/popular', async (req, res) => {
        const data = await TmdbService.getPopularMovies();
        res.json(data);
    });

    app.get('/api/movies/now-playing', async (req, res) => {
        const data = await TmdbService.getNowPlaying();
        res.json(data);
    });

    app.get('/api/movies/upcoming', async (req, res) => {
        const data = await TmdbService.getUpcoming();
        res.json(data);
    });

    app.get('/api/movies/top-rated', async (req, res) => {
        const data = await TmdbService.getTopRated();
        res.json(data);
    });

    app.get('/api/tv/popular', async (req, res) => {
        const data = await TmdbService.getPopularTv();
        res.json(data);
    });

    app.get('/api/tv/airing-today', async (req, res) => {
        const data = await TmdbService.getAiringToday();
        res.json(data);
    });

    app.get('/api/tv/on-the-air', async (req, res) => {
        const data = await TmdbService.getOnTheAir();
        res.json(data);
    });

    app.get('/api/tv/top-rated', async (req, res) => {
        const data = await TmdbService.getTopRatedTv();
        res.json(data);
    });
}
