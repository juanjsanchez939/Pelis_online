
import { MovieService } from '../services/movie.js';
import { checkForRole } from '../middlewares/authorization_middleware.js';

export function movie(app) {
  app.get(
    '/movies',
    async (req, res) => {
      const query = req.query;
      const movies = await MovieService.get(query);
      res.send(movies);
    }
  );

  app.get(
    '/movies/:id',
    async (req, res) => {
      const movie = await MovieService.getById(req.params.id);
      if (!movie) return res.status(404).send({ error: 'Película no encontrada' });
      res.send(movie);
    }
  );

  app.post(
    '/movies',
    checkForRole('admin'),
    async (req, res) => {
      const movie = await MovieService.create(req.body);
      res.status(201).send(movie);
    }
  );

  app.delete(
    '/movies/:id',
    checkForRole('admin'),
    async (req, res) => {
      await MovieService.deleteById(req.params.id);
      res.status(204).send();
    }
  );

  app.patch(
    '/movies/:id',
    checkForRole('admin'),
    async (req, res) => {
      const movie = await MovieService.updateById(req.params.id, req.body);
      res.send(movie);
    }
  );
}
