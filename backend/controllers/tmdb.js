import { TmdbService } from '../services/tmdb.js';

export function tmdbRoutes(app) {

    app.get('/api/movies/all', async (req, res) => {
        try {
            const [popular, nowPlaying, upcoming, topRated] = await Promise.all([
                TmdbService.getPopularMovies(),
                TmdbService.getNowPlaying(),
                TmdbService.getUpcoming(),
                TmdbService.getTopRated(),
            ]);
            const all = [...popular, ...nowPlaying, ...upcoming, ...topRated];
            res.json(all);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/tv/all', async (req, res) => {
        try {
            const [popular, airing, onAir, topRated] = await Promise.all([
                TmdbService.getPopularTv(),
                TmdbService.getAiringToday(),
                TmdbService.getOnTheAir(),
                TmdbService.getTopRatedTv(),
            ]);
            const all = [...popular, ...airing, ...onAir, ...topRated];
            res.json(all);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
